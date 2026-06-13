# CorTheory Cart & Checkout System Setup Guide

This guide walks you through setting up the complete cart and checkout system for the CorTheory website.

## Overview

The system consists of:
1. **Frontend** - Cart drawer (index.html), checkout page (checkout.html)
2. **JavaScript** - Cart management (main.js), checkout logic (checkout.js)
3. **Styling** - Checkout page styles (checkout.css)
4. **Backend** - Google Apps Script for order processing

## Prerequisites

- Google account (for Google Sheets and Apps Script)
- Existing CorTheory website files
- Access to update main.js

---

## Step 1: Create Google Sheet for Orders

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named "CorTheory Orders"
3. Note the **Sheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit
   ```
4. Keep this ID handy - you'll need it in Step 2

---

## Step 2: Set Up Google Apps Script

### 2A: Create the Script

1. Go to [Google Apps Script](https://script.google.com)
2. Click **"+ New Project"**
3. Copy the entire contents of `google-apps-script.js` from this repository
4. Paste into the script editor (replacing any existing code)
5. **IMPORTANT:** Replace the placeholder Sheet ID on this line:
   ```javascript
   const SHEET_ID = '17ptq_Yj6vaJHq8o08hnanQIudYx5Y4vuADnQhkKMLQw';
   ```
   Replace with your actual Sheet ID from Step 1

6. Save the script (Ctrl+S or Cmd+S)

### 2B: Deploy as Web App

1. Click the **"Deploy"** button (top-right)
2. Select **"+ New Deployment"**
3. In the deployment settings:
   - **Type:** Select "Web app"
   - **Execute as:** Select your email address
   - **Who has access:** Select "Anyone"
4. Click **"Deploy"**
5. A dialog will appear with your deployment URL
   - Copy this URL - it's crucial for the next step
   - It will look like: `https://script.googleapis.com/macros/d/XXXXXX/usercontent`

### 2C: Test the Script

1. Go back to your Apps Script editor
2. At the top, select the function dropdown and choose **"testPost"**
3. Click **"Run"**
4. Check your Google Sheet - you should see a test order added
5. If successful, proceed to Step 3

---

## Step 3: Configure Website

### 3A: Update main.js

1. Open `assets/js/main.js`
2. Find this line (near the top of the cart management section):
   ```javascript
   const APPS_SCRIPT_URL = ''; // Set this after deploying Google Apps Script
   ```
3. Replace with your deployment URL from Step 2B:
   ```javascript
   const APPS_SCRIPT_URL = 'https://script.googleapis.com/macros/d/XXXXXX/usercontent';
   ```
4. **Optional:** Update EFT details if needed:
   ```javascript
   const EFT_DETAILS = {
     bank: 'Standard Bank',
     accountName: 'CorTheory',
     accountNumber: '071502041',
     branchCode: '051001'
   };
   ```
5. Save the file

### 3B: Verify Files Exist

Check that these files are in place:
- `checkout.html` - Checkout page
- `assets/css/checkout.css` - Checkout styling
- `assets/js/checkout.js` - Checkout logic
- `google-apps-script.js` - Reference file (in root)

---

## Step 4: Test the System

### Cart Functionality

1. **Open the website:** Go to your local or deployed site
2. **Add product to cart:** Click "Add to Bag" on any product
   - Verify the item appears in the cart drawer
   - Check that cart item count shows on the nav icon
   - Verify totals update correctly

3. **Test cart interactions:**
   - Increase quantity with "+" button
   - Decrease quantity with "−" button
   - Remove item with "×" button
   - Verify "Free shipping" message appears when subtotal ≥ R1500

4. **Test persistence:**
   - Add items to cart
   - Close the browser completely
   - Reopen the site
   - Verify cart items are still there

### Checkout Page

1. **Navigate to checkout:**
   - From cart drawer, click "SECURE CHECKOUT" button
   - Or visit `checkout.html` directly (if running locally)

2. **Test form validation:**
   - Try clicking "Place Order" without filling fields
   - Should show error messages for required fields

3. **Test order submission:**
   - Fill all required fields
   - Select a province from dropdown
   - Click "Place Order"
   - Should see loading state then success modal
   - Modal should show Order ID (format: CT-[timestamp])

4. **Verify order in Google Sheet:**
   - Go to your Google Sheet created in Step 1
   - Check that a new row was added with your test order
   - Verify all fields populated correctly
   - Confirm status shows "Pending Payment"

### Responsive Testing

