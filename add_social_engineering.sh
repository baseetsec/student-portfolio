#!/bin/bash
set -e
cd ~/student-portfolio

echo "Step 1/5: Creating social-engineering.html..."
cat > social-engineering.html << 'HTMLEOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Social Engineering Attack Simulator | Saheed Baseet Boluwatife</title>
  <meta name="description" content="A live, working interactive phishing-detection quiz — a real demo of one of Saheed Baseet Boluwatife's security projects." />
  <link rel="icon" type="image/svg+xml" href="favicon.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>

  <header class="site-header">
    <nav class="navbar container" aria-label="Primary">
      <a href="index.html" class="nav-brand">baseet<span class="brand-dot">.</span>sec</a>
      <button class="nav-toggle" aria-label="Toggle navigation menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav-links">
        <li><a href="index.html">Home</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="projects.html" aria-current="page">Projects</a></li>
        <li><a href="planner.html">Planner</a></li>
        <li><a href="contact.html">Contact</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <!-- ============ PAGE HEADER ============ -->
    <section class="container reveal" style="padding-bottom: 0;">
      <p class="eyebrow">Live Demo &middot; <a href="projects.html" style="color: var(--accent-text); text-decoration: underline;">Back to Projects</a></p>
      <h1>Social Engineering Attack Simulator</h1>
      <p style="margin-top: 12px; max-width: 65ch;">
        You'll see one message at a time, across email, text, and phone-call transcripts.
        Decide whether it's legitimate or phishing, then see the real reasoning behind
        the answer. All scenarios are original and fictional — no real brands or people.
      </p>
    </section>

    <!-- ============ QUIZ ============ -->
    <section class="container reveal">
      <div class="console-panel">
        <div class="console-panel-header">
          <span class="console-dot console-dot-red"></span>
          <span class="console-dot console-dot-yellow"></span>
          <span class="console-dot console-dot-green"></span>
          <span class="console-title">social_eng_sim.py</span>
        </div>

        <div class="analyzer-body">
          <!-- Score / progress -->
          <div class="progress-panel" style="padding: 16px 20px;">
            <div class="progress-panel-header" style="margin-bottom: 10px;">
              <span class="progress-label" data-score-label>Score: 0 / 8</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill" data-quiz-progress></div>
            </div>
          </div>

          <!-- Scenario card -->
          <div class="se-scenario" data-scenario-panel>
            <div class="se-scenario-meta">
              <span class="se-channel-badge" data-scenario-channel>Email</span>
              <span class="se-from" data-scenario-from></span>
            </div>
            <h3 class="se-subject" data-scenario-subject hidden></h3>
            <p class="se-body" data-scenario-body></p>

            <div class="se-answer-row">
              <button type="button" class="btn btn-outline" data-answer-legit>Looks Legit</button>
              <button type="button" class="btn btn-primary" data-answer-phish>This Is Phishing</button>
            </div>
          </div>

          <!-- Feedback -->
          <div class="se-feedback" data-feedback-panel hidden>
            <p class="se-verdict" data-feedback-verdict></p>
            <p class="se-explain" data-feedback-explain></p>
            <button type="button" class="btn btn-primary" data-next-button>Next Scenario →</button>
          </div>

          <!-- Results -->
          <div class="se-results" data-results-panel hidden>
            <h3 style="margin-bottom: 8px;">Quiz Complete</h3>
            <p class="se-results-score" data-results-score></p>
            <button type="button" class="btn btn-primary" data-restart-button>Try Again</button>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ HOW IT WORKS ============ -->
    <section class="container reveal">
      <p class="eyebrow">How This Works</p>
      <h2>The reasoning behind the tool</h2>
      <p style="max-width: 65ch;">
        Each scenario is drawn from a fixed set of eight original examples covering common
        real-world attack patterns: lookalike domains, shortened-link smishing, pretexting
        phone calls, business email compromise, and family-emergency scams, alongside
        genuinely legitimate messages for contrast. The goal isn't to trick with obscure
        edge cases, but to reinforce the small, concrete signals security professionals
        actually look for first: sender domain mismatches, artificial urgency, and requests
        for credentials or money that a legitimate sender would never make this way.
      </p>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container footer-inner">
      <p class="footer-brand">&copy; 2026 Saheed Baseet Boluwatife. Built with HTML, CSS &amp; JavaScript.</p>
      <div class="footer-links">
        <button class="audio-toggle" data-audio-toggle type="button" aria-pressed="false">
          <span class="bars"><span></span><span></span><span></span></span>
          <span data-audio-label>Sound: off</span>
        </button>
        <a href="https://github.com/baseetsec" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
        <a href="mailto:baseetboluwat@gmail.com">Email</a>
      </div>
    </div>
  </footer>

  <audio data-ambient-audio loop preload="none">
    <source src="assets/audio/ambient-terminal.mp3" type="audio/mpeg" />
  </audio>

  <script src="js/main.js"></script>
  <script src="js/social-engineering.js"></script>
