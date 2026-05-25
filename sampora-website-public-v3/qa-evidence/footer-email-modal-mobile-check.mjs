import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadChromium } from './playwright-loader.mjs';

const chromium = loadChromium();
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const chromeExecutablePath = process.env.CHROME_EXECUTABLE_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
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

function contentType(file) {
  if (file.endsWith('.css')) return 'text/css';
  if (file.endsWith('.js')) return 'text/javascript';
  if (file.endsWith('.svg')) return 'image/svg+xml';
  if (file.endsWith('.png')) return 'image/png';
  if (file.endsWith('.ico')) return 'image/x-icon';
  return 'text/html';
}

async function serveFile(res, absolute) {
  try {
    const body = await fs.readFile(absolute);
    res.writeHead(200, { 'content-type': contentType(absolute) });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end('not found');
  }
}

async function createServer() {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url || '/', 'http://127.0.0.1');
    const cleanPath = decodeURIComponent(url.pathname.replace(/^\/+/, '') || 'index.html');
    const absolute = path.resolve(root, cleanPath);
    if (!absolute.startsWith(root)) {
      res.writeHead(403);
      res.end('forbidden');
      return;
    }
    serveFile(res, absolute);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  return { server, base: `http://127.0.0.1:${address.port}/` };
}

function assertModal(label, metrics) {
  if (!metrics.hasTrigger) failures.push(`${label}: missing footer email trigger`);
  if (!metrics.open) failures.push(`${label}: modal did not open`);
  if (metrics.documentOverflow > 0) failures.push(`${label}: document horizontal overflow ${metrics.documentOverflow}`);
  if (metrics.bodyOverflow > 0) failures.push(`${label}: body horizontal overflow ${metrics.bodyOverflow}`);
  if (metrics.cardLeft < 0 || metrics.cardRight > metrics.viewportWidth) {
    failures.push(`${label}: modal card outside viewport left=${metrics.cardLeft} right=${metrics.cardRight} viewport=${metrics.viewportWidth}`);
  }
  if (metrics.cardOverflow > 1) failures.push(`${label}: modal card internal horizontal overflow ${metrics.cardOverflow}`);
  if (metrics.brandText !== 'Sampora') failures.push(`${label}: missing Sampora brand text`);
  if (metrics.markText !== 'S') failures.push(`${label}: missing Sampora S logo mark`);
  if (!hasNoDirectAnimation(metrics.markAnimation)) failures.push(`${label}: S mark should not use direct animation (${metrics.markAnimation})`);
  if (!hasPulseRingAnimation(metrics.markBeforeAnimation, metrics.markBeforeDuration)) {
    failures.push(`${label}: S mark before ring animation missing name=${metrics.markBeforeAnimation} duration=${metrics.markBeforeDuration}`);
  }
  if (!hasPulseRingAnimation(metrics.markAfterAnimation, metrics.markAfterDuration)) {
    failures.push(`${label}: S mark after ring animation missing name=${metrics.markAfterAnimation} duration=${metrics.markAfterDuration}`);
  }
  if (metrics.cardTextAlign !== 'center') failures.push(`${label}: modal content is not centered`);
  if (metrics.brandOffset > 1.5) failures.push(`${label}: brand row is not centered`);
  if (metrics.addressWidth >= metrics.cardWidth - 8) failures.push(`${label}: email address frame is stretched to card width`);
}

function animationNames(value) {
  return String(value || '')
    .split(',')
    .map(name => name.trim())
    .filter(Boolean);
}

function hasNoDirectAnimation(value) {
  const names = animationNames(value);
  return names.length === 0 || names.every(name => name === 'none');
}

function durationToMs(value) {
  const token = String(value || '').trim();
  if (!token || token === '0') return 0;
  if (token.endsWith('ms')) return Number.parseFloat(token);
  if (token.endsWith('s')) return Number.parseFloat(token) * 1000;
  return Number.parseFloat(token);
}

function hasNonZeroDuration(value) {
  return String(value || '')
    .split(',')
    .some(duration => durationToMs(duration) > 0);
}

