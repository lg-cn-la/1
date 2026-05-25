import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const mainPages = [
  'index.html',
  'solutions.html',
  'resources.html',
  'plans.html',
  'contact.html',
  'resource-manuals.html',
  'about.html',
];
const expectedHrefs = [
  'index.html',
  'solutions.html',
  'resources.html',
  'plans.html',
  'about.html',
  'contact.html',
];
const expectedEnLabels = ['Product', 'Solutions', 'Resources', 'Plans', 'About', 'Contact'];
const activeByPage = {
  'index.html': 'Product',
  'solutions.html': 'Solutions',
  'resources.html': 'Resources',
  'plans.html': 'Plans',
  'contact.html': 'Contact',
  'resource-manuals.html': 'Resources',
  'about.html': 'About',
};
const expectedMobileLabels = {
  en: ['Product', 'Solutions', 'Resources', 'Plans', 'About', 'Contact'],
  zh: ['产品', '解决方案', '资源', '版本方案', '关于', '联系我们'],
};
const expectedBrandSub = {
  en: 'Operations console',
  zh: '操作控制台',
};
const expectedBrandSubValues = new Set(Object.values(expectedBrandSub));

let failures = 0;
let warnings = 0;

function fail(message) {
  failures += 1;
  console.log(`FAIL ${message}`);
}