</body>
</html>
HTMLEOF

echo "Step 2/5: Creating js/social-engineering.js..."
cat > js/social-engineering.js << 'JSEOF'
document.addEventListener('DOMContentLoaded', () => {
  const scenarioPanel = document.querySelector('[data-scenario-panel]');
  if (!scenarioPanel) return;

  const channelLabel = document.querySelector('[data-scenario-channel]');
  const fromLabel = document.querySelector('[data-scenario-from]');
  const subjectLabel = document.querySelector('[data-scenario-subject]');
  const bodyText = document.querySelector('[data-scenario-body]');
  const legitButton = document.querySelector('[data-answer-legit]');
  const phishButton = document.querySelector('[data-answer-phish]');
  const feedbackPanel = document.querySelector('[data-feedback-panel]');
  const feedbackVerdict = document.querySelector('[data-feedback-verdict]');
  const feedbackExplain = document.querySelector('[data-feedback-explain]');
  const nextButton = document.querySelector('[data-next-button]');
  const scoreLabel = document.querySelector('[data-score-label]');
  const progressBar = document.querySelector('[data-quiz-progress]');
  const resultsPanel = document.querySelector('[data-results-panel]');
  const resultsScore = document.querySelector('[data-results-score]');
  const restartButton = document.querySelector('[data-restart-button]');

  const scenarios = [
    { channel: 'Email', from: 'support@paypa1-security.com', subject: 'Urgent: Your account has been limited', body: 'We noticed unusual activity on your account. Click the link below within 24 hours to verify your identity or your account will be permanently suspended.', isPhishing: true, explanation: 'The sender domain uses a "1" instead of an "l" ("paypa1" not "paypal"), a common lookalike-domain trick. Combined with urgency and a 24-hour threat, this is a classic phishing pattern designed to rush you past careful reading.' },
    { channel: 'Text Message', from: '+1 (555) 019-2837', subject: null, body: 'Hi, this is Dara from the front desk. Your package delivery attempt failed. Reschedule here: bit.ly/pkg-resched29', isPhishing: true, explanation: 'A shortened link (bit.ly) hides the real destination, and an unexpected delivery text pressuring you to click immediately is a very common smishing (SMS phishing) pattern.' },
    { channel: 'Email', from: 'newsletter@nationalgeographic.com', subject: 'This week: inside the world\u2019s deepest cave systems', body: 'Explore new photography from our latest expedition, plus three reader-submitted photos from this month\u2019s contest.', isPhishing: false, explanation: 'This is a standard newsletter: no urgency, no request for credentials or personal information, no suspicious links, and a domain that matches the well-known brand exactly.' },
    { channel: 'Phone Call (transcript)', from: 'Caller ID: "IT Helpdesk"', subject: null, body: 'Hi, this is Marcus from IT. We\u2019re seeing failed login attempts on your account. Can you confirm your username and current password so I can lock it down on our end?', isPhishing: true, explanation: 'This is a pretexting attack: a real IT team never needs your actual password to secure your account, since they can reset it directly on their end. Asking you to say your password out loud is the giveaway.' },
    { channel: 'Email', from: 'billing@yourcompany-payroll.com', subject: 'Updated direct deposit form required by Friday', body: 'HR requires all staff to resubmit direct deposit information using the attached form due to a recent system migration. Please complete and return by end of week.', isPhishing: true, explanation: 'A domain that isn\u2019t your actual company\u2019s domain, a request for banking details via email attachment, and an artificial deadline are all classic business email compromise (BEC) tactics.' },
    { channel: 'Email', from: 'no-reply@github.com', subject: 'Your GitHub sign-in from a new device', body: 'We noticed a new sign-in to your account from a device we don\u2019t recognize. If this was you, no action is needed. If not, please secure your account immediately.', isPhishing: false, explanation: 'This is a standard, expected security notification: it comes from the real domain, does not demand immediate credential entry, and gives a calm, informational tone rather than a threat.' },
    { channel: 'Text Message', from: '+44 7700 900123', subject: null, body: 'MUM I lost my phone, this is my new number. Can you send me $200 quickly, I\u2019ll explain later and pay you back tonight.', isPhishing: true, explanation: 'This is a family-emergency pretexting scam: urgency, a request for money, and an unverifiable claim of identity from an unknown number are the exact pattern attackers use to bypass careful thinking.' },
    { channel: 'Email', from: 'events@your-university.edu', subject: 'Reminder: Career fair this Thursday, 10am-3pm', body: 'Don\u2019t forget to bring printed copies of your resume. Business casual dress is recommended. See the full list of attending employers on the student portal.', isPhishing: false, explanation: 'A routine, expected announcement from a legitimate .edu domain, with no links to click, no credentials requested, and content that matches what the sender would normally send.' },
  ];

  let currentIndex = 0;
  let score = 0;
  let answered = false;

  function loadScenario(index) {
    const scenario = scenarios[index];
    channelLabel.textContent = scenario.channel;
    fromLabel.textContent = scenario.from;
    if (scenario.subject) { subjectLabel.hidden = false; subjectLabel.textContent = scenario.subject; }
    else { subjectLabel.hidden = true; }
    bodyText.textContent = scenario.body;
    feedbackPanel.hidden = true;
    scenarioPanel.hidden = false;
    resultsPanel.hidden = true;
    answered = false;
    legitButton.disabled = false;
    phishButton.disabled = false;
    updateProgress();
  }

  function updateProgress() {
    const percent = Math.round((currentIndex / scenarios.length) * 100);
    progressBar.style.width = `${percent}%`;
    scoreLabel.textContent = `Score: ${score} / ${scenarios.length} — Scenario ${currentIndex + 1} of ${scenarios.length}`;
  }

  function submitAnswer(userSaysPhishing) {
    if (answered) return;
    answered = true;
    legitButton.disabled = true;
    phishButton.disabled = true;
    const scenario = scenarios[currentIndex];
    const correct = userSaysPhishing === scenario.isPhishing;
    if (correct) score++;
    feedbackPanel.hidden = false;
    feedbackVerdict.textContent = correct
      ? (scenario.isPhishing ? 'Correct — this was phishing.' : 'Correct — this was legitimate.')
      : (scenario.isPhishing ? 'Missed it — this was actually phishing.' : 'Not quite — this was actually legitimate.');
    feedbackVerdict.className = 'se-verdict ' + (correct ? 'se-verdict-correct' : 'se-verdict-incorrect');
    feedbackExplain.textContent = scenario.explanation;
  }

  legitButton.addEventListener('click', () => submitAnswer(false));
  phishButton.addEventListener('click', () => submitAnswer(true));

  nextButton.addEventListener('click', () => {
    currentIndex++;
    if (currentIndex < scenarios.length) { loadScenario(currentIndex); }
    else { showResults(); }
  });

  function showResults() {
    scenarioPanel.hidden = true;
    feedbackPanel.hidden = true;
    resultsPanel.hidden = false;
    progressBar.style.width = '100%';
    const percent = Math.round((score / scenarios.length) * 100);
    let verdict;
    if (percent === 100) verdict = 'Perfect score — sharp eye for red flags.';
    else if (percent >= 75) verdict = 'Strong result — you caught most of the red flags.';
    else if (percent >= 50) verdict = 'Decent start — a few patterns slipped through.';
    else verdict = 'Worth another attempt — review the explanations and try again.';
    resultsScore.textContent = `${score} / ${scenarios.length} (${percent}%) — ${verdict}`;
  }

  restartButton.addEventListener('click', () => {
    currentIndex = 0;
    score = 0;
    loadScenario(0);
  });

  loadScenario(0);
});
JSEOF