Test on different screen sizes:
- **Desktop** (1280px+): Two-column layout (form left, summary right)
- **Tablet** (900px): Form and summary visible, responsive
- **Mobile** (600px): Single column, full-width form

---

## Troubleshooting

### Cart not saving between page reloads

**Issue:** Items disappear when browser is closed
**Solution:**
- Check browser localStorage is enabled
- Verify main.js is loaded (check browser console)
- Clear localStorage and try again

### Order submission fails

**Issue:** "Error submitting order" message appears
**Solution:**
1. Check that APPS_SCRIPT_URL in main.js is correct
2. Verify Google Apps Script deployment is active
3. Check browser console (F12) for detailed error messages
4. Make sure sheet exists with correct ID

### Orders not appearing in Google Sheet

**Issue:** Form submits but no row added to sheet
**Solution:**
1. Verify Sheet ID in google-apps-script.js is correct
2. Check that "Orders" sheet exists in your Google Sheet
3. Try running the testPost() function in Apps Script to verify connection
4. Check Apps Script execution logs (Executions tab)

### WhatsApp button not working

**Issue:** WhatsApp link doesn't open
**Solution:**
- Update the URL in checkout.html:
  ```html
  <a href="https://chat.whatsapp.com/YOUR_CHAT_ID">Join Our Group</a>
  ```
- Replace `JgqbexB6z4kGSysNtLB7HE?mode=gi_t` with your actual WhatsApp group invite link

---

## Configuration

### Update EFT Bank Details

Edit the `EFT_DETAILS` object in `assets/js/main.js`:

```javascript
const EFT_DETAILS = {
  bank: 'Your Bank Name',
  accountName: 'Your Account Name',
  accountNumber: 'Your Account Number',
  branchCode: 'Your Branch Code'
};
```

These details will display on the checkout page and in confirmation emails.

### Customize Shipping

To change the shipping amount or threshold, edit in `assets/js/main.js`:

```javascript
// Current: R150 flat, free over R1500
function calculateTotals() {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 1500 ? 0 : 150;  // ← Change these values
  const total = subtotal + shipping;
  return { subtotal, shipping, total };
}
```

### Customize WhatsApp Link

Update the URL in `checkout.html`:

```html
<a href="https://chat.whatsapp.com/YOUR_INVITE_LINK" target="_blank">
  Join Our Group
</a>
```

---

## Deployment

### For Production

1. **Push all files to your hosting:**
   - `index.html` (updated with cart drawer)
   - `checkout.html` (new)
   - `assets/css/checkout.css` (new)
   - `assets/css/style.css` (unchanged)
   - `assets/js/main.js` (updated)
   - `assets/js/checkout.js` (new)
   - `assets/images/*` (unchanged)

2. **Verify live:**
   - Test cart on production URL
   - Submit test order
   - Verify order appears in Google Sheet
   - Check that confirmation modal displays order ID

### For Local Development

1. Serve files with a local server (not file:// protocol)
   - Python: `python -m http.server 8000`
   - Node: `npx serve .`
   - Or use your IDE's built-in server

2. Test all functionality locally before deploying

---

## Security Notes

⚠️ **Important:**

1. **Google Apps Script URL** is public but unique - don't share it
2. **EFT details** are displayed on checkout page - use company account only
3. **Google Sheet** should have appropriate sharing settings
4. **No sensitive data** is stored in localStorage - only cart items
5. **Orders** are submitted via HTTPS to Google Apps Script

---

## File Reference

| File | Purpose | Status |
|------|---------|--------|
| index.html | Homepage with updated cart drawer | Modified |
| checkout.html | Checkout page | New |
| checkout.css | Checkout page styling | New |
| checkout.js | Checkout form handling | New |
| main.js | Cart management + checkout logic | Extended |
| style.css | Main stylesheet | Unchanged |
| work-with-us.css | Partner page styles | Unchanged |
| google-apps-script.js | Backend order processing | New (for reference) |

---

## Support

For issues or questions:

1. Check the **Troubleshooting** section above
2. Review browser console (F12 > Console tab)
3. Check Google Apps Script execution logs
4. Verify all configuration steps were completed

---

## Next Steps

Once live, consider:

1. **Email notifications:** Add email sending to Apps Script
2. **Payment tracking:** Mark orders as "Paid" when payment received
3. **Inventory:** Connect to inventory management system
4. **Shipping labels:** Auto-generate shipping labels on payment
5. **Customer communication:** Automated order status emails

---

**Last Updated:** 2026-06-02
**System Version:** 1.0
