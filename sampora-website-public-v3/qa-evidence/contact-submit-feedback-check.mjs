import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadChromium } from './playwright-loader.mjs';

const chromium = loadChromium();
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contactPath = path.join(root, 'contact.html');
const contactHtml = await fs.readFile(contactPath, 'utf8');
const failures = [];

const PLACEHOLDER_ENDPOINT = '[BACKEND_CONTACT_ENDPOINT]';
const SOURCE_CONTACT_ENDPOINT = '/api/contact';
const requiredLeadKeys = ['source_page', 'landing_page', 'referrer', 'utm_source', 'utm_medium', 'utm_campaign', 'lang', 'website'];
const requiredFormBody = {
  name: 'QA Reviewer',
  company: 'QA Evidence Co',
  email: 'qa@example.com',
  role: 'Sample Supplier',
  business_type: 'contact_sales',
  message: 'QA evidence inline feedback check.',
};
const sensitivePendingTerms = [
  ...Object.keys(requiredFormBody),
  ...Object.values(requiredFormBody),
  ...requiredLeadKeys,
  'source_section',
  'plan',
  'contact_sales',
];

function fail(message) {
  failures.push(message);
}

function parseParams(raw) {
  return Object.fromEntries(new URLSearchParams(raw || ''));
}

function assertLeadContext(label, params, requireUtmValues = false) {
  const missing = requiredLeadKeys.filter(key => !(key in params));
  if (missing.length) fail(`${label}: missing lead context key(s): ${missing.join(', ')}`);
  if (params.source_page !== 'contact.html') fail(`${label}: source_page must be contact.html, got ${JSON.stringify(params.source_page)}`);
  const lang = String(params.lang || '').toLowerCase();
  if (lang !== 'en' && lang !== 'zh') fail(`${label}: lang must be en or zh, got ${JSON.stringify(params.lang)}`);
  if (requireUtmValues) {
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign']) {
      if (!params[key]) fail(`${label}: ${key} should be captured from URL in this test`);
    }
  }
}

function renderContactVariant(endpoint) {
  let html = contactHtml;
  html = html.replace(/<form\b[^>]*\bid=["']contactForm["'][^>]*>/i, (tag) => {
    let updated = tag;
    if (/\baction=["'][^"']*["']/i.test(updated)) updated = updated.replace(/\baction=["'][^"']*["']/i, `action="${endpoint}"`);
    else updated = updated.replace('<form', `<form action="${endpoint}"`);
    if (/\bdata-endpoint=["'][^"']*["']/i.test(updated)) updated = updated.replace(/\bdata-endpoint=["'][^"']*["']/i, `data-endpoint="${endpoint}"`);
    else updated = updated.replace('<form', `<form data-endpoint="${endpoint}"`);
    return updated;
  });
  html = html.replace(/(const\s+CONTACT_ENDPOINT\s*=\s*['"])[^'"]*(['"]\s*;)/, `$1${endpoint}$2`);
  return html;
}

