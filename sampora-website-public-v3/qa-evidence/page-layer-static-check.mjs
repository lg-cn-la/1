import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const owned = [
  'index.html',
  'solutions.html',
  'resources.html',
  'resource-manuals.html',
  'plans.html',
  'contact.html',
  'about.html',
];
const chineseLegacyRedirects = [
  '首页.html',
  '产品.html',
  '解决方案.html',
  '资源中心.html',
  '资源-跳转页面.html',
  '版本方案.html',
  '联系我们.html',
];
const allHtml = owned;
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

const expectedPhysicalHtml = [...owned].sort();
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
  const canonical = html.match(/<link\b(?=[^>]*\brel=["']canonical["'])(?=[^>]*\bhref=["']https:\/\/www\.sampora\.com\/[^"']+["'])[^>]*>/i)?.[0];
  if (!title) fail(`${file}: missing title`);
  if (!description) fail(`${file}: missing meta description`);
  if (!canonical) fail(`${file}: missing absolute canonical`);
  if (html.includes('</link>')) fail(`${file}: contains closing canonical/link tag`);
  if (forbidden.test(html)) fail(`${file}: forbidden text matched`);
}

for (const file of chineseLegacyRedirects) {
  if (fs.existsSync(path.join(root, file))) {
    fail(`${file}: Chinese legacy redirect HTML file must not be present in public root; use a server/CDN rewrite rule`);
  }
}

for (const file of owned) {
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
