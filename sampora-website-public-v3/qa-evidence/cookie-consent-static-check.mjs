import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assetsDir = path.join(root, 'assets');
const containerId = 'GTM-NC23T9B2';
const failures = [];

const fail = (message) => failures.push(message);
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const has = (content, needle) => content.includes(needle);

function assertIncludes(label, content, needle) {
  if (!has(content, needle)) fail(`${label}: missing ${needle}`);
}

function assertPattern(label, content, pattern, description) {
  if (!pattern.test(content)) fail(`${label}: missing ${description}`);
}

function assertAnyPattern(label, content, patterns, description) {
  if (!patterns.some((pattern) => pattern.test(content))) fail(`${label}: missing ${description}`);
}

function listRootHtmlPages() {
  return fs.readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.html'))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

function listAssetFiles() {
  if (!fs.existsSync(assetsDir)) return [];
  const files = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(js|css|html)$/i.test(entry.name)) files.push(full);
    }
  };
  walk(assetsDir);
  return files;
}

function firstIndexOfAny(content, needles) {
  const indexes = needles
    .map((needle) => content.indexOf(needle))
    .filter((index) => index >= 0);
  return indexes.length ? Math.min(...indexes) : -1;
}

function hasDeniedField(content, field) {
  return new RegExp(`['"]?${field}['"]?\\s*:\\s*['"]denied['"]`, 'i').test(content);
}

