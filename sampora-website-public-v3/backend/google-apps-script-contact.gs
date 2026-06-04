const SHEET_ID = 'REPLACE_WITH_GOOGLE_SHEET_ID';
const SHEET_NAME = 'contact_submissions';
const NOTIFY_EMAIL = 'sales@getsampora.com';

const VISIBLE_FIELDS = [
  'name',
  'email',
  'company',
  'role',
  'business_type',
  'message'
];

const CONTEXT_FIELDS = [
  'intent',
  'source_page',
  'source_section',
  'plan',
  'lang'
];

const ATTRIBUTION_FIELDS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fbclid',
  'msclkid',
  'referrer',
  'landing_page',
  'conversion_page',
  'cta_intent',
  'cta_location',
  'cta_event',
  'captured_at',
  'first_landing_page',
  'first_referrer',
  'first_utm_source',
  'first_utm_medium',
  'first_utm_campaign',
  'last_landing_page',
  'last_referrer'
];

const FIELD_LIMITS = {
  name: 160,
  email: 254,
  company: 200,
  role: 200,
  business_type: 160,
  message: 3000,
  intent: 120,
  source_page: 500,
  source_section: 500,
  plan: 120,
  lang: 16,
  utm_source: 300,
  utm_medium: 300,
  utm_campaign: 500,
  utm_term: 500,
  utm_content: 500,
  gclid: 500,
  fbclid: 500,
  msclkid: 500,
  referrer: 2000,
  landing_page: 2000,
  conversion_page: 2000,
  cta_intent: 160,
  cta_location: 300,
  cta_event: 160,
  captured_at: 80,
  first_landing_page: 2000,
  first_referrer: 2000,
  first_utm_source: 300,
  first_utm_medium: 300,
  first_utm_campaign: 500,
  last_landing_page: 2000,
  last_referrer: 2000,
  user_agent: 1000,
  source: 300
};

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const data = parseRequestData(e);

    // Honeypot field: if filled, silently accept without storing as a lead.
    if (clean(data.website, 200) || clean(data.honeypot, 200)) {
      return jsonResponse({ ok: true, id: 'ignored' });
    }

    const visible = collectFields(data, VISIBLE_FIELDS);
    const context = collectFields(data, CONTEXT_FIELDS);
    const attribution = collectFields(data, ATTRIBUTION_FIELDS);

    if (!visible.name || !visible.company || !visible.email || !visible.role || !visible.business_type) {
      return jsonResponse({ ok: false, message: 'Please check the required fields.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(visible.email)) {
      return jsonResponse({ ok: false, message: 'Please enter a valid email address.' });
    }

    const id = Utilities.getUuid();
    const createdAt = new Date();
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    const columns = [
      'id',
      'created_at',
      ...VISIBLE_FIELDS,
      ...CONTEXT_FIELDS,
      ...ATTRIBUTION_FIELDS,
      'user_agent',
      'source'
    ];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(columns);
    }

    const rowData = {
      id,
      created_at: createdAt,
      ...visible,
      ...context,
      ...attribution,
      user_agent: clean(data.userAgent || data.user_agent, FIELD_LIMITS.user_agent),
      source: clean(data.source, FIELD_LIMITS.source)
    };

    sheet.appendRow(columns.map((field) => rowData[field] || ''));

    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: '[Sampora] New contact form submission',
      htmlBody: buildNotificationEmail(visible, context, attribution)
    });

    return jsonResponse({ ok: true, id });
  } catch (err) {
    return jsonResponse({ ok: false, message: 'Unable to submit. Please email sales@getsampora.com.' });
  }
}

function parseRequestData(e) {
  const contentType = String(e && e.postData && e.postData.type || '').toLowerCase();
  const raw = String(e && e.postData && e.postData.contents || '');

  if (contentType.indexOf('application/json') !== -1) {
    try {
      return JSON.parse(raw || '{}') || {};
    } catch (err) {
      return {};
    }
  }

  if (contentType.indexOf('application/x-www-form-urlencoded') !== -1 || raw.indexOf('=') !== -1) {
    return parseFormEncoded(raw);
  }

  return e && e.parameter ? e.parameter : {};
}

function parseFormEncoded(raw) {
  return String(raw || '').split('&').reduce((memo, pair) => {
    if (!pair) return memo;
    const parts = pair.split('=');
    const key = decodeComponent(parts.shift());
    if (!key) return memo;
    memo[key] = decodeComponent(parts.join('='));
    return memo;
  }, {});
}

function decodeComponent(value) {
  try {
    return decodeURIComponent(String(value || '').replace(/\+/g, ' '));
  } catch (err) {
    return '';
  }
}

function collectFields(data, fields) {
  return fields.reduce((memo, field) => {
    memo[field] = clean(data[field], FIELD_LIMITS[field] || 500);
    return memo;
  }, {});
}

function clean(value, limit) {
  return String(value || '').trim().slice(0, limit);
}

function buildNotificationEmail(visible, context, attribution) {
  const fieldRows = [
    ['Name', visible.name],
    ['Email', visible.email],
    ['Company', visible.company],
    ['Role', visible.role],
    ['Business type', visible.business_type],
    ['Intent', context.intent],
    ['Source page', context.source_page],
    ['Source section', context.source_section],
    ['Plan', context.plan],
    ['Language', context.lang]
  ];

  const attributionRows = ATTRIBUTION_FIELDS.map((field) => [field, attribution[field]]);

  return section('Lead', fieldRows) +
    '<h3>Message</h3><p>' + escapeHtml(visible.message).replace(/\n/g, '<br>') + '</p>' +
    section('Attribution', attributionRows);
}

function section(title, rows) {
  const body = rows
    .map((row) => '<tr><th align="left">' + escapeHtml(row[0]) + '</th><td>' + escapeHtml(row[1]) + '</td></tr>')
    .join('');
  return '<h3>' + escapeHtml(title) + '</h3><table cellpadding="4" cellspacing="0">' + body + '</table>';
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
