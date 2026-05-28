import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workspaceRoot = path.resolve(root, '..');
const officialPages = ['index.html', 'solutions.html', 'resources.html', 'resource-manuals.html', 'plans.html', 'contact.html', 'about.html'];
const supportPages = ['404.html', 'cookie-policy.html', 'privacy.html', 'terms.html'];
const publicHtmlPages = [...officialPages, ...supportPages];
const productionOrigin = 'https://getsampora.com';
const staleFormalOrigin = 'https://www.' + 'sampora.com';
const contactEndpointPath = '/api/contact';
let failures = 0;
const chineseLegacyRedirectPages = ['首页.html', '产品.html', '解决方案.html', '资源中心.html', '资源-跳转页面.html', '版本方案.html', '联系我们.html'];

const fail = (message) => {
  failures += 1;
  console.log(`FAIL ${message}`);
};
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

function runNestedCheck(label, scriptRel) {
  const result = spawnSync(process.execPath, [path.join(root, scriptRel)], { encoding: 'utf8' });
  if (result.status !== 0) {
    fail(`${label}: ${(result.stdout + result.stderr).trim()}`);
  }
}

runNestedCheck('language layer structure guard', 'qa-evidence/language-layer-structure-check.mjs');

const redirectPolicyDocs = [
  ['README.md', path.join(root, 'README.md')],
  ['DEPLOYMENT_NOTES.md', path.join(root, 'DEPLOYMENT_NOTES.md')],
  ['redirect-map.md', path.join(workspaceRoot, 'redirect-map.md')],
  ['ACCEPTANCE_TESTS.md', path.join(workspaceRoot, 'ACCEPTANCE_TESTS.md')],
];

const oldRedirectPolicyPatterns = [
  /products\.html \/ pricing\.html remain present/i,
  /English redirects products\.html and pricing\.html remain present/i,
  /public source ships canonical English pages plus English redirect files products\.html and pricing\.html/i,
  /Physical redirect files shipped in the public root/i,
  /public package includes English root redirect HTML files/i,
  /root redirect HTML/i,
  /Chinese legacy redirect HTML files are included/i,
  /public package includes root redirect HTML files for English and Chinese legacy paths/i,
  /physical Chinese legacy redirect HTML files are included/i,
  /Chinese legacy redirect HTML files are included in this package/i,
  /root redirect HTML \+ server\/CDN rewrite fallback/i,
];

const legalPageExpectations = {
  'privacy.html': {
    eyebrow: 'Sampora / Privacy Policy',
    statusLiveEn: 'Privacy Policy',
    statusMidEn: 'Current Version',
    statusRightEn: 'Public website and contact form data notice',
    statusLiveZh: '隐私政策',
    statusMidZh: '当前版本',
    statusRightZh: '公开官网与联系表单数据说明',
    currentHref: 'privacy.html',
  },
  'cookie-policy.html': {
    eyebrow: 'Sampora / Cookie Policy',
    statusLiveEn: 'Cookie Policy',
    statusMidEn: 'Functional Storage',
    statusRightEn: 'Necessary and AI support storage notice',
    statusLiveZh: 'Cookie 政策',
    statusMidZh: '功能性存储',
    statusRightZh: '必要与 AI 客服存储说明',
    currentHref: 'cookie-policy.html',
  },
  'terms.html': {
    eyebrow: 'Sampora / Terms of Use',
    statusLiveEn: 'Terms of Use',
    statusMidEn: 'Current Version',
    statusRightEn: 'Website access and sales-led onboarding terms',
    statusLiveZh: '使用条款',
    statusMidZh: '当前版本',
    statusRightZh: '官网访问与销售承接规则',
    currentHref: 'terms.html',
  },
};