function hasPulseRingAnimation(nameValue, durationValue) {
  return animationNames(nameValue).includes('footerEmailHomePulseRing') && hasNonZeroDuration(durationValue);
}

async function checkPage(page, base, rel, lang) {
  await page.goto(base + rel, { waitUntil: 'domcontentloaded' });
  await page.evaluate((value) => {
    localStorage.setItem('sampora_lang', value);
  }, lang);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('footer [data-footer-email-open]').first().click();
  await page.waitForSelector('[data-footer-email-modal]:not([hidden])');
  const metrics = await page.evaluate(() => {
    const trigger = document.querySelector('footer [data-footer-email-open]');
    const modal = document.querySelector('[data-footer-email-modal]');
    const card = document.querySelector('.footer-email-card');
    const brand = document.querySelector('.footer-email-brand');
    const mark = document.querySelector('.footer-email-mark');
    const address = document.querySelector('.footer-email-address');
    const markStyle = mark ? getComputedStyle(mark) : null;
    const markBeforeStyle = mark ? getComputedStyle(mark, '::before') : null;
    const markAfterStyle = mark ? getComputedStyle(mark, '::after') : null;
    const cardRect = card ? card.getBoundingClientRect() : { left: 0, right: 0 };
    const brandRect = brand ? brand.getBoundingClientRect() : { left: 0, right: 0 };
    const addressRect = address ? address.getBoundingClientRect() : { width: 0 };
    const cardCenter = (cardRect.left + cardRect.right) / 2;
    const brandCenter = (brandRect.left + brandRect.right) / 2;
    return {
      hasTrigger: Boolean(trigger),
      open: Boolean(modal && !modal.hidden),
      viewportWidth: window.innerWidth,
      documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      bodyOverflow: document.body.scrollWidth - document.documentElement.clientWidth,
      cardLeft: Math.floor(cardRect.left),
      cardRight: Math.ceil(cardRect.right),
      cardWidth: cardRect.right - cardRect.left,
      cardOverflow: card ? card.scrollWidth - card.clientWidth : 0,
      cardTextAlign: card ? getComputedStyle(card).textAlign : '',
      brandText: document.querySelector('.footer-email-brand-text')?.textContent || '',
      markText: mark?.textContent || '',
      markAnimation: markStyle?.animationName || '',
      markBeforeAnimation: markBeforeStyle?.animationName || '',
      markBeforeDuration: markBeforeStyle?.animationDuration || '',
      markAfterAnimation: markAfterStyle?.animationName || '',
      markAfterDuration: markAfterStyle?.animationDuration || '',
      brandOffset: Math.abs(cardCenter - brandCenter),
      title: document.querySelector('[data-footer-email-title]')?.textContent || '',
      copy: document.querySelector('.footer-email-copy[data-footer-email-copy]')?.textContent || '',
      addressWidth: addressRect.width
    };
  });
  if (lang === 'en' && (metrics.title !== 'Contact Sampora' || metrics.copy !== 'Copy email')) {
    failures.push(`${rel} ${lang}: modal copy mismatch`);
  }
  if (lang === 'zh' && (metrics.title !== '联系 Sampora' || metrics.copy !== '复制邮箱')) {
    failures.push(`${rel} ${lang}: modal copy mismatch`);
  }
  assertModal(`${rel} ${lang}`, metrics);
}

const { server, base } = await createServer();
const browser = await chromium.launch({ headless: true, executablePath: chromeExecutablePath });
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 900 } });
  await page.route('**/*', (route) => {
    const url = route.request().url();
    if (url.startsWith(base)) route.continue();
    else route.abort();
  });
  for (const rel of pages) {
    await checkPage(page, base, rel, 'en');
    await checkPage(page, base, rel, 'zh');
  }
} finally {
  await browser.close();
  server.close();
}

if (failures.length) {
  console.error('FOOTER_EMAIL_MODAL_MOBILE_CHECK_FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('FOOTER_EMAIL_MODAL_MOBILE_CHECK_OK');
