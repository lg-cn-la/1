import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), 'sampora-website-public-v3');
const pages = [
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
const failures = [];
const email = 'contact@getsampora.com';

function read(rel) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    failures.push(`${rel}: missing file`);
    return '';
  }
  return fs.readFileSync(file, 'utf8');
}

function normalizeSelector(selector) {
  return selector.trim().replace(/\s+/g, ' ');
}

function ruleBodiesForSelector(css, selector) {
  const normalized = normalizeSelector(selector);
  const bodies = [];
  for (const match of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selectors = match[1].split(',').map(normalizeSelector);
    if (selectors.includes(normalized)) bodies.push(match[2]);
  }
  return bodies;
}

function mergedRuleBody(css, selector) {
  return ruleBodiesForSelector(css, selector).join('\n');
}

function hasForcedWhiteText(body) {
  return /\bcolor\s*:\s*(?:#(?:fff|ffffff)\b|white\b|rgb\(\s*255\s*,\s*255\s*,\s*255\s*\))/i.test(body);
}

for (const page of pages) {
  const html = read(page);
  if (!html) continue;
  if (!html.includes('assets/footer-email-modal.css')) failures.push(`${page}: missing footer email modal stylesheet`);
  if (!html.includes('assets/footer-email-modal.js')) failures.push(`${page}: missing footer email modal script`);
  const footerStart = html.indexOf('<footer');
  const footerEnd = html.indexOf('</footer>', footerStart);
  if (footerStart === -1 || footerEnd === -1) {
    failures.push(`${page}: missing footer block`);
    continue;
  }
  const footer = html.slice(footerStart, footerEnd);
  const productCol = footer.match(/<div class=["']sampora-footer-col["']>\s*<h3 data-(?:footer-)?i18n=["']footerProduct["']>Product<\/h3>[\s\S]*?<\/div>/)?.[0] || '';
  const getStartedCol = footer.match(/<div class=["']sampora-footer-col["']>\s*<h3 data-(?:footer-)?i18n=["']footerGetStarted["']>Get started<\/h3>[\s\S]*?<\/div>/)?.[0] || '';
  const triggerCount = (footer.match(/data-footer-email-open/g) || []).length;
  if (triggerCount < 1) failures.push(`${page}: expected footer email trigger in Get started column, found ${triggerCount}`);
  if (!productCol) {
    failures.push(`${page}: missing footer Product column`);
  } else {
    if (!/<a\b(?=[^>]*href=["']about\.html["'])(?=[^>]*data-(?:footer-)?i18n=["']footerWorkflow["'])[^>]*>\s*Workflow\s*<\/a>/i.test(productCol)) {
      failures.push(`${page}: footer Product column must use i18n-owned Workflow link to about.html`);
    }
    if (/data-footer-email-open/.test(productCol)) {
      failures.push(`${page}: footer Product column must not open the contact modal`);
    }
    if (!/footerWorkflow\s*:\s*['"]Workflow['"]|["']footerWorkflow["']\s*:\s*["']Workflow["']/.test(html)) {
      failures.push(`${page}: missing English footerWorkflow copy`);
    }
    if (!/footerWorkflow\s*:\s*['"]工作流程['"]|["']footerWorkflow["']\s*:\s*["']工作流程["']/.test(html)) {
      failures.push(`${page}: missing Chinese footerWorkflow copy`);
    }
  }
  if (!getStartedCol) {
    failures.push(`${page}: missing footer Get started column`);
  } else if (!/type=["']button["'][^>]*data-footer-email-open|data-footer-email-open[^>]*type=["']button["']/.test(getStartedCol)) {
    failures.push(`${page}: footer Get started contact trigger is not a button`);
  }
  if (/href=["']contact\.html["'][^>]*data-(?:i18n|footer-i18n)=["'](?:contact|navContact)["']/.test(footer)) {
    failures.push(`${page}: footer Contact still links to contact.html`);
  }
  if (!/type=["']button["'][^>]*data-footer-email-open|data-footer-email-open[^>]*type=["']button["']/.test(footer)) {
    failures.push(`${page}: footer email trigger is not a button`);
  }
}

const js = read('assets/footer-email-modal.js');
if (js) {
  for (const text of [
    email,
    'Contact Sampora',
    '联系 Sampora',
    'Copy email',
    '复制邮箱',
    'navigator.clipboard.writeText',
    'data-footer-email-open',
    'data-footer-email-copy',
    'footer-email-brand',
    'footer-email-mark',
    'footer-email-brand-text'
  ]) {
    if (!js.includes(text)) failures.push(`assets/footer-email-modal.js: missing ${text}`);
  }
  const addressMarkup = js.match(/<[^>]*class=["']footer-email-address["'][^>]*>/)?.[0] || '';
  if (!addressMarkup) {
    failures.push('assets/footer-email-modal.js: missing visible footer email address element');
  } else {
    if (!/^<a\b/.test(addressMarkup)) {
      failures.push('assets/footer-email-modal.js: visible footer email address must be an anchor link');
    }
    if (!/href=["']mailto:(?:\$\{EMAIL\}|contact@getsampora\.com)["']/.test(addressMarkup)) {
      failures.push('assets/footer-email-modal.js: visible footer email address must use mailto:contact@getsampora.com');
    }
    if (/data-footer-email-copy/.test(addressMarkup)) {
      failures.push('assets/footer-email-modal.js: visible footer email address must not trigger copy handler');
    }
  }
  if (/<button\b[^>]*class=["']footer-email-address["']/.test(js)) {
    failures.push('assets/footer-email-modal.js: visible footer email address must not be rendered as a button');
  }
}

const css = read('assets/footer-email-modal.css');
if (css) {
  for (const text of [
    '.footer-email-modal-backdrop',
    '.footer-email-card',
    '.footer-email-brand',
    '.footer-email-mark',
    '@keyframes footerEmailHomePulseRing',
    'text-align: center',
    'justify-items: center',
    'width: fit-content',
    'max-width: calc(100vw - 32px)',
    'rgba(56, 210, 255'
  ]) {
    if (!css.includes(text)) failures.push(`assets/footer-email-modal.css: missing ${text}`);
  }
  const addressRule = css.match(/\.footer-email-address\s*\{[^}]*\}/s)?.[0] || '';
  if (/(^|[;\s])width:\s*100%/.test(addressRule)) {
    failures.push('assets/footer-email-modal.css: footer email address must not be width:100%');
  }
  const cardRule = css.match(/\.footer-email-card\s*\{[^}]*\}/s)?.[0] || '';
  for (const text of [
    'display: flex',
    'flex-direction: column',
    'padding: 20px 28px',
    'row-gap: 17px'
  ]) {
    if (!cardRule.includes(text)) failures.push(`assets/footer-email-modal.css: footer email card missing homepage shared ${text}`);
  }
  const brandRule = css.match(/\.footer-email-brand\s*\{[^}]*\}/s)?.[0] || '';
  for (const text of [
    'font: inherit',
    'letter-spacing: 0',
    'text-transform: none'
  ]) {
    if (!brandRule.includes(text)) failures.push(`assets/footer-email-modal.css: footer email brand missing homepage shared ${text}`);
  }
  const markRule = css.match(/\.footer-email-mark\s*\{[^}]*\}/s)?.[0] || '';
  if (!markRule.includes('animation: none')) failures.push('assets/footer-email-modal.css: footer email mark must use homepage ring animation instead of mark breathing');
  if (!css.includes('@keyframes footerEmailHomePulseRing')) failures.push('assets/footer-email-modal.css: missing homepage shared expanding ring keyframes');
  if (!css.includes('.footer-email-mark::before,')) failures.push('assets/footer-email-modal.css: missing homepage shared first expanding ring');
  const liveRule = css.match(/\.footer-email-live:empty\s*\{[^}]*\}/s)?.[0] || '';
  if (!liveRule.includes('display: none')) failures.push('assets/footer-email-modal.css: empty footer email live row must not reserve space');

  const footerButton = '#footer .sampora-footer-col .sampora-footer-link-button';
  const footerButtonBody = mergedRuleBody(css, footerButton);
  const footerButtonAfterBody = mergedRuleBody(css, `${footerButton}::after`);
  const footerButtonHoverBody = mergedRuleBody(css, `${footerButton}:hover`);
  const footerButtonFocusBody = mergedRuleBody(css, `${footerButton}:focus-visible`);
  const footerButtonHoverAfterBody = mergedRuleBody(css, `${footerButton}:hover::after`);
  const footerButtonFocusAfterBody = mergedRuleBody(css, `${footerButton}:focus-visible::after`);

  if (!footerButtonBody) failures.push(`assets/footer-email-modal.css: missing scoped footer trigger rule ${footerButton}`);
  if (footerButtonBody && !/position:\s*relative/.test(footerButtonBody)) failures.push('assets/footer-email-modal.css: footer trigger button must support underline positioning');
  if (footerButtonBody && !/transition:\s*[^;]*(?:color|transform|text-shadow)/.test(footerButtonBody)) failures.push('assets/footer-email-modal.css: footer trigger button missing link-like motion transition');
  if (hasForcedWhiteText(footerButtonBody)) failures.push('assets/footer-email-modal.css: footer trigger button must not force white text');

  if (!footerButtonAfterBody) failures.push('assets/footer-email-modal.css: missing footer trigger underline pseudo-element');
  if (footerButtonAfterBody && !/transform:\s*scaleX\(0\)/.test(footerButtonAfterBody)) failures.push('assets/footer-email-modal.css: footer trigger underline must start collapsed');
  if (footerButtonAfterBody && !/transition:\s*transform\b/.test(footerButtonAfterBody)) failures.push('assets/footer-email-modal.css: footer trigger underline missing transform transition');

  if (!footerButtonHoverBody || !footerButtonFocusBody) failures.push('assets/footer-email-modal.css: footer trigger missing hover/focus-visible motion parity selectors');
  const interactiveBody = `${footerButtonHoverBody}\n${footerButtonFocusBody}`;
  if (interactiveBody.trim() && !/transform:\s*translateX\(/.test(interactiveBody)) failures.push('assets/footer-email-modal.css: footer trigger hover/focus must keep link-like motion parity');
  if (hasForcedWhiteText(interactiveBody)) failures.push('assets/footer-email-modal.css: footer trigger hover/focus must not force white text');

  if (!footerButtonHoverAfterBody || !footerButtonFocusAfterBody) failures.push('assets/footer-email-modal.css: footer trigger missing hover/focus underline parity selectors');
  const interactiveAfterBody = `${footerButtonHoverAfterBody}\n${footerButtonFocusAfterBody}`;
  if (interactiveAfterBody.trim() && !/transform:\s*scaleX\(1\)/.test(interactiveAfterBody)) failures.push('assets/footer-email-modal.css: footer trigger underline must expand on hover/focus');
}

const indexHtml = read('index.html');
if (indexHtml) {
  if (indexHtml.includes('footer-email-home-preview')) failures.push('index.html: homepage-only footer email modal preview scope must be removed');
  if (indexHtml.includes('footer-email-home-preview-modal')) failures.push('index.html: homepage-only footer email modal inline style must be removed');
}

if (failures.length) {
  console.error('FOOTER_EMAIL_MODAL_CHECK_FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('FOOTER_EMAIL_MODAL_CHECK_OK');
