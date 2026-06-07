/**
 * Google Apps Script endpoint to receive Curatio styling questionnaire submissions.
 * Paste this into a new Apps Script project and deploy as a Web App.
 */
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const sheet = getSubmissionSheet();
    sheet.appendRow([
      new Date(),
      payload.fullName || '',
      payload.contactNumber || '',
      payload.email || '',
      payload.eventType || '',
      payload.eventDate || '',
      payload.venueLocation || '',
      payload.guestCount || '',
      payload.vibes || '',
      payload.colourPalette || '',
      payload.themes || '',
      payload.budgetRange || '',
      payload.budgetStretch || '',
      payload.focusAreas || '',
      payload.focusOther || '',
      payload.mustInclude || '',
      payload.avoid || '',
      payload.supportType || '',
      payload.fileNames || '',
      payload.deliveryMethod || '',
      payload.notes || '',
    ]);

    sendNotificationEmail(payload);

    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getSubmissionSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = 'Submissions';
  let sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    sheet.appendRow([
      'Timestamp',
      'Name',
      'Contact Number / WhatsApp',
      'Email',
      'Event Type',
      'Event Date',
      'Venue & Location',
      'Guest Count',
      'Vibes',
      'Colour Palette',
      'Themes',
      'Budget Range',
      'Budget Stretch',
      'Focus Areas',
      'Focus Other',
      'Must-Include',
      'Avoid',
      'Support Type',
      'Inspiration files',
      'Delivery Method',
      'Notes',
    ]);
  }

  return sheet;
}

function sendNotificationEmail(payload) {
  const studioEmail = 'studio@example.com'; // Replace with your studio email address.
  const subject = `New Curatio enquiry: ${payload.fullName || 'Guest'} – ${payload.eventType || 'Event'}`;
  const body = [
    `Name: ${payload.fullName || '—'}`,
    `Contact: ${payload.contactNumber || '—'}`,
    `Email: ${payload.email || '—'}`,
    `Event type: ${payload.eventType || '—'}`,
    `Event date: ${payload.eventDate || '—'}`,
    `Guests: ${payload.guestCount || '—'}`,
    `Delivery: ${payload.deliveryMethod || '—'}`,
    `Support: ${payload.supportType || '—'}`,
    `Inspiration files: ${payload.fileNames || '—'}`,
    '',
    'Full submission details are available in the linked Google Sheet.',
  ].join('\n');

  MailApp.sendEmail(studioEmail, subject, body);
}
