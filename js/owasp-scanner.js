/* ==========================================================================
   owasp-scanner.js — OWASP Top 10 Vulnerability Scanner Dashboard.
   Loaded only on owasp-scanner.html.

   This is an honest SIMULATION, not a real scanner it never sends
   requests anywhere. Findings are picked deterministically from a fixed
   pool based on a hash of whatever URL is typed in, so the same input
   always produces the same report (feels like a real tool, not randomness).
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('[data-scan-form]');
  if (!form) return; // guard: only run on the scanner page

  const input = document.querySelector('[data-scan-input]');
  const scanButton = document.querySelector('[data-scan-button]');
  const statusPanel = document.querySelector('[data-scan-status]');
  const statusText = document.querySelector('[data-scan-status-text]');
  const reportPanel = document.querySelector('[data-scan-report]');
  const summaryBar = document.querySelector('[data-scan-summary]');
  const findingsList = document.querySelector('[data-scan-findings]');
  const emptyState = document.querySelector('[data-scan-empty]');

  const scanSteps = [
    'Resolving target host…',
    'Crawling site structure…',
    'Checking HTTP response headers…',
    'Testing input handling…',
    'Reviewing authentication flow…',
    'Cross-referencing OWASP Top 10 categories…',
    'Compiling report…',
  ];

  const findingPool = [
    {
      category: 'A03: Injection',
      title: 'Unsanitized input on a form field',
      severity: 'critical',
      detail: 'A form field appears to accept raw input without validation, which is the classic entry point for SQL or command injection.',
      remediation: 'Validate and parameterize all inputs server-side; never trust client-side validation alone.',
    },
    {
      category: 'A01: Broken Access Control',
      title: 'Predictable resource identifiers',
      severity: 'critical',
      detail: 'URLs or IDs appear sequential/guessable, meaning a user could potentially access another account\u2019s data by changing a number.',
      remediation: 'Use non-sequential, unguessable identifiers (UUIDs) and enforce server-side ownership checks on every request.',
    },
    {
      category: 'A02: Cryptographic Failures',
      title: 'Missing HTTPS enforcement',
      severity: 'high',
      detail: 'The site does not appear to force secure connections, leaving data exposed to interception on public networks.',
      remediation: 'Enforce HTTPS site-wide with HSTS headers, and redirect all HTTP traffic automatically.',
    },
    {
      category: 'A05: Security Misconfiguration',
      title: 'Verbose error messages exposed',
      severity: 'medium',
      detail: 'Error pages appear to reveal stack traces or server details, which can hand attackers a roadmap of the backend.',
      remediation: 'Use generic error pages in production and log detailed errors privately, server-side only.',
    },
    {
      category: 'A06: Vulnerable and Outdated Components',
      title: 'Outdated library version detected',
      severity: 'high',
      detail: 'A frontend or backend dependency appears to be running an older version with known public vulnerabilities.',
      remediation: 'Set up automated dependency scanning (e.g. Dependabot) and patch on a regular schedule.',
    },
    {
      category: 'A07: Identification and Authentication Failures',
      title: 'No account lockout after failed logins',
      severity: 'high',
      detail: 'Repeated failed login attempts don\u2019t appear to trigger any lockout or delay, leaving room for brute-force attacks.',
      remediation: 'Add rate limiting and progressive delays or lockouts after repeated failed login attempts.',
    },
    {
      category: 'A08: Software and Data Integrity Failures',
      title: 'Unsigned third-party script includes',
      severity: 'medium',
      detail: 'External scripts are loaded without integrity checks, meaning a compromised CDN could silently inject malicious code.',
      remediation: 'Add Subresource Integrity (SRI) hashes to all third-party script tags.',
    },
    {
      category: 'A09: Security Logging and Monitoring Failures',
      title: 'No visible audit logging on sensitive actions',
      severity: 'medium',
      detail: 'Actions like login attempts or data changes don\u2019t appear to be logged anywhere reviewable, making incidents hard to trace after the fact.',
      remediation: 'Log authentication events and sensitive data changes to a monitored, tamper-resistant log store.',
    },
    {
      category: 'A04: Insecure Design',
      title: 'No rate limiting on public API endpoints',
      severity: 'medium',
      detail: 'Public-facing endpoints appear to accept unlimited requests, opening the door to scraping or denial-of-service abuse.',
      remediation: 'Apply rate limiting per IP/user at the API gateway level.',
    },
    {
      category: 'A10: Server-Side Request Forgery',
      title: 'Unvalidated URL fetch parameter',
      severity: 'critical',
      detail: 'A feature that fetches a URL supplied by the user doesn\u2019t appear to restrict which hosts can be targeted, a classic SSRF pattern.',
      remediation: 'Allow-list permitted destination hosts and block requests to internal/private IP ranges.',
    },
  ];

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const target = input.value.trim();
    if (!target) return;

    runScan(target);
  });

  function runScan(target) {
    scanButton.disabled = true;
    scanButton.textContent = 'Scanning…';
    reportPanel.hidden = true;
    statusPanel.hidden = false;

    let stepIndex = 0;
    statusText.textContent = scanSteps[0];

    const stepInterval = setInterval(() => {
      stepIndex++;
      if (stepIndex < scanSteps.length) {
        statusText.textContent = scanSteps[stepIndex];
      } else {
        clearInterval(stepInterval);
        finishScan(target);
      }
    }, 450);
  }

  function finishScan(target) {
    statusPanel.hidden = true;
    reportPanel.hidden = false;
    scanButton.disabled = false;
    scanButton.textContent = 'Run Scan';

    const findings = pickFindings(target);
    renderReport(target, findings);
  }

  /* ---------- Deterministic selection ---------- */
  function hashString(str) {
    // Simple string hash (djb2-style) — same input always produces the
    // same number, which is what makes the "same URL, same report" work.
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return Math.abs(hash);
  }

  function pickFindings(target) {
    const seed = hashString(target.toLowerCase());
    // Pick a count between 3 and 6 findings, and select that many from the
    // pool using the seed to keep selection order deterministic per input.
    const count = 3 + (seed % 4);
    const shuffled = [...findingPool].sort((a, b) => {
      const aKey = hashString(target + a.title) % 1000;
      const bKey = hashString(target + b.title) % 1000;
      return aKey - bKey;
    });
    return shuffled.slice(0, count);
  }

  /* ---------- Rendering ---------- */
  function renderReport(target, findings) {
    const counts = { critical: 0, high: 0, medium: 0 };
    findings.forEach((f) => counts[f.severity]++);

    summaryBar.innerHTML = '';
    const summaryItems = [
      { label: 'Target', value: target, isText: true },
      { label: 'Critical', value: counts.critical, severity: 'critical' },
      { label: 'High', value: counts.high, severity: 'high' },
      { label: 'Medium', value: counts.medium, severity: 'medium' },
    ];

    summaryItems.forEach((item) => {
      const el = document.createElement('div');
      el.className = 'scan-summary-item';
      const value = document.createElement('span');
      value.className = 'scan-summary-value' + (item.severity ? ` severity-text-${item.severity}` : '');
      value.textContent = item.value;
      const label = document.createElement('span');
      label.className = 'scan-summary-label';
      label.textContent = item.label;
      el.append(value, label);
      summaryBar.appendChild(el);
    });

    findingsList.innerHTML = '';

    if (findings.length === 0) {
      emptyState.hidden = false;
      return;
    }

    emptyState.hidden = true;
    findings.forEach((finding) => {
      const li = document.createElement('li');
      li.className = 'scan-finding-row';

      const header = document.createElement('div');
      header.className = 'scan-finding-header';

      const badge = document.createElement('span');
      badge.className = `severity-badge severity-${finding.severity}`;
      badge.textContent = finding.severity;

      const category = document.createElement('span');
      category.className = 'scan-finding-category';
      category.textContent = finding.category;

      header.append(badge, category);

      const title = document.createElement('h3');
      title.className = 'scan-finding-title';
      title.textContent = finding.title;

      const detail = document.createElement('p');
      detail.className = 'scan-finding-detail';
      detail.textContent = finding.detail;

      const remediation = document.createElement('p');
      remediation.className = 'scan-finding-remediation';
      remediation.innerHTML = `<strong>Remediation:</strong> ${finding.remediation}`;

      li.append(header, title, detail, remediation);
      findingsList.appendChild(li);
    });
  }
});