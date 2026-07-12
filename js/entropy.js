/* ==========================================================================
   entropy.js — Password Entropy & Breach-Pattern Analyzer.
   Loaded only on entropy-analyzer.html.

   Two things run on every keystroke:
   1. Shannon-style entropy estimate based on character-set size and length
   2. Pattern detection: keyboard walks, leetspeak substitutions, common
      breach-list patterns (repeated chars, sequential digits, etc.)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const input = document.querySelector('[data-password-input]');
  const toggle = document.querySelector('[data-toggle-visibility]');
  if (!input) return; // guard: only run on the analyzer page

  const entropyValue = document.querySelector('[data-entropy-value]');
  const entropyBar = document.querySelector('[data-entropy-bar]');
  const entropyRating = document.querySelector('[data-entropy-rating]');
  const findingsList = document.querySelector('[data-findings-list]');
  const findingsEmpty = document.querySelector('[data-findings-empty]');

  input.addEventListener('input', () => {
    const value = input.value;
    const bits = calculateEntropy(value);
    updateEntropyDisplay(bits, value.length);
    renderFindings(detectPatterns(value));
  });

  toggle.addEventListener('click', () => {
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    toggle.textContent = isPassword ? 'Hide' : 'Show';
    toggle.setAttribute('aria-pressed', String(isPassword));
  });

  /* ---------- Entropy calculation ---------- */
  function calculateEntropy(value) {
    if (!value) return 0;

    // Determine which character sets are actually present — entropy per
    // character depends on how large a "pool" an attacker must brute-force.
    let poolSize = 0;
    if (/[a-z]/.test(value)) poolSize += 26;
    if (/[A-Z]/.test(value)) poolSize += 26;
    if (/[0-9]/.test(value)) poolSize += 10;
    if (/[^a-zA-Z0-9]/.test(value)) poolSize += 32; // common symbol range

    if (poolSize === 0) return 0;

    // Shannon entropy estimate: bits = length × log2(pool size)
    const bits = value.length * Math.log2(poolSize);
    return Math.round(bits * 10) / 10;
  }

  function updateEntropyDisplay(bits, length) {
    entropyValue.textContent = length === 0 ? '0' : bits.toString();

    // Map bits to a 0–100 visual scale, capped at 100 bits as "excellent"
    const percent = Math.min(100, Math.round((bits / 100) * 100));
    entropyBar.style.width = `${percent}%`;

    let rating = 'No input yet';
    let ratingClass = '';
    if (length > 0) {
      if (bits < 28) {
        rating = 'Very Weak — crackable in seconds';
        ratingClass = 'severity-critical';
      } else if (bits < 36) {
        rating = 'Weak — crackable in hours to days';
        ratingClass = 'severity-critical';
      } else if (bits < 60) {
        rating = 'Moderate — crackable with sustained effort';
        ratingClass = 'severity-high';
      } else if (bits < 80) {
        rating = 'Strong — impractical to brute-force today';
        ratingClass = 'severity-medium';
      } else {
        rating = 'Excellent — very high resistance to brute-force';
        ratingClass = '';
      }
    }

    entropyRating.textContent = rating;
    entropyRating.className = 'entropy-rating ' + ratingClass;
    entropyBar.className = 'entropy-fill ' + ratingClass;
  }

  /* ---------- Pattern detection ---------- */
  function detectPatterns(value) {
    const findings = [];
    if (!value) return findings;

    if (value.length < 8) {
      findings.push({
        severity: 'critical',
        label: 'Too short',
        detail: 'Under 8 characters. Shorter passwords shrink the search space attackers need to try.',
      });
    }

    if (/^[a-zA-Z]+$/.test(value)) {
      findings.push({
        severity: 'high',
        label: 'Letters only',
        detail: 'No numbers or symbols — this cuts the character pool an attacker has to guess from.',
      });
    }

    if (/(.)\1{2,}/.test(value)) {
      findings.push({
        severity: 'high',
        label: 'Repeated characters',
        detail: 'Contains the same character repeated 3+ times in a row (e.g. "aaa"), a common weak pattern.',
      });
    }

    if (hasKeyboardWalk(value)) {
      findings.push({
        severity: 'critical',
        label: 'Keyboard walk detected',
        detail: 'Matches a sequence of adjacent keys (e.g. "qwerty", "asdf") — one of the first patterns attackers try.',
      });
    }

    if (hasSequentialDigits(value)) {
      findings.push({
        severity: 'high',
        label: 'Sequential digits',
        detail: 'Contains an ascending or descending number run (e.g. "1234" or "4321").',
      });
    }

    if (hasLeetspeak(value)) {
      findings.push({
        severity: 'medium',
        label: 'Leetspeak substitution',
        detail: 'Common substitutions like a→@, e→3, i→1, o→0 are well known to cracking dictionaries and add little real strength.',
      });
    }

    if (isCommonWeakPassword(value)) {
      findings.push({
        severity: 'critical',
        label: 'Matches a common password',
        detail: 'This appears on well-known breach/common-password lists — it will be tried first in any real attack.',
      });
    }

    return findings;
  }

  function hasKeyboardWalk(value) {
    const rows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm', '1234567890'];
    const lower = value.toLowerCase();
    return rows.some((row) => {
      for (let i = 0; i <= row.length - 4; i++) {
        const forward = row.slice(i, i + 4);
        const backward = forward.split('').reverse().join('');
        if (lower.includes(forward) || lower.includes(backward)) return true;
      }
      return false;
    });
  }

  function hasSequentialDigits(value) {
    const digitRuns = value.match(/\d{3,}/g);
    if (!digitRuns) return false;
    return digitRuns.some((run) => {
      let ascending = true;
      let descending = true;
      for (let i = 1; i < run.length; i++) {
        if (Number(run[i]) !== Number(run[i - 1]) + 1) ascending = false;
        if (Number(run[i]) !== Number(run[i - 1]) - 1) descending = false;
      }
      return ascending || descending;
    });
  }

  function hasLeetspeak(value) {
    return /[@34310!$]/.test(value) && /[a-zA-Z]/.test(value);
  }

  function isCommonWeakPassword(value) {
    const common = [
      'password', 'password1', '123456', '12345678', 'qwerty', 'letmein',
      'admin', 'welcome', 'monkey', 'iloveyou', 'abc123', 'football',
    ];
    return common.includes(value.toLowerCase());
  }

  function renderFindings(findings) {
    findingsList.innerHTML = '';

    if (findings.length === 0) {
      findingsEmpty.hidden = false;
      return;
    }

    findingsEmpty.hidden = true;
    findings.forEach((finding) => {
      const li = document.createElement('li');
      li.className = 'finding-row';

      const badge = document.createElement('span');
      badge.className = `severity-badge severity-${finding.severity}`;
      badge.textContent = finding.severity;

      const textWrap = document.createElement('div');
      const title = document.createElement('strong');
      title.textContent = finding.label;
      const detail = document.createElement('p');
      detail.textContent = finding.detail;
      textWrap.append(title, detail);

      li.append(badge, textWrap);
      findingsList.appendChild(li);
    });
  }
});