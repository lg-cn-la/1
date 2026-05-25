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
  const triggerCount = (footer.match(/data-footer-email-open/g) || []).length;
  if (triggerCount < 2) failures.push(`${page}: expected footer email triggers in Product and Get started columns, found ${triggerCount}`);
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
