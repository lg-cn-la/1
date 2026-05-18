import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workspaceRoot = path.resolve(root, '..');
const officialPages = ['index.html', 'solutions.html', 'resources.html', 'resource-manuals.html', 'plans.html', 'contact.html'];
let failures = 0;
const publicRedirectPages = ['products.html', 'pricing.html'];
const chineseLegacyRedirectPages = ['首页.html', '产品.html', '解决方案.html', '资源中心.html', '资源-跳转页面.html', '版本方案.html', '联系我们.html'];

const fail = (message) => {
  failures += 1;
  console.log(`FAIL ${message}`);
};
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const redirectPolicyDocs = [
  ['README.md', path.join(root, 'README.md')],
  ['DEPLOYMENT_NOTES.md', path.join(root, 'DEPLOYMENT_NOTES.md')],
  ['redirect-map.md', path.join(workspaceRoot, 'redirect-map.md')],
  ['ACCEPTANCE_TESTS.md', path.join(workspaceRoot, 'ACCEPTANCE_TESTS.md')],
];

const oldRedirectPolicyPatterns = [
  /Chinese legacy redirect HTML files are included/i,
  /public package includes root redirect HTML files for English and Chinese legacy paths/i,
  /physical Chinese legacy redirect HTML files are included/i,
  /Chinese legacy redirect HTML files are included in this package/i,
  /root redirect HTML \+ server\/CDN rewrite fallback/i,
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

for (const file of [...officialPages, ...publicRedirectPages]) {
  const html = read(file);
  if (!/<title>[\s\S]+?<\/title>/i.test(html)) fail(`${file}: missing title`);
  if (!/<meta\b(?=[^>]*\bname=["']description["'])(?=[^>]*\bcontent=["'][^"']+["'])[^>]*>/i.test(html)) fail(`${file}: missing meta description`);
  if (!/<link\b(?=[^>]*\brel=["']canonical["'])(?=[^>]*\bhref=["']https:\/\/www\.sampora\.com\/[^"']+["'])[^>]*>/i.test(html)) fail(`${file}: missing absolute canonical`);
  [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].forEach((match, index) => checkStyleBlock(file, match[1], index + 1));
}

for (const file of chineseLegacyRedirectPages) {
  if (fs.existsSync(path.join(root, file))) {
    fail(`${file}: Chinese legacy redirect HTML file must not be present in public root; use a server/CDN rewrite rule`);
  }
}

for (const [label, absolute] of redirectPolicyDocs) {
  const content = fs.readFileSync(absolute, 'utf8');
  for (const pattern of oldRedirectPolicyPatterns) {
    if (pattern.test(content)) fail(`${label}: stale physical Chinese redirect policy ${pattern}`);
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

for (const file of officialPages) {
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
  if (!/<form\b[^>]*id=["']contactForm["'][^>]*method=["']post["'][^>]*data-endpoint=["']\[BACKEND_CONTACT_ENDPOINT\]["']/i.test(contact)) fail('contact.html: backend-ready form method/data-endpoint missing');
  for (const name of ['intent', 'source_page', 'source_section', 'plan', 'lang']) {
    if (!new RegExp(`<input\\b(?=[^>]*type=["']hidden["'])(?=[^>]*name=["']${name}["'])`, 'i').test(contact)) fail(`contact.html: hidden field missing ${name}`);
  }
  if (!/fetch\(/.test(contact)) fail('contact.html: fetch integration path missing');
  if (!/pending placeholder|endpoint is wired|real endpoint/i.test(contact)) fail('contact.html: placeholder submission is not clearly marked');
}

if (!failures) console.log('PASS final audit static checks');
process.exitCode = failures ? 1 : 0;
