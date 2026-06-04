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
const requiredLeadKeys = [
  'source_page',
  'landing_page',
  'referrer',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fbclid',
  'msclkid',
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
  'last_referrer',
  'lang',
  'website',
];
const requiredFormBody = {
  name: 'QA Reviewer',
  company: 'QA Evidence Co',
  email: 'qa@example.com',
  role: 'sample_supplier',
  business_type: 'contact_sales',
  message: 'QA evidence inline feedback check.',
};
const expectedRoleOptions = [
  { value: '', key: 'rolePh', en: 'Select the closest match', zh: '请选择最接近你的身份', disabled: true },
  { value: 'panel_provider', key: 'rolePanelProvider', en: 'Owned panel / sample operations team', zh: '自有 Panel / 样本运营团队' },
  { value: 'sample_supplier', key: 'roleSampleSupplier', en: 'Sample supplier / delivery partner', zh: '样本供应商 / 交付合作方' },
  { value: 'client_side', key: 'roleClientSide', en: 'Client-side team / project buyer', zh: '客户方 / 项目发布方' },
  { value: 'two_sided_operations', key: 'roleTwoSided', en: 'Two-sided operations team', zh: '双向运营团队：同时管理客户和供应商' },
  { value: 'aggregator_network', key: 'roleAggregator', en: 'Sample aggregator / supplier network operator', zh: '样本聚合 / 供应网络运营方' },
  { value: 'api_supplier', key: 'roleApi', en: 'API-connected supplier', zh: 'API 对接供应商' },
  { value: 'enterprise_multi_entity', key: 'roleEnterprise', en: 'Enterprise / multi-entity operations team', zh: '企业 / 多实体运营团队' },
  { value: 'not_sure', key: 'roleNotSure', en: 'Not sure / explore cooperation first', zh: '不确定：先了解合作资源' },
  { value: 'Other', key: 'roleOther', en: 'Other / please specify', zh: '其他 / 手动填写' },
];
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

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function assertRoleSourceContract() {
  const selectTag = contactHtml.match(/<select\b[^>]*\bid=["']role["'][^>]*>/i)?.[0] || '';
  if (!/\bname=["']role["']/.test(selectTag)) fail('source role select must keep name="role"');
  const selectBlock = contactHtml.match(/<select\b[^>]*\bid=["']role["'][^>]*>[\s\S]*?<\/select>/i)?.[0] || '';
  if (!selectBlock) {
    fail('source role select block missing');
    return;
  }
  const options = [...selectBlock.matchAll(/<option\b([^>]*)>([\s\S]*?)<\/option>/gi)].map(match => {
    const attrs = match[1];
    return {
      value: attrs.match(/\bvalue=["']([^"']*)["']/i)?.[1] ?? null,
      key: attrs.match(/\bdata-i18n=["']([^"']+)["']/i)?.[1] || '',
      text: normalizeText(match[2]),
      disabled: /\bdisabled\b/i.test(attrs),
    };
  });
  if (options.length !== expectedRoleOptions.length) {
    fail(`source role option count ${options.length} !== ${expectedRoleOptions.length}`);
  }
  expectedRoleOptions.forEach((expected, index) => {
    const actual = options[index] || {};
    if (actual.value !== expected.value) fail(`source role option ${index} value ${JSON.stringify(actual.value)} !== ${JSON.stringify(expected.value)}`);
    if (actual.key !== expected.key) fail(`source role option ${index} data-i18n ${JSON.stringify(actual.key)} !== ${JSON.stringify(expected.key)}`);
    if (actual.text !== expected.en) fail(`source role option ${index} EN text ${JSON.stringify(actual.text)} !== ${JSON.stringify(expected.en)}`);
    if (!!actual.disabled !== !!expected.disabled) fail(`source role option ${index} disabled ${!!actual.disabled} !== ${!!expected.disabled}`);
  });
  const exactOptionText = "role: ['rolePh','rolePanelProvider','roleSampleSupplier','roleClientSide','roleTwoSided','roleAggregator','roleApi','roleEnterprise','roleNotSure','roleOther']";
  if (!contactHtml.includes(exactOptionText)) fail('source optionText.role does not match Scheme B exact key list');
  if (!/roleSelect\s*&&\s*roleSelect\.value\s*===\s*['"]Other['"]/.test(contactHtml)) {
    fail('source updateRoleOtherState must continue to compare roleSelect.value === "Other"');
  }
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
  const requiredTrackingDefaults = [
    "start_trial: { cta_intent: 'trial_request', cta_event: 'apply_for_trial_click' }",
    "book_demo: { cta_intent: 'demo_request', cta_event: 'book_demo_click' }",
    "contact_sales: { cta_intent: 'sales_contact', cta_event: 'contact_sales_click' }",
    "cooperation: { cta_intent: 'cooperation_resources', cta_event: 'resource_click' }",
    'output.cta_intent = trackingDefault.cta_intent',
    'output.cta_event = trackingDefault.cta_event',
    'runtimeEvent !== trackingDefault.cta_event',
  ];
  for (const snippet of requiredTrackingDefaults) {
    if (!contactHtml.includes(snippet)) {
      fail(`source contact.html missing intent-level tracking override: ${snippet}`);
    }
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
    if (url.pathname === '/contact-live-data-success.html') {
      res.writeHead(200, { 'content-type': 'text/html' });
      res.end(renderContactVariant('/__contact_data_success'));
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
    if (url.pathname === '/__contact_data_success') {
      setTimeout(() => {
        res.writeHead(200, {
          'content-type': 'application/json',
          'access-control-allow-origin': '*',
        });
        res.end('{"data":{"ok":true}}');
      }, 500);
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
  await page.selectOption('#role', 'sample_supplier');
  await page.selectOption('#business_type', 'contact_sales');
  await page.fill('#message', 'QA evidence inline feedback check.');
}

async function readRoleOptions(page) {
  return page.evaluate(() => [...document.querySelectorAll('#role option')].map(option => ({
    value: option.value,
    text: option.textContent.trim().replace(/\s+/g, ' '),
    disabled: option.disabled,
  })));
}

async function assertRoleOptionsRuntime(page, lang) {
  const options = await readRoleOptions(page);
  if (options.length !== expectedRoleOptions.length) {
    fail(`${lang} role option count ${options.length} !== ${expectedRoleOptions.length}`);
  }
  expectedRoleOptions.forEach((expected, index) => {
    const actual = options[index] || {};
    const expectedText = expected[lang];
    if (actual.value !== expected.value) fail(`${lang} role option ${index} value ${JSON.stringify(actual.value)} !== ${JSON.stringify(expected.value)}`);
    if (actual.text !== expectedText) fail(`${lang} role option ${index} text ${JSON.stringify(actual.text)} !== ${JSON.stringify(expectedText)}`);
    if (!!actual.disabled !== !!expected.disabled) fail(`${lang} role option ${index} disabled ${!!actual.disabled} !== ${!!expected.disabled}`);
  });
}

async function readRoleOtherState(page) {
  return page.evaluate(() => ({
    role: document.querySelector('#role')?.value || '',
    hidden: document.querySelector('#roleOtherField')?.hidden ?? null,
    disabled: document.querySelector('#role_other')?.disabled ?? null,
    required: document.querySelector('#role_other')?.required ?? null,
  }));
}

async function assertRoleOtherToggleBehavior(page) {
  await page.selectOption('#role', 'Other');
  const otherState = await readRoleOtherState(page);
  if (otherState.role !== 'Other') fail(`Other toggle role value ${JSON.stringify(otherState.role)} !== "Other"`);
  if (otherState.hidden) fail('Other toggle should show role_other field');
  if (otherState.disabled) fail('Other toggle should enable role_other input');
  if (!otherState.required) fail('Other toggle should require role_other input');

  await page.selectOption('#role', 'not_sure');
  const notSureState = await readRoleOtherState(page);
  if (notSureState.role !== 'not_sure') fail(`not_sure toggle role value ${JSON.stringify(notSureState.role)} !== "not_sure"`);
  if (!notSureState.hidden) fail('not_sure toggle should hide role_other field');
  if (!notSureState.disabled) fail('not_sure toggle should disable role_other input');
  if (notSureState.required) fail('not_sure toggle should not require role_other input');
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

async function expectThankYouRedirect(page, label) {
  const isThankYou = () => {
    try {
      return new URL(page.url()).pathname === '/thank-you.html';
    } catch (error) {
      return false;
    }
  };
  if (!isThankYou()) {
    await page.waitForURL(url => url.pathname === '/thank-you.html', { timeout: 5000 }).catch(() => {});
  }
  if (!isThankYou()) {
    const current = new URL(page.url());
    fail(`${label}: redirected to ${current.pathname} instead of /thank-you.html`);
  }
  const pending = await readPendingMarker(page);
  if (pending) fail(`${label}: pending storage remained after thank-you redirect: ${pending}`);
}

const server = await createServer();
const { port } = server.address();
const base = `http://127.0.0.1:${port}`;
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_EXECUTABLE_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
const page = await browser.newPage();
const contactRequests = [];
const appsScriptRequests = [];

assertSourceEndpointContract();
assertRoleSourceContract();

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
  await assertRoleOptionsRuntime(page, 'en');
  await assertRoleOtherToggleBehavior(page);
  const successInitial = await readFeedback(page);
  if (!successInitial.exists) fail('live success initial: inline feedback element missing');
  const successRequestStart = contactRequests.length;
  await fillForm(page);
  await page.click('#contactForm button[type="submit"]');
  await page.waitForFunction(() => document.querySelector('#contactSubmitFeedback')?.dataset?.state === 'submitting');
  const pendingValues = await readFormValues(page);
  if (!pendingValues.submitDisabled) fail('live success pending did not disable the submit button');
  assertMinimalPendingMarker('live success pending storage', await readPendingMarker(page));
  await expectThankYouRedirect(page, 'live success');

  const successRequests = contactRequests.slice(successRequestStart).filter(req => req.url.includes('/__contact_success'));
  if (!successRequests.length) {
    fail('live success did not issue local mock backend request');
  } else {
    const successParams = parseParams(successRequests.at(-1).postData);
    assertFullRequestBody('live success request body', successParams);
    assertLeadContext('live success request body', successParams, true);
  }

  await page.goto(`${base}/contact-live-success.html?lang=zh&utm_source=qa_source&utm_medium=qa_medium&utm_campaign=qa_campaign#contact-form`, { waitUntil: 'load' });
  await page.locator('#contact-form').scrollIntoViewIfNeeded();
  await assertRoleOptionsRuntime(page, 'zh');

  await page.goto(`${base}/contact-live-data-success.html?lang=en&utm_source=qa_source&utm_medium=qa_medium&utm_campaign=qa_campaign#contact-form`, { waitUntil: 'load' });
  await page.locator('#contact-form').scrollIntoViewIfNeeded();
  const dataSuccessInitial = await readFeedback(page);
  if (!dataSuccessInitial.exists) fail('live data-wrapped success initial: inline feedback element missing');
  const dataSuccessRequestStart = contactRequests.length;
  await fillForm(page);
  await page.click('#contactForm button[type="submit"]');
  await page.waitForFunction(() => document.querySelector('#contactSubmitFeedback')?.dataset?.state === 'submitting');
  assertMinimalPendingMarker('live data-wrapped success pending storage', await readPendingMarker(page));
  await expectThankYouRedirect(page, 'live data-wrapped success');

  const dataSuccessRequests = contactRequests.slice(dataSuccessRequestStart).filter(req => req.url.includes('/__contact_data_success'));
  if (!dataSuccessRequests.length) {
    fail('live data-wrapped success did not issue local mock backend request');
  } else {
    const dataSuccessParams = parseParams(dataSuccessRequests.at(-1).postData);
    assertFullRequestBody('live data-wrapped success request body', dataSuccessParams);
    assertLeadContext('live data-wrapped success request body', dataSuccessParams, true);
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