const correctedFooterAddress = {
  en: /Room\s+1506,\s*Block\s+A,\s*Hengsheng\s+Sunshine\s+City,\s*Lu['’]?an,\s*Anhui,\s*China/i,
  zh: /中国安徽省六安市恒生阳光城\s*A\s*座\s*1506\s*室?/,
};

const oldFooterAddressPatterns = [
  /Hengyang\s+Guangcheng/i,
  /Hengyangguangcheng/i,
  /恒阳广场/,
  /恒阳光城/,
  /中国安徽省六安市恒阳广场\s*A\s*座\s*1506\s*室/,
];

const forbidden404SupportCopy = [
  'Delivery workflow / Live',
  'Minimal production handoff',
  '交付工作流 / 在线',
  '最小生产交付包',
];

function checkStyleBlock(file, css, index) {
  let depth = 0;
  let quote = '';
  let comment = false;
  for (let i = 0; i < css.length; i += 1) {
    const ch = css[i];
    const next = css[i + 1];
    if (comment) {
      if (ch === '*' && next === '/') {
        comment = false;
        i += 1;
      }
      continue;
    }
    if (quote) {
      if (ch === '\\') i += 1;
      else if (ch === quote) quote = '';
      continue;
    }
    if (ch === '/' && next === '*') {
      comment = true;
      i += 1;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === '{') {
      depth += 1;
    } else if (ch === '}') {
      depth -= 1;
      if (depth < 0) return fail(`${file}: style block ${index} has an extra closing brace`);
    }
  }
  if (quote) fail(`${file}: style block ${index} has an unterminated string`);
  if (comment) fail(`${file}: style block ${index} has an unterminated comment`);
  if (depth !== 0) fail(`${file}: style block ${index} has unbalanced braces (${depth})`);
}

const expectedPhysicalHtml = [...officialPages, ...supportPages].sort();
const actualPhysicalHtml = fs
  .readdirSync(root)
  .filter(file => file.endsWith('.html'))
  .sort();
if (JSON.stringify(actualPhysicalHtml) !== JSON.stringify(expectedPhysicalHtml)) {
  fail(`public root HTML files must be exactly ${JSON.stringify(expectedPhysicalHtml)}, found ${JSON.stringify(actualPhysicalHtml)}`);
}

for (const file of officialPages) {
  const html = read(file);
  if (!/<title>[\s\S]+?<\/title>/i.test(html)) fail(`${file}: missing title`);
  if (!/<meta\b(?=[^>]*\bname=["']description["'])(?=[^>]*\bcontent=["'][^"']+["'])[^>]*>/i.test(html)) fail(`${file}: missing meta description`);
  if (!/<link\b(?=[^>]*\brel=["']canonical["'])(?=[^>]*\bhref=["']https:\/\/getsampora\.com\/[^"']+["'])[^>]*>/i.test(html)) fail(`${file}: missing getsampora absolute canonical`);
  [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].forEach((match, index) => checkStyleBlock(file, match[1], index + 1));
}

for (const file of publicHtmlPages) {
  const html = read(file);
  if (html.includes('`r`n')) fail(`${file}: literal \`r\`n marker must be real newlines`);
  if (html.toLowerCase().includes(staleFormalOrigin)) fail(`${file}: stale formal-domain URL remains`);
  if (/script\.google\.com\/macros|\/macros\/s\//i.test(html)) fail(`${file}: public HTML must not directly reference Google Apps Script`);
}

for (const file of publicHtmlPages) {
  const html = read(file);
  const hasFooterAddress = /sampora-footer-contact-item[\s\S]{0,260}(?:LOC|addressText)|(?:addressText|footerAddress)\s*:|data-(?:footer-)?i18n=["'](?:addressText|footerAddress)["']/i.test(html);
  if (!hasFooterAddress) continue;
  for (const pattern of oldFooterAddressPatterns) {
    if (pattern.test(html)) fail(`${file}: old footer address variant remains (${pattern})`);
  }
  if (!correctedFooterAddress.en.test(html)) fail(`${file}: footer address surface missing corrected English address`);
  if (!correctedFooterAddress.zh.test(html)) fail(`${file}: footer address surface missing corrected Chinese address`);
}

for (const file of chineseLegacyRedirectPages) {
  if (fs.existsSync(path.join(root, file))) {
    fail(`${file}: Chinese legacy redirect HTML file must not be present in public root; use a server/CDN rewrite rule`);
  }
}

for (const [label, absolute] of redirectPolicyDocs) {
  if (!fs.existsSync(absolute)) {
    console.log(`SKIP ${label}: not present in this standalone package`);
    continue;
  }
  const content = fs.readFileSync(absolute, 'utf8');
  for (const pattern of oldRedirectPolicyPatterns) {
    if (pattern.test(content)) fail(`${label}: stale physical Chinese redirect policy ${pattern}`);
  }
}

for (const [file, expected] of Object.entries(legalPageExpectations)) {
  const html = read(file);
  if (!html.includes(`class="eyebrow" data-i18n="legalEyebrow">${expected.eyebrow}</div>`)) {
    fail(`${file}: page-specific legal eyebrow missing`);
  }
  for (const [key, value] of [
    ['statusLive', expected.statusLiveEn],
    ['statusMid', expected.statusMidEn],
    ['statusRight', expected.statusRightEn],
  ]) {
    if (!html.includes(`${key}:'${value}'`)) fail(`${file}: English ${key} is not public legal copy`);
  }
  for (const [key, value] of [
    ['statusLive', expected.statusLiveZh],
    ['statusMid', expected.statusMidZh],
    ['statusRight', expected.statusRightZh],
  ]) {
    if (!html.includes(`${key}:'${value}'`)) fail(`${file}: Chinese ${key} is not public legal copy`);
  }
  if (/Sampora \/ Legal readiness|Privacy, cookie and contact readiness|隐私、Cookie 与联系表单就绪|Delivery workflow \/ Live|Minimal production handoff|交付工作流 \/ 在线|最小生产交付包/.test(html)) {
    fail(`${file}: stale generic legal page identifier remains`);
  }
  if (!/function\s+initTopChrome\(\)[\s\S]*body\.classList\.toggle\('nav-condensed',compact\)/.test(html)) {
    fail(`${file}: legal status bar does not use nav-condensed scroll collapse`);
  }
  const currentLinkPattern = new RegExp(`<a\\b(?=[^>]*href=["']${expected.currentHref}["'])(?=[^>]*aria-current=["']page["'])`, 'i');
  if (!currentLinkPattern.test(html)) fail(`${file}: current footer legal link is not marked aria-current="page"`);
  const currentCount = (html.match(/aria-current=["']page["']/g) || []).length;
  if (currentCount !== 1) fail(`${file}: expected one aria-current page marker, found ${currentCount}`);
}

{
  const notFound = read('404.html');
  for (const text of forbidden404SupportCopy) {
    if (notFound.includes(text)) fail(`404.html: stale public support wording remains: ${text}`);
  }
  const hero = notFound.match(/<section\b[^>]*class=["'][^"']*legal-hero[^"']*["'][\s\S]*?<\/section>/i)?.[0] || notFound;
  if (/<a\b(?=[^>]*href=["']contact\.html["'])[\s\S]*?(?:Contact sales|联系销售)/i.test(hero)) {
    fail('404.html: hero sales CTA must use contact.html?intent=contact_sales#contact-form, not bare contact.html');
  }
}

for (const file of officialPages) {
  const html = read(file);
  [...html.matchAll(/\bhref=["'](contact\.html\?intent=[^"']+)["']/gi)].forEach((match) => {
    const href = match[1];
    if (!/^contact\.html\?intent=(start_trial|book_demo|contact_sales|enterprise_demo|resource_question)#contact-form$/.test(href)) {
      fail(`${file}: invalid contact intent href ${href}`);
    }
  });
  if (!html.includes('© 2026 Anhui Jiayu Enterprise Service Co., Ltd.')) fail(`${file}: missing 2026 English legal footer`);
  if (!html.includes('安徽省嘉禹企业服务有限公司')) fail(`${file}: missing Chinese legal company name`);
}

for (const file of expectedPhysicalHtml) {
  const html = read(file);
  [...html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi)].forEach((match, index) => {
    const type = match[1].match(/\btype=["']?([^"'\s>]+)/i)?.[1]?.toLowerCase() || 'text/javascript';
    if (!['text/javascript', 'application/javascript'].includes(type)) return;
    try {
      new vm.Script(match[2], { filename: `${file}#inline-${index + 1}` });
    } catch (error) {
      fail(`${file}: inline script ${index + 1} does not parse: ${error.message}`);
    }
  });
}

const forbiddenPatterns = [
  /\?\?\?\?/,
  /鍢夎偛/,
  /鐨朓CP澶/,
  /ICP No/i,
  /Wan ICP No/i,
  /\[CONFIRM_ICP_NUMBER\]/,
  /\bICP\b/,
  /2024-2025/,
  /© 2024/,
  /© 2025/,
  /All rights reserved/i,
  /Contact sales by request/i,
  /contact_sale#/,
  /start_tria#contact-forml/,
  /book_dem#contact-formo/,
  /global SaaS survey distribution platform/i,
  /traffic value conversion/i,
  /survey distribution platform/i,
  /Access center/i,
  /鏉冪泭涓績/,
  /Join us/i,
  /Visit community/i,
  /Career journey/i,
  /\bBenefits\b/,
  /expanded topology/i,
  /India-ready/i,
  /Every guide maps back to a confirmed backend entry/i,
  /Open the related module\./i,
  /Review list and core data\./i,
  /Search, filter, or edit if needed\./i,
  /Save, export, or confirm the result\./i,
];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(p);
    return [p];
  });
}

for (const absolute of walk(root)) {
  const rel = path.relative(root, absolute).replaceAll('\\', '/');
  if (rel === 'qa-evidence/final-audit-static-check.mjs') continue;
  if (!/\.(html|md|js|mjs)$/i.test(rel)) continue;
  const content = fs.readFileSync(absolute, 'utf8');
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(content)) fail(`${rel}: forbidden pattern ${pattern}`);
  }
}

{
  const index = read('index.html');
  if (/initInstantWorkflowRelay[\s\S]*?applyState\(steps\[0\][\s\S]*?applyState\(steps\[1\][\s\S]*?return;\s*function clearTimer/.test(index)) {
    fail('index.html: workflow has early return before runStep');
  }
  if (!/requestAnimationFrame\(\(\) => requestAnimationFrame\(runStep\)\)/.test(index)) fail('index.html: workflow loop warmup start missing');
  if (!/\.hero-copy::after\s*{[\s\S]*?display:\s*none\s*!important/.test(index)) fail('index.html: hero-copy::after is not disabled');
  if (!/\.topo-svg\s+\.packet\.on,\s*[\s\S]*?\.topo-svg\s+\.packet-group\.on\s+\.packet\s*{[\s\S]*?opacity:\s*\.75/.test(index)) fail('index.html: active topology packet visibility missing');
}

for (const file of ['solutions.html', 'resources.html']) {
  const html = read(file);
  if (!/@keyframes\s+topoDash/.test(html)) fail(`${file}: missing topoDash keyframes`);
  if (!/\.topo-svg\s+\.flow\.on\s*{[\s\S]*?animation:\s*topoDash/.test(html)) fail(`${file}: active topology flow is not bound to topoDash`);
  if (!/\.topo-svg\s+\.flow-group\.on\s+\.flow\s*{[\s\S]*?animation:\s*topoDash/.test(html)) fail(`${file}: active topology flow group is not bound to topoDash`);
  if (!/\.topo-scan\s*{[\s\S]*?animation:\s*topoScan/.test(html)) fail(`${file}: topo scan is not bound to topoScan`);
  if (!/\.topo-svg\s+\.packet\.on\s*{[\s\S]*?opacity:\s*\.(?:7|72|75|85|9|95|96)/.test(html)
    && !/\.topo-svg\s+\.packet-group\.on\s+\.packet\s*{[\s\S]*?opacity:\s*\.(?:7|72|75|85|9|95|96)/.test(html)) {
    fail(`${file}: active topology packet visibility missing`);
  }
}

{
  const plans = read('plans.html');
  if (!/\.matrix-wrap\s*{[^}]*width:\s*min\(100%,1320px\)[^}]*max-width:\s*1320px/.test(plans.replace(/\s+/g, ''))) fail('plans.html: matrix wrap is not 1320px');
  if (!/th,td\s*{[^}]*padding:\s*1[46]px\s+18px[^}]*font-size:\s*1[45](?:\.5)?px/.test(plans)) fail('plans.html: matrix cell padding/font-size too small');
}

{
  const contact = read('contact.html');
  const contactFormTag = contact.match(/<form\b[^>]*id=["']contactForm["'][^>]*>/i)?.[0] || '';
  if (!contactFormTag) fail('contact.html: backend-ready contactForm tag missing');
  const contactFormMethod = (contactFormTag.match(/\bmethod=["']([^"']+)["']/i)?.[1] || '').toLowerCase();
  if (contactFormMethod !== 'post') fail('contact.html: backend-ready form method must be post');
  const formAction = contactFormTag.match(/\baction=["']([^"']+)["']/i)?.[1] || '';
  const formDataEndpoint = contactFormTag.match(/\bdata-endpoint=["']([^"']+)["']/i)?.[1] || '';
  const contactEndpoint = contact.match(/const\s+CONTACT_ENDPOINT\s*=\s*['"]([^'"]+)['"]/)?.[1] || '';
  if (!formAction || !formDataEndpoint || !contactEndpoint) fail('contact.html: missing action/data-endpoint/CONTACT_ENDPOINT');
  if (!(formAction === formDataEndpoint && formAction === contactEndpoint)) {
    fail(`contact.html: action, data-endpoint, and CONTACT_ENDPOINT must match (${JSON.stringify({ formAction, formDataEndpoint, contactEndpoint })})`);
  }
  if (formAction !== contactEndpointPath) {
    fail(`contact.html: CONTACT_ENDPOINT must be ${contactEndpointPath}, got ${JSON.stringify(formAction)}`);
  }
  for (const name of ['intent', 'source_page', 'source_section', 'plan', 'lang', 'landing_page', 'referrer', 'utm_source', 'utm_medium', 'utm_campaign']) {
    if (!new RegExp(`<input\\b(?=[^>]*type=["']hidden["'])(?=[^>]*name=["']${name}["'])`, 'i').test(contact)) fail(`contact.html: hidden field missing ${name}`);
  }
  if (!/<[^>]+\bid=["']contactSubmitFeedback["'][^>]+\brole=["']status["'][^>]+\baria-live=["']polite["'][^>]+\bhidden\b/i.test(contact)) fail('contact.html: inline submit feedback status region missing');
  for (const key of ['submitPending', 'submitSuccess', 'submitFailure']) {
    if (!new RegExp(`${key}\\s*:`, 'i').test(contact)) fail(`contact.html: submit feedback copy key missing ${key}`);
  }
  if (/X-Requested-With/i.test(contact)) fail('contact.html: X-Requested-With header must be removed');
  if (!/fetch\(/.test(contact)) fail('contact.html: fetch integration path missing');
  if (!/backend-ok only|success-only|\/api\/contact/i.test(contact)) fail('contact.html: /api/contact success-only submission contract is not clearly marked');
  if (/thank-you\.html/i.test(contact)) fail('contact.html: contact form must not route to thank-you.html');
  if (/(?:window\.)?location\.(?:href|assign|replace)\s*[=(]/.test(contact)) fail('contact.html: contact form must not redirect after submit');
  if (!/setSubmitFeedback\('submitting'\)[\s\S]*fetch\(/.test(contact)) fail('contact.html: live branch does not show submitting feedback before fetch');
  const pendingSetItem = contact.match(/sessionStorage\.setItem\(\s*['"]sampora_contact_pending['"]\s*,\s*([^\n;]+?)\s*\)/);
  if (!pendingSetItem) fail('contact.html: pending sessionStorage marker is missing');
  else if (/(?:body|payload|FormData|URLSearchParams|name|email|company|message)\b/i.test(pendingSetItem[1])) {
    fail('contact.html: pending sessionStorage marker must not store form fields or user values');
  }
  if (!/const\s+responsePayload\s*=\s*result\.data\s*\?\?\s*result\s*;/.test(contact)) fail('contact.html: success state must normalize data-wrapped backend payloads');
  if (!/if\s*\(\s*res\.ok\s*&&\s*responsePayload\.ok\s*===\s*true\s*\)\s*{[\s\S]*setSubmitFeedback\('success'\)[\s\S]*sessionStorage\.removeItem\('sampora_contact_pending'\)[\s\S]*form\.reset\(\)/.test(contact)) fail('contact.html: success state must be backend-ok only and clear pending/input only there');
  if (!/setSubmitFeedback\('failure'\)/.test(contact)) fail('contact.html: failure feedback path missing');
}

if (!failures) console.log('PASS final audit static checks');
process.exitCode = failures ? 1 : 0;
