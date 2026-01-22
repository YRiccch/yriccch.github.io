/**
 * Google Apps Script Backend for AniMaster Research
 * 
 * INSTRUCTIONS:
 * 1. Go to https://script.google.com/home/start
 * 2. Create a new project.
 * 3. Copy the content of this file into the editor (replace Code.gs).
 * 4. Create a Google Sheet and copy its ID from the URL.
 * 5. Update the SHEET_ID variable below.
 * 6. Deploy as Web App:
 *    - Click "Deploy" -> "New deployment"
 *    - Select type: "Web app"
 *    - Description: "v1"
 *    - Execute as: "Me" (your email)
 *    - Who has access: "Anyone" (Important for public access)
 *    - Click "Deploy" and copy the Web App URL.
 */

const CONFIG = {
  // Replace this with your Google Sheet ID
  // Example: '1BxiMVs0XRA5nFMdKvBdBZjGMuuqptunsIYrPgAaBbCc'
  SHEET_ID: 'REPLACE_WITH_YOUR_SHEET_ID',
  
  // The name of the sheet (tab) to store data
  SHEET_NAME: 'SurveyResponses' 
};

/**
 * Handles POST requests from the Vue app
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  // Wait up to 10 seconds for other processes to finish
  if (!lock.tryLock(10000)) {
    return createResponse({ status: 'error', message: 'Server is busy, please try again.' });
  }

  try {
    // 1. Validate Request
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Invalid request: No data received");
    }

    const rawData = e.postData.contents;
    let payload;
    
    try {
      payload = JSON.parse(rawData);
    } catch (parseError) {
      // Sometimes data comes as parameter keys if content-type is not handled correctly
      // But we instructed to use text/plain body, so parsing should work.
      throw new Error("Invalid JSON format");
    }

    // 2. Open Spreadsheet
    const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);

    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(CONFIG.SHEET_NAME);
      // Initialize default headers
      sheet.appendRow(['Timestamp', 'UserAgent', 'RawData']); 
      // Formatting
      sheet.getRange(1, 1, 1, 3).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    // 3. Process Headers & Data
    // We want to map JSON keys to Columns dynamically
    const headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
    const headerMap = {};
    headers.forEach((h, i) => {
      if (h) headerMap[h] = i;
    });

    const timestamp = new Date();
    const newRow = new Array(headers.length).fill(""); // Initialize with empty strings

    // Set standard fields
    if (headerMap.hasOwnProperty('Timestamp')) newRow[headerMap['Timestamp']] = timestamp;
    if (headerMap.hasOwnProperty('RawData')) newRow[headerMap['RawData']] = rawData; // Backup

    // 4. Fill in the data
    let headersChanged = false;

    Object.keys(payload).forEach(key => {
      let value = payload[key];
      
      // Convert objects/arrays to string
      if (typeof value === 'object' && value !== null) {
        value = JSON.stringify(value);
      }

      // Check if column exists
      if (headerMap.hasOwnProperty(key)) {
        newRow[headerMap[key]] = value;
      } else {
        // New column needed
        const newColIndex = headers.length;
        headers.push(key);
        headerMap[key] = newColIndex;
        newRow[newColIndex] = value;
        headersChanged = true;
      }
    });

    // 5. Update Headers if needed
    if (headersChanged) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      // Optional: Bold the new headers
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    }

    // 6. Append the Row
    // If headers changed, the newRow length matches headers.length
    // If not, newRow matches old headers.length
    
    // Safety check: ensure newRow is not shorter than headers (it shouldn't be due to logic above)
    while (newRow.length < headers.length) {
      newRow.push("");
    }

    sheet.appendRow(newRow);

    return createResponse({ 
      status: 'success', 
      message: 'Data saved successfully',
      row: sheet.getLastRow() 
    });

  } catch (error) {
    console.error(error);
    return createResponse({ status: 'error', message: error.toString() });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Handles GET requests (just for testing connectivity)
 */
function doGet(e) {
  return createResponse({ status: 'success', message: 'AniMaster Server is running.' });
}

/**
 * Helper to create JSON response with correct headers to avoid CORS issues
 */
function createResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
