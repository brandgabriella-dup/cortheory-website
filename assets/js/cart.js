// ══════════════════════════════════════════════════════════════════════════════
// SHOPPING CART - COMPLETE SYSTEM
// ══════════════════════════════════════════════════════════════════════════════

const CART_STORAGE_KEY = 'cortheory_cart';
const FREE_SHIPPING_THRESHOLD = 1500;
const SHIPPING_COST = 150;

// Cart state
let cartItems = [];

// DOM elements
const cartOverlay = document.getElementById('cartOverlay');
const cartPanel = document.getElementById('cartPanel');
const cartClose = document.getElementById('cartClose');
const cartBadge = document.getElementById('cartBadge');
const cartItemsContainer = document.getElementById('cartItems');
const checkoutCard = document.getElementById('checkoutCard');
const shippingFill = document.getElementById('shippingFill');
const shippingAmount = document.getElementById('shippingAmount');
const subtotalPrice = document.getElementById('subtotalPrice');
const shippingPrice = document.getElementById('shippingPrice');
const totalPrice = document.getElementById('totalPrice');
const proceedCheckout = document.getElementById('proceedCheckout');

// ── Initialize ────────────────────────────────────────────────
function init() {
  loadCart();
  attachAddToCartListeners();
  attachCartControls();
  updateUI();
}

// ── Cart Operations ────────────────────────────────────────────

function loadCart() {
  const saved = localStorage.getItem(CART_STORAGE_KEY);
  cartItems = saved ? JSON.parse(saved) : [];
}

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
}

function addToCart(product) {
  const existing = cartItems.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cartItems.push({
      id: product.id,
      name: product.name,
      variant: product.variant,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  saveCart();
  updateUI();
  openCart();
}

function removeFromCart(productId) {
  const item = cartItemsContainer.querySelector(`[data-id="${productId}"]`);
  if (item) {
    item.style.animation = 'slideOut 0.2s ease forwards';
    setTimeout(() => {
      cartItems = cartItems.filter(item => item.id !== productId);
      saveCart();
      updateUI();
    }, 200);
  }
}

function updateQuantity(productId, delta) {
  const item = cartItems.find(item => item.id === productId);
  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    saveCart();
    updateUI();
  }
}

// ── UI Rendering ────────────────────────────────────────────────

function updateUI() {
  renderCartItems();
  updateBadge();
  updateTotals();
  updateShippingBar();
  updateCheckoutCard();
}

function renderCartItems() {
  cartItemsContainer.innerHTML = '';

  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty">
        <svg class="cart-empty__icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        </svg>
        <p class="cart-empty__text">Your cart is empty</p>
      </div>
    `;
    return;
  }

  cartItems.forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.setAttribute('data-id', item.id);
    itemEl.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item__image" />
      <div class="cart-item__content">
        <div class="cart-item__name">${item.name}</div>
        <div class="cart-item__variant">${item.variant}</div>
        <div class="cart-item__stepper">
          <button class="cart-item__stepper-btn qty-minus" data-id="${item.id}">−</button>
          <input type="text" class="cart-item__qty" value="${item.quantity}" readonly />
          <button class="cart-item__stepper-btn qty-plus" data-id="${item.id}">+</button>
        </div>
      </div>
      <span class="cart-item__price">$${(item.price * item.quantity).toFixed(2)}</span>
      <button class="cart-item__remove" data-id="${item.id}" aria-label="Remove">🗑</button>
    `;
    cartItemsContainer.appendChild(itemEl);
  });

  // Attach event listeners
  cartItemsContainer.querySelectorAll('.qty-minus').forEach(btn => {
    btn.addEventListener('click', () => updateQuantity(btn.dataset.id, -1));
  });

  cartItemsContainer.querySelectorAll('.qty-plus').forEach(btn => {
    btn.addEventListener('click', () => updateQuantity(btn.dataset.id, 1));
  });

  cartItemsContainer.querySelectorAll('.cart-item__remove').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(btn.dataset.id));
  });
}

function updateBadge() {
  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  cartBadge.textContent = count;
}

function updateTotals() {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  subtotalPrice.textContent = `$${subtotal.toFixed(2)}`;
  shippingPrice.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
  totalPrice.textContent = `$${total.toFixed(2)}`;
}

function updateShippingBar() {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const percentage = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  shippingFill.style.width = `${percentage}%`;

  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    shippingAmount.textContent = 'Free shipping unlocked!';
  } else {
    const remaining = (FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2);
    shippingAmount.textContent = `$${remaining} away`;
  }
}

function updateCheckoutCard() {
  if (cartItems.length === 0) {
    checkoutCard.style.display = 'none';
    proceedCheckout.disabled = true;
  } else {
    checkoutCard.style.display = 'block';
    proceedCheckout.disabled = false;
  }
}

// ── Cart Controls ────────────────────────────────────────────────

function openCart() {
  cartOverlay.classList.add('open');
  cartPanel.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartOverlay.classList.remove('open');
  cartPanel.classList.remove('open');
  document.body.style.overflow = '';
}

function attachCartControls() {
  // Open cart: look for nav cart icon
  const cartIcon = document.querySelector('[data-cart]');
  if (cartIcon) {
    cartIcon.addEventListener('click', openCart);
  }

  // Close cart
  cartClose.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  // Checkout button
  proceedCheckout.addEventListener('click', () => {
    window.location.href = 'checkout.html';
  });
}

// ── Add to Bag Buttons ────────────────────────────────────────────

function attachAddToCartListeners() {
  document.querySelectorAll('.product-card__btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      const card = btn.closest('.product-card');
      const nameEl = card.querySelector('.product-card__name');
      const priceEl = card.querySelector('.product-card__price');
      const imgEl = card.querySelector('.product-card__img');

      if (!nameEl || !priceEl || !imgEl) return;

      const name = nameEl.textContent.trim();
      const price = parseFloat(priceEl.textContent.replace('R ', '').replace(',', ''));
      const image = imgEl.src;

      addToCart({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name: name,
        variant: 'Research Grade',
        price: price,
        image: image
      });
    });
  });
}

// ── Initialize on load ────────────────────────────────────────────

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
