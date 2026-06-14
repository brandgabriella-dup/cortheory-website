// ── CHECKOUT PAGE FUNCTIONALITY ────────────────────────────────

// Initialize checkout page
function initCheckout() {
  loadOrderSummary();
  attachCheckoutListeners();
  generateOrderNumber();
}

// Load order summary from cart
function loadOrderSummary() {
  const cartData = JSON.parse(localStorage.getItem('cortheory_cart') || '{}');
  const items = cartData.items || [];
  const subtotal = (cartData.subtotal || 0);

  // Render items
  const itemsContainer = document.getElementById('checkoutItems');
  if (itemsContainer && items.length > 0) {
    itemsContainer.innerHTML = items.map(item => `
      <div class="checkout__item">
        <div class="checkout__item-name">${item.name} - ${item.dosage || ''}</div>
        <div class="checkout__item-qty">x${item.quantity}</div>
        <div class="checkout__item-price">R${(item.price * item.quantity).toFixed(2)}</div>
      </div>
    `).join('');
  }

  // Update totals
  const shipping = subtotal >= 1500 ? 0 : 150;
  const total = subtotal + shipping;

  document.getElementById('summarySubtotal').textContent = `R${subtotal.toFixed(2)}`;
  document.getElementById('summaryShipping').textContent = `R${shipping.toFixed(2)}`;
  document.getElementById('summaryTotal').textContent = `R${total.toFixed(2)}`;
}

// Generate order number
function generateOrderNumber() {
  const orderId = 'CT-' + Date.now();
  document.getElementById('orderRef').textContent = orderId;
}

// Validate form fields
function validateCheckoutForm(form) {
  const fullName = form.querySelector('#fullName');
  const email = form.querySelector('#email');
  const phone = form.querySelector('#phone');
  const address1 = form.querySelector('#address1');
  const city = form.querySelector('#city');
  const province = form.querySelector('#province');
  const postal = form.querySelector('#postal');
  const disclaimer = form.querySelector('#disclaimer');

  if (!fullName?.value.trim()) {
    alert('Please enter your full name');
    return false;
  }
  if (!email?.value.trim() || !isValidEmail(email.value)) {
    alert('Please enter a valid email address');
    return false;
  }
  if (!phone?.value.trim()) {
    alert('Please enter your phone number');
    return false;
  }
  if (!address1?.value.trim()) {
    alert('Please enter your address');
    return false;
  }
  if (!city?.value.trim()) {
    alert('Please enter your city');
    return false;
  }
  if (!province?.value) {
    alert('Please select your province');
    return false;
  }
  if (!postal?.value.trim()) {
    alert('Please enter your postal code');
    return false;
  }
  if (!disclaimer?.checked) {
    alert('Please confirm you are ordering research peptides for in vitro research use');
    return false;
  }

  return true;
}

// Email validation
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Submit order
function submitOrder(formData) {
  const orderId = 'CT-' + Date.now();
  const cartData = JSON.parse(localStorage.getItem('cortheory_cart') || '{}');

  const orderData = {
    orderId: orderId,
    date: new Date().toISOString(),
    customer: formData,
    items: cartData.items || [],
    subtotal: cartData.subtotal || 0,
    shipping: (cartData.subtotal || 0) >= 1500 ? 0 : 150,
    total: (cartData.subtotal || 0) + ((cartData.subtotal || 0) >= 1500 ? 0 : 150),
    status: 'Pending Payment'
  };

  // Save order to localStorage
  localStorage.setItem('cortheory_last_order', JSON.stringify(orderData));

  // Log order (for now, in production this would submit to Google Apps Script)
  console.log('Order Submitted:', orderData);

  // Show success message
  showOrderConfirmation(orderId);

  // Clear cart
  localStorage.removeItem('cortheory_cart');
}

// Show order confirmation
function showOrderConfirmation(orderId) {
  const successSection = document.querySelector('.checkout__success');
  const form = document.getElementById('checkoutForm');

  if (form) {
    form.style.display = 'none';
  }

  // Create success message if not exists
  let successDiv = document.getElementById('orderSuccess');
  if (!successDiv) {
    successDiv = document.createElement('div');
    successDiv.id = 'orderSuccess';
    successDiv.className = 'checkout__success-message';
    successDiv.innerHTML = `
      <div class="checkout__success-content">
        <div class="checkout__success-icon">✓</div>
        <h2 class="checkout__success-title">Order Confirmed!</h2>
        <p class="checkout__success-text">Your order has been received and is awaiting payment.</p>
        <div class="checkout__success-order-id">
          Order ID: <strong>${orderId}</strong>
        </div>
        <p class="checkout__success-instructions">
          Please use the order ID above as your payment reference when making the EFT transfer to the account details shown on the right.
        </p>
        <a href="index.html" class="btn btn-dark" style="margin-top: 24px;">Continue Shopping</a>
      </div>
    `;

    const formBlock = document.querySelector('.checkout__form-block');
    if (formBlock) {
      formBlock.parentNode.insertBefore(successDiv, formBlock.nextSibling);
    }
  }

  successDiv.style.display = 'block';
}

// Handle form submission
function attachCheckoutListeners() {
  const checkoutForm = document.getElementById('checkoutForm');

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validate form
      if (!validateCheckoutForm(checkoutForm)) {
        return;
      }

      // Get form data
      const formData = {
        fullName: checkoutForm.querySelector('#fullName').value,
        email: checkoutForm.querySelector('#email').value,
        phone: checkoutForm.querySelector('#phone').value,
        address1: checkoutForm.querySelector('#address1').value,
        address2: checkoutForm.querySelector('#address2').value || '',
        city: checkoutForm.querySelector('#city').value,
        province: checkoutForm.querySelector('#province').value,
        postal: checkoutForm.querySelector('#postal').value,
        notes: checkoutForm.querySelector('#notes').value || ''
      };

      // Submit order
      submitOrder(formData);
    });
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCheckout);
} else {
  initCheckout();
}
