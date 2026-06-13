// ── Nav scroll effect ────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// ── Mobile nav ──────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
hamburger.addEventListener('click', () => mobileNav.classList.toggle('open'));
mobileNav.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => mobileNav.classList.remove('open'))
);

// ── Quality tabs ────────────────────────────────────────────
document.querySelectorAll('.quality__tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const key = tab.dataset.tab;
    document.querySelectorAll('.quality__tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.quality__panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.querySelector(`.quality__panel[data-panel="${key}"]`).classList.add('active');
  });
});

// ── FAQ accordion ────────────────────────────────────────────
document.querySelectorAll('.faq__item').forEach(item => {
  item.querySelector('.faq__btn').addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq__item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ── Horizontal scroll drag ──────────────────────────────────
const row = document.getElementById('productsRow');
if (row) {
  let isDown = false, startX, scrollLeft;
  row.addEventListener('mousedown', e => {
    isDown = true;
    startX = e.pageX - row.offsetLeft;
    scrollLeft = row.scrollLeft;
  });
  row.addEventListener('mouseleave', () => { isDown = false; });
  row.addEventListener('mouseup', () => { isDown = false; });
  row.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - row.offsetLeft;
    row.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });
}

// ── Cart drawer ─────────────────────────────────────────────
// Cart functionality moved to cart.js for better modularity

// ── Smooth scroll ────────────────────────────────────────────
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

// ── CART MANAGEMENT SYSTEM ────────────────────────────────────
// All cart functionality has been moved to cart.js

// ── PARTNER MODAL ─────────────────────────────────────────────
const partnerModal = document.getElementById('partnerModal');
const partnerModalOverlay = document.getElementById('partnerModalOverlay');
const partnerFormBtn = document.getElementById('partnerFormBtn');
const footerPartnerBtn = document.getElementById('footerPartnerBtn');
const partnerModalClose = document.getElementById('partnerModalClose');
const partnerForm = document.getElementById('partnerForm');

function openPartnerModal() {
  partnerModal.classList.add('open');
  partnerModalOverlay.classList.add('open');
}

function closePartnerModal() {
  partnerModal.classList.remove('open');
  partnerModalOverlay.classList.remove('open');
}

partnerFormBtn.addEventListener('click', openPartnerModal);
if (footerPartnerBtn) footerPartnerBtn.addEventListener('click', (e) => { e.preventDefault(); openPartnerModal(); });
partnerModalClose.addEventListener('click', closePartnerModal);
partnerModalOverlay.addEventListener('click', closePartnerModal);

partnerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('partnerName').value;
  const email = document.getElementById('partnerEmail').value;
  const phone = document.getElementById('partnerPhone').value;
  console.log('Partner Application:', { name, email, phone });
  alert(`Thank you ${name}! We'll contact you at ${email} soon.`);
  partnerForm.reset();
  closePartnerModal();
});
