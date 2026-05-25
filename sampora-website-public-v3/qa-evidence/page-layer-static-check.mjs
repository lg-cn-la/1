import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const officialPages = [
  'index.html',
  'solutions.html',
  'resources.html',
  'resource-manuals.html',
  'plans.html',
  'contact.html',
  'about.html',
];
const supportPages = [
  '404.html',
  'cookie-policy.html',
  'privacy.html',
  'terms.html',
];
const chineseLegacyRedirects = [
  '\u9996\u9875.html',
  '\u4ea7\u54c1.html',
  '\u89e3\u51b3\u65b9\u6848.html',
  '\u8d44\u6e90\u4e2d\u5fc3.html',
  '\u8d44\u6e90-\u8df3\u8f6c\u9875\u9762.html',
  '\u7248\u672c\u65b9\u6848.html',
  '\u8054\u7cfb\u6211\u4eec.html',
];
const allHtml = [...officialPages, ...supportPages];
const forbiddenParts = [
  '\\?' + '\\?' + '\\?+',
  'expanded ' + 'topology',
  'Expand ' + 'Topology',
  'Start trial ' + '\\?',
  'AI ' + 'Value',
  'Acceptance ' + 'Index',
  'linear' + 'gradient',
  'Supplier Network ' + 'Operations',
  'Enterprise / Full ' + 'Operations',
].map(part => part.replaceAll('/', '\\/'));
const forbidden = new RegExp(forbiddenParts.join('|'));
let failures = 0;

function fail(message) {
  failures += 1;
  console.log(`FAIL ${message}`);
}

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

const expectedPhysicalHtml = [...allHtml].sort();
const actualPhysicalHtml = fs
  .readdirSync(root)
  .filter(file => file.endsWith('.html'))
  .sort();
if (JSON.stringify(actualPhysicalHtml) !== JSON.stringify(expectedPhysicalHtml)) {
  fail(`public root HTML files must be exactly ${JSON.stringify(expectedPhysicalHtml)}, found ${JSON.stringify(actualPhysicalHtml)}`);
}

for (const file of allHtml) {
  const html = read(file);
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  const description = html.match(/<meta\b(?=[^>]*\bname=["']description["'])(?=[^>]*\bcontent=["'][^"']+["'])[^>]*>/i)?.[0];
  const canonical = html.match(/<link\b(?=[^>]*\brel=["']canonical["'])(?=[^>]*\bhref=["']https:\/\/getsampora\.com\/[^"']+["'])[^>]*>/i)?.[0];
  if (!title) fail(`${file}: missing title`);
  if (!description) fail(`${file}: missing meta description`);
  if (!canonical) fail(`${file}: missing getsampora absolute canonical`);
  if (html.includes('</link>')) fail(`${file}: contains closing canonical/link tag`);
  if (forbidden.test(html)) fail(`${file}: forbidden text matched`);
}

for (const file of chineseLegacyRedirects) {
  if (fs.existsSync(path.join(root, file))) {
    fail(`${file}: Chinese legacy redirect HTML file must not be present in public root; use a server/CDN rewrite rule`);
  }
}

for (const file of allHtml) {
  const html = read(file);
  const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi)];
  scripts.forEach((match, index) => {
    const type = match[1].match(/\btype=["']?([^"'\s>]+)/i)?.[1]?.toLowerCase() || 'text/javascript';
    if (!['text/javascript', 'application/javascript'].includes(type)) return;
    try {
      new vm.Script(match[2], { filename: `${file}#inline-${index + 1}` });
    } catch (error) {
      fail(`${file}: inline script ${index + 1} does not parse: ${error.message}`);
    }
  });

  const localRefs = [...html.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)]
    .map(match => match[1])
    .filter(ref => !/^(?:https?:|mailto:|tel:|#|data:|javascript:)/i.test(ref))
    .filter(ref => !ref.includes('${'));

  for (const ref of localRefs) {
    const target = ref.split('#')[0].split('?')[0];
    if (!target || target.startsWith('#')) continue;
    const decoded = decodeURIComponent(target);
    const absolute = path.resolve(root, decoded);
    if (!absolute.startsWith(root) || !fs.existsSync(absolute)) {
      fail(`${file}: missing local reference ${ref}`);
    }
  }
}

if (!failures) {
  console.log(`PASS static checks for ${allHtml.length} physical HTML files and ${chineseLegacyRedirects.length} absent Chinese legacy redirects`);
}
process.exitCode = failures ? 1 : 0;
