document.addEventListener('DOMContentLoaded', () => {
  initProjectFilter();
  initThumbFallback();
});

/* ---------- Filter buttons ---------- */
function initProjectFilter() {
  const buttons = document.querySelectorAll('[data-filter]');
  const cards = document.querySelectorAll('[data-category]');
  if (!buttons.length || !cards.length) return;

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;

      // Update active button state
      buttons.forEach((b) => b.classList.remove('is-active'));
      button.classList.add('is-active');

      // Show/hide matching cards
      cards.forEach((card) => {
        const matches = filter === 'all' || card.dataset.category === filter;
        card.style.display = matches ? '' : 'none';
      });
    });
  });
}

/* ---------- Broken image fallback ----------
   If a screenshot hasn't been added yet, swap the <img> for a simple
   labelled placeholder block instead of showing a broken-image icon. */
function initThumbFallback() {
  document.querySelectorAll('[data-thumb-img]').forEach((img) => {
    img.addEventListener('error', () => {
      const wrapper = img.closest('[data-thumb]');
      if (!wrapper) return;
      img.remove();
      const fallback = wrapper.querySelector('[data-thumb-fallback]');
      if (fallback) fallback.hidden = false;
    }, { once: true });
  });
}