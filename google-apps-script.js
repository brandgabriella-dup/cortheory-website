/**
 * CorTheory Order Processing Script
 *
 * Deploy as a web app in Google Apps Script to handle order submissions
 * from the checkout page.
 *
 * Instructions:
 * 1. Go to https://script.google.com
 * 2. Create a new project
 * 3. Copy this entire file into the script editor
 * 4. Replace SHEET_ID with your actual Google Sheet ID
 * 5. Save the project
 * 6. Click "Deploy" > "New deployment"
 * 7. Select "Web app" as the type
 * 8. Execute as your email, allow anyone to access
 * 9. Copy the deployment URL
 * 10. Paste the URL in main.js as APPS_SCRIPT_URL constant
 *
 * The script will:
 * - Accept POST requests from the checkout page
 * - Write order data to your Google Sheet
 * - Generate order IDs automatically
 * - Set order status to "Pending Payment"
 * - Return success response with order ID
 */

// YOUR GOOGLE SHEET ID - REPLACE THIS WITH YOUR ACTUAL SHEET ID
// Format: Get from URL like https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit
const SHEET_ID = '17ptq_Yj6vaJHq8o08hnanQIudYx5Y4vuADnQhkKMLQw';
const SHEET_NAME = 'Orders';

/**
 * Main doPost function - Entry point for HTTP POST requests
 */
function doPost(e) {
  try {
    // Parse the request payload
    const data = JSON.parse(e.postData.contents);

    // Get or create the sheet
    let sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = SpreadsheetApp.openById(SHEET_ID).insertSheet(SHEET_NAME);
      initializeHeaders(sheet);
    }

    // Add the order row
    const orderId = data.orderId || generateOrderId();
    const row = [
      orderId,                           // Order ID
      new Date(data.date || new Date()), // Date
      data.name || '',                   // Name
      data.email || '',                  // Email
      data.phone || '',                  // Phone
      data.address || '',                // Address Line 1
      data.address2 || '',               // Address Line 2
      data.city || '',                   // City
      data.province || '',               // Province
      data.postalCode || '',             // Postal Code
      data.items || '',                  // Items (JSON)
      data.subtotal || 0,                // Subtotal
      data.shipping || 0,                // Shipping
      data.total || 0,                   // Total
      data.notes || '',                  // Notes
      'Pending Payment'                  // Status
    ];

    sheet.appendRow(row);

    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      orderId: orderId,
      message: 'Order received successfully'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error('Error processing order:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Initialize sheet headers
 */
function initializeHeaders(sheet) {
  const headers = [
    'Order ID',
    'Date',
    'Name',
    'Email',
    'Phone',
    'Address',
    'Address Line 2',
    'City',
    'Province',
    'Postal Code',
    'Items',
    'Subtotal',
    'Shipping',
    'Total',
    'Notes',
    'Status'
  ];

  sheet.appendRow(headers);

  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#1a1a1a');
  headerRange.setFontColor('white');

  // Set column widths
  sheet.setColumnWidth(1, 120);  // Order ID
  sheet.setColumnWidth(2, 120);  // Date
  sheet.setColumnWidth(3, 150);  // Name
  sheet.setColumnWidth(4, 180);  // Email
  sheet.setColumnWidth(5, 130);  // Phone
  sheet.setColumnWidth(6, 200);  // Address
  sheet.setColumnWidth(7, 150);  // Address 2
  sheet.setColumnWidth(8, 120);  // City
  sheet.setColumnWidth(9, 120);  // Province
  sheet.setColumnWidth(10, 120); // Postal Code
  sheet.setColumnWidth(11, 250); // Items
  sheet.setColumnWidth(12, 100); // Subtotal
  sheet.setColumnWidth(13, 100); // Shipping
  sheet.setColumnWidth(14, 100); // Total
  sheet.setColumnWidth(15, 200); // Notes
  sheet.setColumnWidth(16, 150); // Status
}

/**
 * Generate Order ID
 * Format: CT-[timestamp in milliseconds]
 */
function generateOrderId() {
  return 'CT-' + new Date().getTime();
}

/**
 * Test function - Run this to verify deployment
 * Go to Run > Run Function > testPost
 */
function testPost() {
  const testData = {
    orderId: 'CT-TEST-' + Date.now(),
    date: new Date().toISOString(),
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+27123456789',
    address: '123 Main Street',
    address2: 'Unit 5',
    city: 'Johannesburg',
    province: 'Gauteng',
    postalCode: '2000',
    items: JSON.stringify([
      { name: 'AOD', price: 890, quantity: 1 },
      { name: 'BPC-157', price: 950, quantity: 2 }
    ]),
    subtotal: 2790,
    shipping: 0,
    total: 2790,
    notes: 'Test order',
    status: 'Pending Payment'
  };

  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  if (!sheet) {
    const newSheet = SpreadsheetApp.openById(SHEET_ID).insertSheet(SHEET_NAME);
    initializeHeaders(newSheet);
  }

  // Log test data
  Logger.log('Test order data:');
  Logger.log(JSON.stringify(testData, null, 2));
  Logger.log('Check your Google Sheet to verify the order was added');
}
