import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), 'sampora-website-public-v3');
const assets = path.join(root, 'assets');
const targetPages = [
  'index.html',
  'solutions.html',
  'resources.html',
  'resource-manuals.html',
  'plans.html',
  'about.html',
  'contact.html',
  'privacy.html',
  'cookie-policy.html',
  'terms.html',
  '404.html',
];

const legalPages = ['privacy.html', 'cookie-policy.html', 'terms.html'];
const salesmartlyUrl = 'https://' + 'plugin-code.salesmartly.com/js/project_693595_715565_1777101144.js';
const salesmartlyHost = 'https://' + 'plugin-code.salesmartly.com';
const directScriptTag = `<script src="${salesmartlyUrl}"></script>`;
const removedAiSupportResidue = [
  'sampora_ai_support_notice_ack',
  'AI support notice',
  'AI 客服提示',
  'Continue to AI support',
  '继续使用 AI 客服',
  'showAINoticeThenLoad',
  'showNoticeThenLoad',
  'loadAIChatProvider',
  'loadSaleSmartly',
  'data-ai-support-open',
  'assets/sampora-ai-support.js',
  'assets/sampora-ai-support.css',
  'sampora-ai-launcher',
  'sampora-ai-notice',
];
const oldConfirmationCopy = [
  'opens AI support and confirms the notice',
  'confirms the notice',
  'only after the visitor opens AI support',
  'confirm AI support notice',
  'AI support notice acknowledgement',
  '打开 AI 客服并确认提示后加载',
  '确认 AI 客服提示后加载',
  '记住访问者已确认 AI 客服提示',
];
const forbiddenDirectTracking = [
  [/clarity\.ms\/tag|window\.clarity\s*=\s*function/i, 'direct Clarity HTML snippet'],
  [/\bAW-\d+/i, 'Google Ads conversion ID'],
  [/gtag\s*\(\s*['"]event['"]\s*,\s*['"]conversion['"]/i, 'Google Ads conversion event'],
  [/googleadservices|googleads\.g\.doubleclick\.net/i, 'Google Ads conversion service tag'],
  [/fbq\s*\(|fbevents\.js|connect\.facebook\.net/i, 'Meta Pixel tag'],
  [/linkedin\.com\/insight|snap\.licdn\.com|_linkedin_partner_id|lintrk\s*\(/i, 'LinkedIn Insight tag'],
];
const failures = [];

function readRoot(rel) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    failures.push(`${rel}: missing file`);
    return '';
  }
  return fs.readFileSync(file, 'utf8');
}

function listFiles(dir, filter) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listFiles(full, filter);
    return filter(full) ? [full] : [];
  });
}

function getAttribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}\\s*=\\s*(['"])([\\s\\S]*?)\\1`, 'i'))?.[2] || '';
}

function getCspMetaContents(html) {
  return (html.match(/<meta\b[^>]*>/gi) || [])
    .filter((tag) => /^Content-Security-Policy$/i.test(getAttribute(tag, 'http-equiv')))
    .map((tag) => getAttribute(tag, 'content'))
    .filter(Boolean);
}

function getCspDirective(csp, directiveName) {
  return csp
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.toLowerCase().startsWith(`${directiveName.toLowerCase()} `)) || '';
}

function requireText(label, content, text) {
  if (!content.includes(text)) failures.push(`${label}: missing ${text}`);
}

function forbidText(label, content, text) {
  if (content.includes(text)) failures.push(`${label}: contains ${text}`);
}

for (const page of targetPages) {
  const html = readRoot(page);
  if (!html) continue;
  const remoteCount = html.split(salesmartlyUrl).length - 1;
  if (remoteCount !== 1) failures.push(`${page}: expected exactly one direct SaleSmartly script, found ${remoteCount}`);
  if (!html.includes(directScriptTag)) failures.push(`${page}: missing exact direct SaleSmartly script tag`);
  const bodyClose = html.lastIndexOf('</body>');
  const scriptIndex = html.lastIndexOf(directScriptTag);
  if (bodyClose === -1 || scriptIndex === -1 || scriptIndex > bodyClose) {
    failures.push(`${page}: SaleSmartly script is not before </body>`);
  }
  for (const residue of removedAiSupportResidue) forbidText(page, html, residue);
  for (const text of oldConfirmationCopy) forbidText(page, html, text);
}

