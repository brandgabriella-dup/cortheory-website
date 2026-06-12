// ── FAQ accordion ────────────────────────────────────
document.querySelectorAll('.wwu-faq__item').forEach(item => {
  item.querySelector('.wwu-faq__btn').addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.wwu-faq__item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ── Smooth scroll ────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