function checkPage(page) {
  const html = read(page);
  const lower = html.toLowerCase();
  const gtmHeadIndex = lower.indexOf('googletagmanager.com/gtm.js?id=');
  const consentDefaultPattern = /gtag\s*\(\s*['"]consent['"]\s*,\s*['"]default['"]|datalayer\.push\s*\(\s*\[\s*['"]consent['"]\s*,\s*['"]default['"]/i;
  const gtmHeadLoaderPattern = new RegExp(`<script\\b[^>]*>[\\s\\S]*googletagmanager\\.com/gtm\\.js\\?id=[\\s\\S]*${containerId}[\\s\\S]*</script>`, 'i');
  const gtmNoscriptPattern = new RegExp(`<noscript>[\\s\\S]*googletagmanager\\.com/ns\\.html\\?id=${containerId}[\\s\\S]*</noscript>`, 'i');

  assertIncludes(page, html, containerId);
  assertPattern(page, html, gtmHeadLoaderPattern, 'GTM head loader');
  assertPattern(page, html, gtmNoscriptPattern, 'GTM noscript');

  if (gtmHeadIndex < 0) {
    fail(`${page}: missing GTM head marker`);
  } else {
    const preGtm = html.slice(0, gtmHeadIndex);
    assertPattern(page, preGtm, consentDefaultPattern, 'consent default before GTM');
    for (const field of ['analytics_storage', 'ad_storage', 'ad_user_data', 'ad_personalization']) {
      if (!hasDeniedField(preGtm, field)) fail(`${page}: ${field} is not denied before GTM`);
    }
    assertPattern(page, preGtm, /['"]?wait_for_update['"]?\s*:\s*\d+/i, 'wait_for_update before GTM');
  }

  assertIncludes(page, html, 'assets/sampora-cookie-preferences.css');
  assertIncludes(page, html, 'assets/sampora-cookie-preferences.js');

  const footerIndex = lower.lastIndexOf('<footer');
  const openerIndex = firstIndexOfAny(html, ['data-cookie-preferences-open', 'href="#cookie-preferences"']);
  if (openerIndex < 0) {
    fail(`${page}: missing Cookie Preferences opener`);
  } else if (footerIndex < 0 || openerIndex < footerIndex) {
    fail(`${page}: Cookie Preferences opener is not in the footer area`);
  }

  for (const marker of ['clarity.ms/tag', 'window.clarity=function']) {
    if (lower.includes(marker)) fail(`${page}: contains direct Clarity snippet marker ${marker}`);
  }

  const directTagPatterns = [
    [/googletagmanager\.com\/gtag\/js/i, 'direct gtag.js loader'],
    [/\bAW-\d+/i, 'Google Ads conversion ID'],
    [/gtag\s*\(\s*['"]event['"]\s*,\s*['"]conversion['"]/i, 'Google Ads conversion event'],
    [/googleadservices|doubleclick\.net|googleads\.g\.doubleclick\.net/i, 'Google Ads services tag'],
    [/fbq\s*\(|fbevents\.js|connect\.facebook\.net/i, 'Meta Pixel tag'],
    [/linkedin\.com\/insight|snap\.licdn\.com|_linkedin_partner_id|lintrk\s*\(/i, 'LinkedIn Insight tag'],
  ];
  for (const [pattern, description] of directTagPatterns) {
    if (pattern.test(html)) fail(`${page}: contains ${description}`);
  }
}

function checkCookiePreferencesAsset() {
  const rel = 'assets/sampora-cookie-preferences.js';
  const js = read(rel);
  for (const token of [
    'sampora_cookie_consent',
    'accepted',
    'rejected',
    'custom',
    'consentv2',
    'ad_Storage',
    'analytics_Storage',
    'analytics_storage',
    'ad_storage',
    'ad_user_data',
    'ad_personalization',
    'Accept all',
    'Reject non-essential',
    'Manage preferences',
    'Necessary cookies',
    'Analytics and marketing cookies',
    '接受全部',
    '拒绝非必要',
    '管理偏好',
    '必要 Cookie',
    '分析与营销 Cookie',
  ]) {
    assertIncludes(rel, js, token);
  }
  assertAnyPattern(rel, js, [
    /gtag\s*\(\s*['"]consent['"]\s*,\s*['"]update['"]/i,
    /dataLayer\.push\s*\(\s*\[\s*['"]consent['"]\s*,\s*['"]update['"]/i,
  ], "gtag('consent', 'update') or equivalent consent update");
  assertPattern(rel, js, /granted/i, 'granted consent update value');
  assertPattern(rel, js, /denied/i, 'denied consent update value');
  assertPattern(rel, js, /checkbox|role=["']switch["']|data-cookie-toggle/i, 'Analytics/marketing toggle control');
}

function checkPolicyDisclosures() {
  const privacy = read('privacy.html');
  const cookiePolicy = read('cookie-policy.html');
  const combined = `${privacy}\n${cookiePolicy}`;
  for (const token of ['Google Tag Manager', 'Google Analytics 4', 'Microsoft Clarity', 'Cookie Preferences', '_ga', '_ga_*', '_clck', '_clsk']) {
    assertIncludes('Privacy/Cookie Policy', combined, token);
  }
  for (const [label, content] of [['privacy.html', privacy], ['cookie-policy.html', cookiePolicy]]) {
    for (const token of ['Google Tag Manager', 'Google Analytics 4', 'Microsoft Clarity']) {
      assertIncludes(label, content, token);
    }
    assertPattern(label, content, /consent/i, 'consent disclosure');
    assertPattern(label, content, /Cookie Preferences|Cookie 偏好设置|Cookie 偏好/i, 'Cookie Preferences disclosure');
  }
}

function checkForbiddenDirectTags() {
  const files = [
    ...listRootHtmlPages().map((page) => path.join(root, page)),
    ...listAssetFiles(),
  ];
  const forbidden = [
    [/googletagmanager\.com\/gtag\/js/i, 'direct gtag.js loader'],
    [/\bAW-\d+/i, 'Google Ads conversion ID'],
    [/gtag\s*\(\s*['"]event['"]\s*,\s*['"]conversion['"]/i, 'Google Ads conversion event'],
    [/googleadservices|doubleclick\.net|googleads\.g\.doubleclick\.net/i, 'Google Ads services tag'],
    [/fbq\s*\(|fbevents\.js|connect\.facebook\.net/i, 'Meta Pixel tag'],
    [/linkedin\.com\/insight|snap\.licdn\.com|_linkedin_partner_id|lintrk\s*\(/i, 'LinkedIn Insight tag'],
  ];
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const rel = path.relative(root, file).replace(/\\/g, '/');
    for (const [pattern, description] of forbidden) {
      if (pattern.test(content)) fail(`${rel}: contains ${description}`);
    }
  }
}

const pages = listRootHtmlPages();
if (!pages.length) fail('public root: no root HTML pages found');
for (const page of pages) checkPage(page);
checkCookiePreferencesAsset();
checkPolicyDisclosures();
checkForbiddenDirectTags();

if (failures.length) {
  console.error('COOKIE_CONSENT_STATIC_CHECK_FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('COOKIE_CONSENT_STATIC_CHECK_OK');