function warn(message) {
  warnings += 1;
  console.log(`WARN ${message}`);
}

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function stripTags(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeHref(href) {
  return href.split('#')[0].split('?')[0];
}

function getHeader(file, html) {
  const header = html.match(/<header\b[\s\S]*?<\/header>/i)?.[0];
  if (!header) fail(`${file}: missing header`);
  return header || '';
}

function getDesktopNav(file, header) {
  const nav = header.match(/<nav\b(?=[^>]*\bclass=["'][^"']*\bnav\b[^"']*["'])[\s\S]*?<\/nav>/i)?.[0];
  if (!nav) fail(`${file}: missing desktop nav in header`);
  return nav || '';
}

function getAnchors(fragment) {
  return [...fragment.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map((match) => {
    const attrs = match[1];
    const href = attrs.match(/\bhref=["']([^"']+)["']/i)?.[1] || '';
    const className = attrs.match(/\bclass=["']([^"']+)["']/i)?.[1] || '';
    return {
      href,
      normalizedHref: normalizeHref(href),
      className,
      text: stripTags(match[2]),
      raw: match[0],
    };
  });
}

function evaluateExpression(file, source, label) {
  try {
    return vm.runInNewContext(`(${source})`, {}, { filename: `${file}:${label}` });
  } catch (error) {
    fail(`${file}: could not parse ${label}: ${error.message}`);
    return undefined;
  }
}

function extractFirstArrayAfter(source, startIndex) {
  const first = source.indexOf('[', startIndex);
  if (first === -1) return '';
  let depth = 0;
  let quote = '';
  let comment = '';
  for (let i = first; i < source.length; i += 1) {
    const ch = source[i];
    const next = source[i + 1];
    if (comment === 'line') {
      if (ch === '\n') comment = '';
      continue;
    }
    if (comment === 'block') {
      if (ch === '*' && next === '/') {
        comment = '';
        i += 1;
      }
      continue;
    }
    if (quote) {
      if (ch === '\\') i += 1;
      else if (ch === quote) quote = '';
      continue;
    }
    if (ch === '/' && next === '/') {
      comment = 'line';
      i += 1;
      continue;
    }
    if (ch === '/' && next === '*') {
      comment = 'block';
      i += 1;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
      continue;
    }
    if (ch === '[') depth += 1;
    if (ch === ']') {
      depth -= 1;
      if (depth === 0) return source.slice(first, i + 1);
    }
  }
  return '';
}

function extractFirstObjectAfter(source, startIndex) {
  const first = source.indexOf('{', startIndex);
  if (first === -1) return '';
  let depth = 0;
  let quote = '';
  for (let i = first; i < source.length; i += 1) {
    const ch = source[i];
    if (quote) {
      if (ch === '\\') i += 1;
      else if (ch === quote) quote = '';
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
      continue;
    }
    if (ch === '{') depth += 1;
    if (ch === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(first, i + 1);
    }
  }
  return '';
}

function extractMobileScript(html) {
  return [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => match[1])
    .find((script) => script.includes('mobile-nav-drawer') || script.includes('data-mobile-nav-label')) || '';
}

function extractRoutes(file, script) {
  const routesIndex = script.search(/\b(?:const|var)\s+routes\s*=/);
  if (routesIndex === -1) return null;
  const source = extractFirstArrayAfter(script, routesIndex);
  return source ? evaluateExpression(file, source, 'mobile routes') : null;
}

function extractLabelObject(file, script) {
  const navLabelsIndex = script.search(/\b(?:const|var)\s+navLabels\s*=/);
  const labelsIndex = script.search(/\b(?:const|var)\s+labels\s*=/);
  const index = navLabelsIndex !== -1 ? navLabelsIndex : labelsIndex;
  if (index === -1) return null;
  const source = extractFirstObjectAfter(script, index);
  return source ? evaluateExpression(file, source, navLabelsIndex !== -1 ? 'mobile navLabels' : 'mobile labels') : null;
}

function extractTranslationValues(html, key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(?:["']${escaped}["']|\\b${escaped}\\b)\\s*:\\s*["'\`]([^"'\`]*)["'\`]`, 'g');
  return [...html.matchAll(re)].map((match) => match[1]);
}

function extractMobileLabelsFromTranslations(file, html) {
  const keySets = [
    ['navProduct'],
    ['navSolutions'],
    ['navResources'],
    ['navPricing', 'navPlans'],
    ['navAboutShort', 'navAbout'],
    ['navContact'],
  ];
  const langs = ['en', 'zh'];
  const labels = { en: [], zh: [] };
  for (const keys of keySets) {
    let values = [];
    for (const key of keys) {
      values = extractTranslationValues(html, key);
      if (values.length >= 2) break;
    }
    if (values.length < 2) {
      return null;
    }
    langs.forEach((lang, index) => labels[lang].push(values[index]));
  }
  return labels;
}

function extractAssignedObject(file, html, identifier, label) {
  const index = html.search(new RegExp(`\\b(?:const|var|let)\\s+${identifier}\\s*=`));
  if (index === -1) return null;
  const source = extractFirstObjectAfter(html, index);
  return source ? evaluateExpression(file, source, label) : null;
}

function collectBrandSubtitleValues(file, html, header) {
  const values = new Set();
  const brand = header.match(/<a\b(?=[^>]*\bclass=["'][^"']*\bbrand\b[^"']*["'])[^>]*>[\s\S]*?<\/a>/i)?.[0] || '';
  const headerSmall = brand.match(/<small\b[^>]*>([\s\S]*?)<\/small>/i)?.[1];
  if (headerSmall) values.add(stripTags(headerSmall));

  for (const match of html.matchAll(/(?:["']brandSub["']|(?<![\w$])brandSub)\s*:\s*["'`]([^"'`]*)["'`]/g)) {
    if (match[1]) values.add(match[1]);
  }

  for (const name of ['brandSubLabels', 'brandSub']) {
    const object = extractAssignedObject(file, html, name, name);
    if (object && typeof object === 'object' && !Array.isArray(object)) {
      for (const lang of ['en', 'zh']) {
        if (typeof object[lang] === 'string' && object[lang]) values.add(object[lang]);
      }
    }
  }

  return [...values].filter(Boolean);
}

function checkBrandSubtitles(file, html, header) {
  const values = collectBrandSubtitleValues(file, html, header);
  for (const [lang, expected] of Object.entries(expectedBrandSub)) {
    if (!values.includes(expected)) {
      fail(`${file}: brand subtitle missing ${lang} source value ${JSON.stringify(expected)}; found ${JSON.stringify(values)}`);
    }
  }
  for (const value of values) {
    if (!expectedBrandSubValues.has(value)) {
      fail(`${file}: brand subtitle source value must match About canonical EN/ZH values, found ${JSON.stringify(value)}`);
    }
  }
}

function extractStaticMobileNav(header, html) {
  return html.match(/<nav\b(?=[^>]*\bclass=["'][^"']*mobile-nav-drawer\b[^"']*["'])[\s\S]*?<\/nav>/i)?.[0]
    || header.match(/<nav\b(?=[^>]*\bclass=["'][^"']*mobile-nav-drawer\b[^"']*["'])[\s\S]*?<\/nav>/i)?.[0]
    || '';
}

function checkArrayExact(file, label, actual, expected) {
  if (actual.length !== expected.length || actual.some((item, index) => item !== expected[index])) {
    fail(`${file}: ${label} expected ${JSON.stringify(expected)} but found ${JSON.stringify(actual)}`);
  }
}

function checkMobileLabels(file, labels) {
  if (!labels) {
    fail(`${file}: missing EN/ZH mobile label source coverage`);
    return;
  }
  for (const lang of ['en', 'zh']) {
    if (!Array.isArray(labels[lang])) {
      fail(`${file}: mobile labels missing ${lang}`);
      continue;
    }
    checkArrayExact(file, `mobile ${lang} labels`, labels[lang], expectedMobileLabels[lang]);
  }
}

function checkMobileRoutes(file, routes) {
  if (!routes) return;
  const hrefs = routes.map((route) => Array.isArray(route) ? route[0] : '');
  checkArrayExact(file, 'mobile route href order', hrefs, expectedHrefs);
}

for (const file of mainPages) {
  const html = read(file);
  const header = getHeader(file, html);
  const brand = header.match(/<a\b(?=[^>]*\bclass=["'][^"']*\bbrand\b[^"']*["'])[^>]*>[\s\S]*?<\/a>/i)?.[0] || '';
  const brandHref = brand.match(/\bhref=["']([^"']+)["']/i)?.[1] || '';
  if (!brand) fail(`${file}: missing brand link`);
  if (brandHref !== 'index.html') fail(`${file}: brand href must be index.html, found ${brandHref || '(missing)'}`);
  if (!/>Sampora</.test(brand) && !/\bSampora\b/.test(stripTags(brand))) fail(`${file}: brand visible name must be Sampora`);
  if (!/Operations console/i.test(brand) && !/data-i18n=["']brandSub["']/.test(brand)) {
    fail(`${file}: brand subtitle must use Operations console visible text or brandSub translation key`);
  }
  checkBrandSubtitles(file, html, header);

  const nav = getDesktopNav(file, header);
  const navAnchors = getAnchors(nav).filter((anchor) => expectedHrefs.includes(anchor.normalizedHref));
  checkArrayExact(file, 'desktop nav href order', navAnchors.map((anchor) => anchor.normalizedHref), expectedHrefs);
  checkArrayExact(file, 'desktop nav initial EN labels', navAnchors.map((anchor) => anchor.text), expectedEnLabels);
  const active = navAnchors.filter((anchor) => /\bactive\b/.test(anchor.className));
  if (active.length !== 1) {
    fail(`${file}: desktop nav must have exactly one active item, found ${active.length}`);
  } else if (active[0].text !== activeByPage[file]) {
    fail(`${file}: active desktop nav must be ${activeByPage[file]}, found ${active[0].text}`);
  }

  const staticMobileNav = extractStaticMobileNav(header, html);
  const staticMobileAnchors = staticMobileNav ? getAnchors(staticMobileNav) : [];
  if (staticMobileAnchors.length) {
    checkArrayExact(file, 'static mobile nav href order', staticMobileAnchors.map((anchor) => anchor.normalizedHref), expectedHrefs);
    checkArrayExact(file, 'static mobile nav initial EN labels', staticMobileAnchors.map((anchor) => anchor.text), expectedEnLabels);
  }

  const mobileScript = extractMobileScript(html);
  const routes = extractRoutes(file, mobileScript);
  const labels = extractLabelObject(file, mobileScript) || extractMobileLabelsFromTranslations(file, html);
  if (!staticMobileAnchors.length && !routes) fail(`${file}: missing mobile nav static routes or generated routes`);
  if (routes) checkMobileRoutes(file, routes);
  checkMobileLabels(file, labels);

  for (const anchor of getAnchors(header).filter((item) => /\bbtn\b/.test(item.className) && item.normalizedHref === 'contact.html')) {
    if (!/\bintent=/.test(anchor.href)) {
      warn(`${file}: header CTA href lacks intent and remains blocked for CTA strategy: ${anchor.href}`);
    }
  }
}

if (!failures) {
  console.log(`PASS header consistency check across ${mainPages.length} main pages`);
}
if (warnings) {
  console.log(`WARN header consistency check recorded ${warnings} CTA blocker warning(s)`);
}
process.exitCode = failures ? 1 : 0;