function assertSourceEndpointContract() {
  const formTag = contactHtml.match(/<form\b[^>]*\bid=["']contactForm["'][^>]*>/i)?.[0] || '';
  const formAction = formTag.match(/\baction=["']([^"']+)["']/i)?.[1] || '';
  const dataEndpoint = formTag.match(/\bdata-endpoint=["']([^"']+)["']/i)?.[1] || '';
  const scriptEndpoint = contactHtml.match(/const\s+CONTACT_ENDPOINT\s*=\s*['"]([^'"]+)['"]/)?.[1] || '';
  for (const [label, value] of [['action', formAction], ['data-endpoint', dataEndpoint], ['CONTACT_ENDPOINT', scriptEndpoint]]) {
    if (value !== SOURCE_CONTACT_ENDPOINT) {
      fail(`source ${label} must be ${SOURCE_CONTACT_ENDPOINT}, got ${JSON.stringify(value)}`);
    }
  }
  if (/script\.google\.com\/macros|\/macros\/s\//i.test(contactHtml)) {
    fail('source contact.html must not directly reference Google Apps Script');
  }
}

function assertFullRequestBody(label, params) {
  for (const [key, expected] of Object.entries(requiredFormBody)) {
    if (params[key] !== expected) {
      fail(`${label}: ${key} request value ${JSON.stringify(params[key])} !== ${JSON.stringify(expected)}`);
    }
  }
}

function decodedStorageText(raw) {
  try {
    return decodeURIComponent(String(raw || '').replace(/\+/g, '%20'));
  } catch (e) {
    return String(raw || '');
  }
}

function assertNonSensitivePendingStorage(label, raw) {
  if (/[=&]/.test(raw)) fail(`${label}: pending marker looks like serialized form data: ${raw}`);
  if (raw.length > 64) fail(`${label}: pending marker is too long for a state-only marker (${raw.length} chars)`);
  const haystack = `${raw}\n${decodedStorageText(raw)}`.toLowerCase();
  for (const term of sensitivePendingTerms) {
    if (haystack.includes(String(term).toLowerCase())) {
      fail(`${label}: pending marker contains sensitive form content ${JSON.stringify(term)}: ${raw}`);
    }
  }
}

function assertMinimalPendingMarker(label, raw) {
  if (!raw) fail(`${label}: pending marker missing during submit`);
  else assertNonSensitivePendingStorage(label, raw);
}

function assertNoStoredFormContent(label, raw) {
  if (raw) assertNonSensitivePendingStorage(label, raw);
}

function serveFile(res, absolute) {
  return fs.readFile(absolute).then((body) => {
    const type = absolute.endsWith('.css') ? 'text/css'
      : absolute.endsWith('.js') ? 'text/javascript'
        : absolute.endsWith('.svg') ? 'image/svg+xml'
          : absolute.endsWith('.png') ? 'image/png'
            : absolute.endsWith('.ico') ? 'image/x-icon'
              : 'text/html';
    res.writeHead(200, { 'content-type': type });
    res.end(body);
  }).catch(() => {
    res.writeHead(404);
    res.end('not found');
  });
}

async function createServer() {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url || '/', 'http://127.0.0.1');
    if (url.pathname === '/contact-placeholder.html') {
      res.writeHead(200, { 'content-type': 'text/html' });
      res.end(renderContactVariant(PLACEHOLDER_ENDPOINT));
      return;
    }
    if (url.pathname === '/contact-live-success.html') {
      res.writeHead(200, { 'content-type': 'text/html' });
      res.end(renderContactVariant('/__contact_success'));
      return;
    }
    if (url.pathname === '/contact-live-failure.html') {
      res.writeHead(200, { 'content-type': 'text/html' });
      res.end(renderContactVariant('/__contact_failure'));
      return;
    }
    if (url.pathname === '/contact-live-json-failure.html') {
      res.writeHead(200, { 'content-type': 'text/html' });
      res.end(renderContactVariant('/__contact_json_failure'));
      return;
    }
    if (url.pathname === '/contact-live-parse-failure.html') {
      res.writeHead(200, { 'content-type': 'text/html' });
      res.end(renderContactVariant('/__contact_parse_failure'));
      return;
    }
    if (url.pathname === '/contact.html') {
      res.writeHead(200, { 'content-type': 'text/html' });
      res.end(contactHtml);
      return;
    }
    if (url.pathname === '/__contact_success') {
      setTimeout(() => {
        res.writeHead(200, {
          'content-type': 'application/json',
          'access-control-allow-origin': '*',
        });
        res.end('{"ok":true}');
      }, 800);
      return;
    }
    if (url.pathname === '/__contact_failure') {
      setTimeout(() => {
        res.writeHead(500, {
          'content-type': 'application/json',
          'access-control-allow-origin': '*',
        });
        res.end('{"ok":false}');
      }, 500);
      return;
    }
    if (url.pathname === '/__contact_json_failure') {
      setTimeout(() => {
        res.writeHead(200, {
          'content-type': 'application/json',
          'access-control-allow-origin': '*',
        });
        res.end('{"ok":false}');
      }, 500);
      return;
    }
    if (url.pathname === '/__contact_parse_failure') {
      setTimeout(() => {
        res.writeHead(200, {
          'content-type': 'application/json',
          'access-control-allow-origin': '*',
        });
        res.end('{not valid json');
      }, 500);
      return;
    }
    const safePath = path.normalize(decodeURIComponent(url.pathname)).replace(/^[/\\]+/, '');
    const absolute = path.resolve(root, safePath);
    if (!absolute.startsWith(root)) {
      res.writeHead(403);
      res.end('forbidden');
      return;
    }
    serveFile(res, absolute);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return server;
}

async function fillForm(page) {
  await page.fill('#name', 'QA Reviewer');
  await page.fill('#company', 'QA Evidence Co');
  await page.fill('#email', 'qa@example.com');
  await page.selectOption('#role', 'Sample Supplier');
  await page.selectOption('#business_type', 'contact_sales');
  await page.fill('#message', 'QA evidence inline feedback check.');
}

async function readFeedback(page) {
  return page.evaluate(() => {
    const feedback = document.querySelector('#contactSubmitFeedback');
    return {
      exists: !!feedback,
      hidden: feedback?.hidden ?? null,
      role: feedback?.getAttribute('role') || null,
      ariaLive: feedback?.getAttribute('aria-live') || null,
      state: feedback?.dataset.state || '',
      text: feedback?.textContent?.trim() || '',
    };
  });
}

function expectFeedbackState(label, sample, state) {
  if (!sample.exists) fail(`${label}: inline feedback element missing`);
  if (sample.role !== 'status') fail(`${label}: inline feedback role is ${sample.role}`);
  if (sample.ariaLive !== 'polite') fail(`${label}: inline feedback aria-live is ${sample.ariaLive}`);
  if (sample.hidden) fail(`${label}: inline feedback is still hidden`);
  if (sample.state !== state) fail(`${label}: inline feedback state ${sample.state} !== ${state}`);
}

async function readFormValues(page) {
  return page.evaluate(() => ({
    name: document.querySelector('#name')?.value || '',
    company: document.querySelector('#company')?.value || '',
    email: document.querySelector('#email')?.value || '',
    role: document.querySelector('#role')?.value || '',
    businessType: document.querySelector('#business_type')?.value || '',
    message: document.querySelector('#message')?.value || '',
    submitDisabled: document.querySelector('#contactForm button[type="submit"]')?.disabled || false,
  }));
}

async function readPendingMarker(page) {
  return page.evaluate(() => sessionStorage.getItem('sampora_contact_pending') || '');
}

const server = await createServer();
const { port } = server.address();
const base = `http://127.0.0.1:${port}`;
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_EXECUTABLE_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
const page = await browser.newPage();
const contactRequests = [];
const appsScriptRequests = [];

assertSourceEndpointContract();

await page.route('https://script.google.com/**', route => {
  appsScriptRequests.push(route.request().url());
  route.abort();
});

page.on('request', request => {
  if (request.url().includes('/__contact_')) {
    contactRequests.push({
      url: request.url(),
      method: request.method(),
      postData: request.postData() || '',
    });
  }
});

try {
  await page.goto(`${base}/contact-live-success.html?lang=en&utm_source=qa_source&utm_medium=qa_medium&utm_campaign=qa_campaign#contact-form`, { waitUntil: 'load' });
  await page.locator('#contact-form').scrollIntoViewIfNeeded();
  const successInitial = await readFeedback(page);
  if (!successInitial.exists) fail('live success initial: inline feedback element missing');
  const successRequestStart = contactRequests.length;
  await fillForm(page);
  await page.click('#contactForm button[type="submit"]');
  await page.waitForFunction(() => document.querySelector('#contactSubmitFeedback')?.dataset?.state === 'submitting');
  const pendingValues = await readFormValues(page);
  if (pendingValues.submitDisabled) fail('live success pending disabled the submit button');
  assertMinimalPendingMarker('live success pending storage', await readPendingMarker(page));
  await page.waitForFunction(() => document.querySelector('#contactSubmitFeedback')?.dataset?.state === 'success');
  expectFeedbackState('live success', await readFeedback(page), 'success');

  const successValues = await readFormValues(page);
  if (successValues.name || successValues.company || successValues.email || successValues.message) {
    fail(`live success did not clear user input: ${JSON.stringify(successValues)}`);
  }
  const successPending = await page.evaluate(() => sessionStorage.getItem('sampora_contact_pending') || '');
  if (successPending) fail(`live success did not clear pending storage: ${successPending}`);

  const successRequests = contactRequests.slice(successRequestStart).filter(req => req.url.includes('/__contact_success'));
  if (!successRequests.length) {
    fail('live success did not issue local mock backend request');
  } else {
    const successParams = parseParams(successRequests.at(-1).postData);
    assertFullRequestBody('live success request body', successParams);
    assertLeadContext('live success request body', successParams, true);
  }

  await page.goto(`${base}/contact-live-json-failure.html?lang=en&utm_source=qa_source&utm_medium=qa_medium&utm_campaign=qa_campaign#contact-form`, { waitUntil: 'load' });
  await page.locator('#contact-form').scrollIntoViewIfNeeded();
  const jsonFailureInitial = await readFeedback(page);
  if (!jsonFailureInitial.exists) fail('live JSON ok false initial: inline feedback element missing');
  const jsonFailureRequestStart = contactRequests.length;
  await fillForm(page);
  await page.click('#contactForm button[type="submit"]');
  await page.waitForFunction(() => document.querySelector('#contactSubmitFeedback')?.dataset?.state === 'submitting');
  assertMinimalPendingMarker('live JSON ok false pending storage', await readPendingMarker(page));
  await page.waitForFunction(() => {
    const state = document.querySelector('#contactSubmitFeedback')?.dataset?.state;
    return state && state !== 'submitting';
  });
  expectFeedbackState('live JSON ok false', await readFeedback(page), 'failure');

  const jsonFailureValues = await readFormValues(page);
  if (jsonFailureValues.name !== 'QA Reviewer' || jsonFailureValues.message !== 'QA evidence inline feedback check.') {
    fail(`live JSON ok false did not preserve user input: ${JSON.stringify(jsonFailureValues)}`);
  }
  assertNoStoredFormContent('live JSON ok false stored pending marker', await readPendingMarker(page));

  const jsonFailureRequests = contactRequests.slice(jsonFailureRequestStart).filter(req => req.url.includes('/__contact_json_failure'));
  if (!jsonFailureRequests.length) {
    fail('live JSON ok false did not issue local mock backend request');
  } else {
    const jsonFailureParams = parseParams(jsonFailureRequests.at(-1).postData);
    assertFullRequestBody('live JSON ok false request body', jsonFailureParams);
    assertLeadContext('live JSON ok false request body', jsonFailureParams, true);
  }

  await page.goto(`${base}/contact-live-parse-failure.html?lang=en&utm_source=qa_source&utm_medium=qa_medium&utm_campaign=qa_campaign#contact-form`, { waitUntil: 'load' });
  await page.locator('#contact-form').scrollIntoViewIfNeeded();
  const parseFailureInitial = await readFeedback(page);
  if (!parseFailureInitial.exists) fail('live JSON parse failure initial: inline feedback element missing');
  const parseFailureRequestStart = contactRequests.length;
  await fillForm(page);
  await page.click('#contactForm button[type="submit"]');
  await page.waitForFunction(() => document.querySelector('#contactSubmitFeedback')?.dataset?.state === 'submitting');
  assertMinimalPendingMarker('live JSON parse failure pending storage', await readPendingMarker(page));
  await page.waitForFunction(() => {
    const state = document.querySelector('#contactSubmitFeedback')?.dataset?.state;
    return state && state !== 'submitting';
  });
  expectFeedbackState('live JSON parse failure', await readFeedback(page), 'failure');

  const parseFailureValues = await readFormValues(page);
  if (parseFailureValues.name !== 'QA Reviewer' || parseFailureValues.message !== 'QA evidence inline feedback check.') {
    fail(`live JSON parse failure did not preserve user input: ${JSON.stringify(parseFailureValues)}`);
  }
  assertNoStoredFormContent('live JSON parse failure stored pending marker', await readPendingMarker(page));

  const parseFailureRequests = contactRequests.slice(parseFailureRequestStart).filter(req => req.url.includes('/__contact_parse_failure'));
  if (!parseFailureRequests.length) {
    fail('live JSON parse failure did not issue local mock backend request');
  } else {
    const parseFailureParams = parseParams(parseFailureRequests.at(-1).postData);
    assertFullRequestBody('live JSON parse failure request body', parseFailureParams);
    assertLeadContext('live JSON parse failure request body', parseFailureParams, true);
  }

  await page.goto(`${base}/contact-live-failure.html?lang=en&utm_source=qa_source&utm_medium=qa_medium&utm_campaign=qa_campaign#contact-form`, { waitUntil: 'load' });
  await page.locator('#contact-form').scrollIntoViewIfNeeded();
  const failureInitial = await readFeedback(page);
  if (!failureInitial.exists) fail('live failure initial: inline feedback element missing');
  const failureRequestStart = contactRequests.length;
  await fillForm(page);
  await page.click('#contactForm button[type="submit"]');
  await page.waitForFunction(() => document.querySelector('#contactSubmitFeedback')?.dataset?.state === 'submitting');
  assertMinimalPendingMarker('live failure pending storage', await readPendingMarker(page));
  await page.waitForFunction(() => document.querySelector('#contactSubmitFeedback')?.dataset?.state === 'failure');
  expectFeedbackState('live failure', await readFeedback(page), 'failure');

  const failureValues = await readFormValues(page);
  if (failureValues.name !== 'QA Reviewer' || failureValues.message !== 'QA evidence inline feedback check.') {
    fail(`live failure did not preserve user input: ${JSON.stringify(failureValues)}`);
  }
  assertNoStoredFormContent('live failure stored pending marker', await readPendingMarker(page));

  const failureRequests = contactRequests.slice(failureRequestStart).filter(req => req.url.includes('/__contact_failure'));
  if (!failureRequests.length) {
    fail('live failure did not issue local mock backend request');
  } else {
    const failureParams = parseParams(failureRequests.at(-1).postData);
    assertFullRequestBody('live failure request body', failureParams);
    assertLeadContext('live failure request body', failureParams, true);
  }

  if (appsScriptRequests.length) {
    fail(`test should not reach real Apps Script endpoint, but captured: ${JSON.stringify(appsScriptRequests)}`);
  }
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}

if (failures.length) {
  console.log('FAIL contact submit feedback check');
  failures.forEach(message => console.log(`- ${message}`));
  process.exitCode = 1;
} else {
  console.log('PASS contact submit feedback check');
}