echo "Step 3/5: Adding CSS..."
cat > /tmp/se_css_snippet.css << 'CSSEOF'
/* ---------- Social engineering quiz page ---------- */
.se-scenario { background: var(--bg-elevated-hover); border: 1px solid var(--border); border-radius: var(--radius); padding: calc(var(--unit) * 3); }
.se-scenario-meta { display: flex; align-items: center; gap: calc(var(--unit) * 1.5); margin-bottom: calc(var(--unit) * 1.5); flex-wrap: wrap; }
.se-channel-badge { font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--accent-text); border: 1px solid var(--border-hover); border-radius: 4px; padding: calc(var(--unit) * 0.5) var(--unit); }
.se-from { font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-secondary); }
.se-subject { font-size: 1.05rem; margin-bottom: calc(var(--unit) * 1.5); }
.se-body { font-size: 0.95rem; line-height: 1.6; color: var(--text-primary); background: var(--bg-primary); border-left: 2px solid var(--border-hover); padding: calc(var(--unit) * 2); border-radius: 0 4px 4px 0; margin-bottom: calc(var(--unit) * 3); }
.se-answer-row { display: flex; gap: calc(var(--unit) * 2); flex-wrap: wrap; }
.se-feedback { background: var(--bg-elevated-hover); border: 1px solid var(--border); border-radius: var(--radius); padding: calc(var(--unit) * 3); }
.se-verdict { font-family: var(--font-mono); font-size: 1rem; font-weight: 700; margin-bottom: calc(var(--unit) * 1.5); }
.se-verdict-correct { color: #3fb950; }
.se-verdict-incorrect { color: var(--severity-critical); }
.se-explain { font-size: 0.92rem; margin-bottom: calc(var(--unit) * 3); }
.se-results { text-align: center; background: var(--bg-elevated-hover); border: 1px solid var(--border); border-radius: var(--radius); padding: calc(var(--unit) * 5) calc(var(--unit) * 3); }
.se-results-score { font-family: var(--font-mono); font-size: 1.1rem; color: var(--accent-text); margin-bottom: calc(var(--unit) * 3); }
@media (max-width: 560px) { .se-answer-row { flex-direction: column; } .se-answer-row button { width: 100%; justify-content: center; } }

CSSEOF

if grep -q "Social engineering quiz page" css/style.css; then
  echo "  (CSS already present, skipping insert)"
else
  awk '/\/\* ---------- OWASP scanner page ---------- \*\//{while((getline line < "/tmp/se_css_snippet.css") > 0) print line} {print}' css/style.css > css/style.css.new
  mv css/style.css.new css/style.css
fi

echo "Step 4/5: Linking the project card in projects.html..."
python3 << 'PYEOF'
path = "projects.html"
content = open(path, encoding="utf-8").read()
old = """          <h3>Social Engineering Attack Simulator</h3>
          <p>
            An interactive module testing users' ability to spot phishing, smishing, and
            pretexting red flags across realistic scenarios, with a live detection score.
          </p>
        </article>"""
new = """          <h3>Social Engineering Attack Simulator</h3>
          <p>
            An interactive module testing users' ability to spot phishing, smishing, and
            pretexting red flags across realistic scenarios, with a live detection score.
          </p>
          <a href="social-engineering.html" class="btn btn-primary project-link">
            Try the Live Demo →
          </a>
        </article>"""
if old in content:
    content = content.replace(old, new)
    open(path, "w", encoding="utf-8").write(content)
    print("  Link added.")
else:
    print("  (Link already present or pattern not found — check manually if needed)")
PYEOF

echo "Step 5/5: Pushing to GitHub..."
git add .
git commit -m "Add social engineering simulator live demo" || echo "  (nothing new to commit)"
git push

echo ""
echo "Done. Test it at your live site: /social-engineering.html"
