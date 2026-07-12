document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initTypingAnimation();
  initScrollReveal();
  initAudioToggle();
});


function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });


  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function initTypingAnimation() {
  const el = document.querySelector('[data-typing]');
  if (!el) return;

  const phrases = ['Securing Systems.', 'Solving Problems.'];
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const textNode = document.createElement('span');
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  cursor.setAttribute('aria-hidden', 'true');
  el.textContent = '';
  el.append(textNode, cursor);

  function tick() {
    const current = phrases[phraseIndex];

    if (!deleting) {
      charIndex++;
      textNode.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        return setTimeout(tick, 1400); // pause on full phrase
      }
    } else {
      charIndex--;
      textNode.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        return setTimeout(tick, 400); // pause before next phrase
      }
    }

    setTimeout(tick, deleting ? 40 : 65);
  }

  tick();
}

/* ---------- 3. Scroll-reveal ---------- */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach((t) => t.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((t) => observer.observe(t));
}

/* ---------- 4. Audio toggle ---------- */
function initAudioToggle() {
  const button = document.querySelector('[data-audio-toggle]');
  const audio = document.querySelector('[data-ambient-audio]');
  if (!button || !audio) return;

  const label = button.querySelector('[data-audio-label]');

  button.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().catch(() => {
        /* Autoplay-policy or missing-file rejection — fail silently,
           the toggle simply stays in its "muted" state. */
      });
    } else {
      audio.pause();
    }
  });

  audio.addEventListener('play', () => {
    button.classList.add('playing');
    button.setAttribute('aria-pressed', 'true');
    if (label) label.textContent = 'Sound: on';
  });

  audio.addEventListener('pause', () => {
    button.classList.remove('playing');
    button.setAttribute('aria-pressed', 'false');
    if (label) label.textContent = 'Sound: off';
  });
}