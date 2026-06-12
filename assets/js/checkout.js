// ── CHECKOUT PAGE FUNCTIONALITY ────────────────────────────────

// Initialize checkout page
function initCheckout() {
  loadOrderSummary();
  renderRecommendations();
  attachCheckoutListeners();
  populateEFTDetails();
}

// Populate EFT details from main.js
function populateEFTDetails() {
  const eftBank = document.getElementById('eftBank');
  const eftAccount = document.getElementById('eftAccount');
  const eftBranch = document.getElementById('eftBranch');

  if (eftBank) eftBank.textContent = EFT_DETAILS.bank;
  if (eftAccount) eftAccount.textContent = EFT_DETAILS.accountNumber;
  if (eftBranch) eftBranch.textContent = EFT_DETAILS.branchCode;
}

// Validate form fields
function validateCheckoutForm() {
  const fullName = document.getElementById('fullName');
  const email = document.getElementById('email');
  const phone = document.getElementById('phone');
  const address1 = document.getElementById('address1');
  const city = document.getElementById('city');
  const province = document.getElementById('province');
  const postalCode = document.getElementById('postalCode');

  const errors = [];

  if (!fullName || !fullName.value.trim()) errors.push('Full Name is required');
  if (!email || !email.value.trim()) errors.push('Email is required');
  if (!email || !isValidEmail(email.value)) errors.push('Email is invalid');
  if (!phone || !phone.value.trim()) errors.push('Phone number is required');
  if (!address1 || !address1.value.trim()) errors.push('Address is required');
  if (!city || !city.value.trim()) errors.push('City is required');
  if (!province || !province.value) errors.push('Province is required');
  if (!postalCode || !postalCode.value.trim()) errors.push('Postal code is required');

  if (errors.length > 0) {
    alert('Please fix the following errors:\n\n' + errors.join('\n'));
    return false;
  }

  return true;
}

// Email validation
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Build form data object
function getFormData() {
  return {
    fullName: (document.getElementById('fullName') || {}).value || '',
    email: (document.getElementById('email') || {}).value || '',
    phone: (document.getElementById('phone') || {}).value || '',
    address1: (document.getElementById('address1') || {}).value || '',
    address2: (document.getElementById('address2') || {}).value || '',
    city: (document.getElementById('city') || {}).value || '',
    province: (document.getElementById('province') || {}).value || '',
    postalCode: (document.getElementById('postalCode') || {}).value || '',
    notes: (document.getElementById('notes') || {}).value || ''
  };
}

// Handle place order button
function attachCheckoutListeners() {
  const placeOrderBtn = document.getElementById('placeOrderBtn');

  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', (e) => {
      e.preventDefault();

      // Validate form
      if (!validateCheckoutForm()) return;

      // Check if cart has items
      if (cartItems.length === 0) {
        alert('Your cart is empty. Please add items before checking out.');
        window.location.href = 'index.html#products';
        return;
      }

      // Show loading state
      const originalText = placeOrderBtn.textContent;
      placeOrderBtn.classList.add('loading');
      placeOrderBtn.disabled = true;
      placeOrderBtn.textContent = 'Processing...';

      // Get form data and submit
      const formData = getFormData();

      setTimeout(() => {
        submitOrder(formData);
        placeOrderBtn.classList.remove('loading');
        placeOrderBtn.disabled = false;
        placeOrderBtn.textContent = originalText;
      }, 500);
    });
  }

  // Handle modal close button
  const modalClose = document.getElementById('modalClose');
  const successModal = document.getElementById('successModal');

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      if (successModal) {
        successModal.style.display = 'none';
        document.body.style.overflow = '';
        // Redirect to home page
        window.location.href = 'index.html';
      }
    });
  }

  // Close modal when clicking outside
  if (successModal) {
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.style.display = 'none';
        document.body.style.overflow = '';
        window.location.href = 'index.html';
      }
    });
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCheckout);
} else {
  initCheckout();
}
