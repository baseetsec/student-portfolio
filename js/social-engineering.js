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
