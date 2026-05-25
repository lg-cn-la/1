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
  '404.html'
];

const legalPages = ['privacy.html', 'cookie-policy.html', 'terms.html'];
const salesmartlyUrl = 'https://' + 'plugin-code.salesmartly.com/js/project_693595_715565_1777101144.js';
const directScriptTag = `<script src="${salesmartlyUrl}"></script>`;
const removedAiSupportResidue = [
  'sampora_ai_support_notice_ack',
  'AI support notice',
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
  'sampora-ai-notice'
];
const oldLowFrictionConflictCopy = [
  'opens AI support and confirms the notice',
  'confirms the notice',
  'only after the visitor opens AI support',
  '打开 AI 客服并确认提示后加载',
  '确认提示后加载'
];
const analyticsOrMarketingPattern = /googletagmanager|google-analytics|gtag\(|clarity\.ms|fbq\(|connect\.facebook\.net|linkedin\.com\/insight|snap\.licdn|doubleclick|googleadservices/i;
const hindiPattern = /data-lang=["']hi["']|[?&]lang=hi\b|localStorage\.setItem\(\s*["']sampora_lang["']\s*,\s*["']hi["']\s*\)|documentElement\.lang\s*=\s*["']hi["']/i;
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
  for (const residue of removedAiSupportResidue) {
    if (html.includes(residue)) failures.push(`${page}: contains removed AI support residue ${residue}`);
  }
  for (const text of oldLowFrictionConflictCopy) {
    if (html.includes(text)) failures.push(`${page}: contains old AI confirmation copy ${text}`);
  }
}

for (const rel of ['assets/sampora-ai-support.js', 'assets/sampora-ai-support.css']) {
  if (fs.existsSync(path.join(root, rel))) failures.push(`${rel}: obsolete local AI support asset still exists`);
}

for (const page of legalPages) {
  const html = readRoot(page);
  if (!html) continue;
  if (!html.includes('SaleSmartly')) failures.push(`${page}: missing SaleSmartly legal content`);
}

const privacy = readRoot('privacy.html');
if (privacy) {
  for (const text of ['AI support chat', 'AI 客服', 'up to 90 days', '最长保留 90 天', 'not sync SaleSmartly chat records to email, CRM, WhatsApp, Facebook, or Telegram']) {
    if (!privacy.includes(text)) failures.push(`privacy.html: missing ${text}`);
  }
  for (const text of ['confirm AI support notice', '确认 AI 客服提示后加载', 'sampora_ai_support_notice_ack']) {
    if (privacy.includes(text)) failures.push(`privacy.html: contains old AI confirmation wording ${text}`);
  }
}

const cookiePolicy = readRoot('cookie-policy.html');
if (cookiePolicy) {
  const requiredCookiePolicy = [
    'Functional / AI support storage',
    '功能性 / AI 客服存储',
    'SaleSmartly may use cookies, localStorage, sessionStorage, or a vendor session ID',
    'SaleSmartly 可能使用 Cookie、localStorage、sessionStorage 或服务商会话 ID',
    'Analytics cookies',
    'Marketing cookies',
    '分析 Cookie',
    '营销 Cookie',
    'Currently not used',
    '当前未启用'
  ];
  for (const text of requiredCookiePolicy) {
    if (!cookiePolicy.includes(text)) failures.push(`cookie-policy.html: missing ${text}`);
  }
  for (const text of ['sampora_ai_support_notice_ack', 'AI support notice acknowledgement', '记住访问者已确认 AI 客服提示', '确认 AI 客服提示后加载']) {
    if (cookiePolicy.includes(text)) failures.push(`cookie-policy.html: contains old AI confirmation storage wording ${text}`);
  }
}

const terms = readRoot('terms.html');
if (terms) {
  for (const text of ['AI support responses', 'AI 客服回复', 'do not create a binding quote', '不构成具有约束力的报价']) {
    if (!terms.includes(text)) failures.push(`terms.html: missing ${text}`);
  }
}

const cookiePrefs = readRoot('assets/sampora-cookie-preferences.js');
if (cookiePrefs) {
  const expectedCookiePrefs = [
    'Necessary storage',
    'Functional / AI support storage',
    'Used for SaleSmartly support chat',
    'Analytics cookies',
    'Marketing cookies',
    'Always on',
    'Currently not used',
    '必要存储',
    '功能性 / AI 客服存储',
    '用于 SaleSmartly 客服会话',
    '分析 Cookie',
    '营销 Cookie',
    '始终开启',
    '当前未启用'
  ];
  for (const text of expectedCookiePrefs) {
    if (!cookiePrefs.includes(text)) failures.push(`sampora-cookie-preferences.js: missing ${text}`);
  }
  for (const text of ['cookie-notice', 'data-cookie-got-it', 'showNotice()', 'ensureNotice()', 'confirm the notice', 'Loaded on request', '打开时加载']) {
    if (cookiePrefs.includes(text)) failures.push(`sampora-cookie-preferences.js: contains old banner or confirmation wording ${text}`);
  }
  if (/analytics[^;\n]*(checkbox|toggle|enabled|true)|marketing[^;\n]*(checkbox|toggle|enabled|true)/i.test(cookiePrefs)) {
    failures.push('sampora-cookie-preferences.js: appears to expose analytics/marketing enable controls');
  }
}

const sourceFiles = [
  ...targetPages.map((page) => path.join(root, page)),
  ...listFiles(assets, (file) => /\.(js|css)$/i.test(file))
];

for (const file of sourceFiles) {
  if (!fs.existsSync(file)) continue;
  const rel = path.relative(root, file);
  const content = fs.readFileSync(file, 'utf8');
  if (analyticsOrMarketingPattern.test(content)) failures.push(`${rel}: contains analytics or marketing script marker`);
  if (hindiPattern.test(content)) failures.push(`${rel}: contains Hindi/hi marker`);
}

if (failures.length) {
  console.error('SALESMARTLY_AI_SUPPORT_CHECK_FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('SALESMARTLY_AI_SUPPORT_CHECK_OK');
