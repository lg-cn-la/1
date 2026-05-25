const SHEET_ID = 'REPLACE_WITH_GOOGLE_SHEET_ID';
const SHEET_NAME = 'contact_submissions';
const NOTIFY_EMAIL = 'sales@getsampora.com';

function jsonResponse(payload, statusCode) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const raw = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
    const data = JSON.parse(raw);

    // Honeypot field: if filled, silently accept without storing as a lead.
    if (data.website || data.honeypot) {
      return jsonResponse({ ok: true, id: 'ignored' });
    }

    const name = String(data.name || '').trim();
    const email = String(data.email || '').trim();
    const company = String(data.company || '').trim();
    const role = String(data.role || '').trim();
    const message = String(data.message || data.details || '').trim();
    const intent = String(data.intent || '').trim();
    const lang = String(data.lang || '').trim();
    const page = String(data.page || '').trim();

    if (!name || !email || !message) {
      return jsonResponse({ ok: false, message: 'Please check the required fields.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ ok: false, message: 'Please enter a valid email address.' });
    }
    if (message.length > 3000) {
      return jsonResponse({ ok: false, message: 'Message is too long.' });
    }

    const id = Utilities.getUuid();
    const createdAt = new Date();
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['id','created_at','name','email','company','role','message','intent','lang','page','user_agent','source']);
    }

    sheet.appendRow([
      id,
      createdAt,
      name,
      email,
      company,
      role,
      message,
      intent,
      lang,
      page,
      String(data.userAgent || ''),
      String(data.source || '')
    ]);

    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: '[Sampora] New contact form submission',
      htmlBody: '<p><b>Name:</b> ' + escapeHtml(name) + '</p>' +
        '<p><b>Email:</b> ' + escapeHtml(email) + '</p>' +
        '<p><b>Company:</b> ' + escapeHtml(company) + '</p>' +
        '<p><b>Role:</b> ' + escapeHtml(role) + '</p>' +
        '<p><b>Intent:</b> ' + escapeHtml(intent) + '</p>' +
        '<p><b>Language:</b> ' + escapeHtml(lang) + '</p>' +
        '<p><b>Message:</b><br>' + escapeHtml(message).replace(/\n/g, '<br>') + '</p>'
    });

    return jsonResponse({ ok: true, id });
  } catch (err) {
    return jsonResponse({ ok: false, message: 'Unable to submit. Please email sales@getsampora.com.' });
  }
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