{
  const about = readRoot('about.html');
  if (about && about.includes(salesmartlyUrl)) {
    const cspMetaContents = getCspMetaContents(about);
    for (const csp of cspMetaContents) {
      const scriptSrc = getCspDirective(csp, 'script-src');
      const scriptSrcTokens = scriptSrc.split(/\s+/).slice(1);
      if (!scriptSrc || !scriptSrcTokens.includes(salesmartlyHost)) {
        failures.push(`about.html: CSP script-src must allow ${salesmartlyHost} when SaleSmartly is loaded`);
      }
    }
  }
}

for (const rel of ['assets/sampora-ai-support.js', 'assets/sampora-ai-support.css']) {
  if (fs.existsSync(path.join(root, rel))) failures.push(`${rel}: obsolete local AI support asset still exists`);
}

for (const page of legalPages) {
  const html = readRoot(page);
  if (!html) continue;
  requireText(page, html, 'SaleSmartly');
}

const privacy = readRoot('privacy.html');
if (privacy) {
  for (const text of [
    'AI support chat',
    'AI 客服',
    'up to 90 days',
    '最长保留 90 天',
    'We do not sync SaleSmartly chat records to email, CRM, WhatsApp, Facebook, or Telegram',
    '不会将 SaleSmartly 聊天记录同步到邮箱、CRM、WhatsApp、Facebook 或 Telegram',
  ]) {
    requireText('privacy.html', privacy, text);
  }
  for (const text of oldConfirmationCopy) forbidText('privacy.html', privacy, text);
}

const cookiePolicy = readRoot('cookie-policy.html');
if (cookiePolicy) {
  for (const text of ['SaleSmartly', 'support follow-up', '客服跟进']) {
    requireText('cookie-policy.html', cookiePolicy, text);
  }
  for (const text of [
    'sampora_ai_support_notice_ack',
    'AI support notice acknowledgement',
    '记住访问者已确认 AI 客服提示',
    '确认 AI 客服提示后加载',
  ]) {
    forbidText('cookie-policy.html', cookiePolicy, text);
  }
}

const terms = readRoot('terms.html');
if (terms) {
  for (const text of [
    'AI support responses',
    'AI 客服回复',
    'SaleSmartly',
    'do not create a binding quote',
    '不构成具有约束力的报价',
  ]) {
    requireText('terms.html', terms, text);
  }
}

const cookiePrefs = readRoot('assets/sampora-cookie-preferences.js');
if (cookiePrefs) {
  for (const text of [
    'cookie-notice',
    'data-cookie-got-it',
    'showNotice()',
    'ensureNotice()',
    'confirm the notice',
    'Loaded on request',
    '打开时加载',
  ]) {
    forbidText('sampora-cookie-preferences.js', cookiePrefs, text);
  }
}

const sourceFiles = [
  ...targetPages.map((page) => path.join(root, page)),
  ...listFiles(assets, (file) => /\.(js|css)$/i.test(file)),
];

for (const file of sourceFiles) {
  if (!fs.existsSync(file)) continue;
  const rel = path.relative(root, file).replace(/\\/g, '/');
  const content = fs.readFileSync(file, 'utf8');
  for (const [pattern, description] of forbiddenDirectTracking) {
    if (pattern.test(content)) failures.push(`${rel}: contains ${description}`);
  }
}

if (failures.length) {
  console.error('SALESMARTLY_AI_SUPPORT_CHECK_FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('SALESMARTLY_AI_SUPPORT_CHECK_OK');
