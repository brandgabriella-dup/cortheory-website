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

  cartItems.forEach((item, index) => {
    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.setAttribute('data-id', item.id);
    itemEl.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item__image" />
      <div class="cart-item__content">
        <div class="cart-item__name">${item.name}</div>
        <div class="cart-item__variant">${item.variant}</div>
        <div class="cart-item__stepper" data-id="${item.id}">
          <div style="display:inline-flex; align-items:center; border:1px solid #e8e5e0; border-radius:999px; overflow:hidden; height:36px;">
            <button onclick="updateQuantity('${item.id}', -1)" style="width:36px; height:36px; background:white; border:none; cursor:pointer; font-size:16px; color:#0f0f0f; display:flex; align-items:center; justify-content:center; flex-shrink:0;">−</button>
            <span class="qty-display-${item.id}" style="min-width:24px; text-align:center; font-size:13px; font-weight:500; color:#0f0f0f; font-family:Inter,sans-serif;">${item.quantity}</span>
            <button onclick="updateQuantity('${item.id}', 1)" style="width:36px; height:36px; background:white; border:none; cursor:pointer; font-size:16px; color:#0f0f0f; display:flex; align-items:center; justify-content:center; flex-shrink:0;">+</button>
          </div>
        </div>
      </div>
      <span class="cart-item__price">R${(item.price * item.quantity).toFixed(2)}</span>
      <button class="cart-item__remove" data-id="${item.id}" aria-label="Remove">🗑</button>
    `;
    cartItemsContainer.appendChild(itemEl);
  });

  // Attach remove listeners
  cartItemsContainer.querySelectorAll('.cart-item__remove').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(btn.dataset.id));
  });

  // Add Frequently Bought Together section
  const fbtSection = document.createElement('div');
  fbtSection.innerHTML = `
    <div style="padding:20px 20px 0; border-top:1px solid #e8e5e0; margin-top:8px;">
      <div style="font-size:10px; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:#888; margin-bottom:14px; font-family:Inter,sans-serif;">Frequently Bought Together</div>
      <div id="fbt-card" style="display:flex; align-items:center; gap:12px; border:1px solid #e8e5e0; border-radius:12px; padding:14px; background:white; cursor:pointer; transition:border-color 0.2s ease;">
        <img src="assets/images/bpc-157.png" alt="BPC-157" style="width:64px; height:64px; object-fit:contain; border-radius:8px; background:#f8f7f5; flex-shrink:0;">
        <div style="flex:1; min-width:0;">
          <div style="font-size:13px; font-weight:500; color:#0f0f0f; font-family:Inter,sans-serif;">BPC-157</div>
          <div style="font-size:11px; color:#888; font-family:Inter,sans-serif; margin-top:1px;">Regenerative Peptide</div>
          <div style="font-size:12px; font-weight:500; color:#0f0f0f; font-family:Inter,sans-serif; margin-top:4px;">R450.00</div>
        </div>
        <button id="fbt-add-btn" onclick="addFBTToCart()" style="height:32px; padding:0 16px; border-radius:999px; background:#0f0f0f; color:white; font-size:11px; font-weight:500; letter-spacing:0.06em; border:none; cursor:pointer; font-family:Inter,sans-serif; white-space:nowrap; transition:background 0.2s ease; flex-shrink:0;">+ Add</button>
      </div>
    </div>
  `;
  cartItemsContainer.appendChild(fbtSection);
}

function updateBadge() {
  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  cartBadge.textContent = count;
}

function updateTotals() {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  subtotalPrice.textContent = `R${subtotal.toFixed(2)}`;
  shippingPrice.textContent = shipping === 0 ? 'FREE' : `R${shipping.toFixed(2)}`;
  totalPrice.textContent = `R${total.toFixed(2)}`;
}

function updateShippingBar() {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const percentage = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  shippingFill.style.width = `${percentage}%`;

  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    shippingAmount.textContent = 'Free shipping unlocked!';
  } else {
    const remaining = (FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2);
    shippingAmount.textContent = `R${remaining} away`;
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

// ── Frequently Bought Together ────────────────────────────────────────────
function addFBTToCart() {
  const btn = document.getElementById('fbt-add-btn');
  const card = document.getElementById('fbt-card');
  btn.textContent = '✓ Added';
  btn.style.background = '#1a7a4a';
  card.style.borderColor = '#1a7a4a';
  btn.disabled = true;

  // Add BPC-157 to cart
  addToCart({
    id: 'bpc-157',
    name: 'BPC-157',
    variant: 'Research Grade',
    price: 450,
    image: 'assets/images/bpc-157.png'
  });
}

// ── Subscribe Toggle ────────────────────────────────────────────────────────
function toggleSubscribe() {
  const checkbox = document.getElementById('subscribe-toggle');
  const track = document.getElementById('toggle-track');
  const thumb = document.getElementById('toggle-thumb');
  const savings = document.getElementById('subscribe-savings');
  if (checkbox.checked) {
    track.style.background = '#0f0f0f';
    thumb.style.transform = 'translateX(18px)';
    savings.style.display = 'block';
  } else {
    track.style.background = '#d0cec9';
    thumb.style.transform = 'translateX(0)';
    savings.style.display = 'none';
  }
}

// ── Initialize on load ────────────────────────────────────────────

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
