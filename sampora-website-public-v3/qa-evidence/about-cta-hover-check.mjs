import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadChromium } from './playwright-loader.mjs';

const chromium = loadChromium();

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const url = pathToFileURL(path.join(root, 'about.html')).href;
const chromeExecutablePath = process.env.CHROME_EXECUTABLE_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const failures = [];

const languages = ['en', 'zh'];
const desktopViewport = { width: 1440, height: 900 };
const mobileViewport = { width: 390, height: 900 };

function fail(message) {
  failures.push(message);
}

function round(value) {
  return Math.round(value * 100) / 100;
}

function translateY(transform) {
  if (!transform || transform === 'none') return 0;
  const matrix3d = transform.match(/^matrix3d\((.+)\)$/);
  if (matrix3d) {
    const values = matrix3d[1].split(',').map(value => Number(value.trim()));
    return Number.isFinite(values[13]) ? values[13] : 0;
  }
  const matrix = transform.match(/^matrix\((.+)\)$/);
  if (matrix) {
    const values = matrix[1].split(',').map(value => Number(value.trim()));
    return Number.isFinite(values[5]) ? values[5] : 0;
  }
  return 0;
}

async function setLanguage(page, lang) {
  const button = page.locator(`.lang button[data-lang="${lang}"]`).first();
  await button.click();
  await page.waitForTimeout(120);
}

async function measure(page, selector) {
  return page.evaluate(sel => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return {
      text: el.textContent.trim(),
      href: el.getAttribute('href'),
      rect: {
        x: Math.round(rect.x * 100) / 100,
        y: Math.round(rect.y * 100) / 100,
        width: Math.round(rect.width * 100) / 100,
        height: Math.round(rect.height * 100) / 100,
      },
      transform: style.transform,
      transformY: 0,
      boxShadow: style.boxShadow,
      backgroundImage: style.backgroundImage,
      backgroundColor: style.backgroundColor,
      overflowX: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
    };
  }, selector);
}

async function hoverMeasure(page, selector) {
  await page.mouse.move(1, 1);
  await page.waitForTimeout(80);
  const base = await measure(page, selector);
  await page.hover(selector);
  await page.waitForTimeout(180);
  const hover = await measure(page, selector);
  await page.mouse.move(1, 1);
  await page.waitForTimeout(220);
  const afterLeave = await measure(page, selector);
  if (base) base.transformY = round(translateY(base.transform));
  if (hover) hover.transformY = round(translateY(hover.transform));
  if (afterLeave) afterLeave.transformY = round(translateY(afterLeave.transform));
  return { base, hover, afterLeave };
}

async function checkDesktop(browser, lang) {
  const page = await browser.newPage({ viewport: desktopViewport });
  await page.goto(url, { waitUntil: 'load' });
  await setLanguage(page, lang);

  const header = await hoverMeasure(page, '.mast .header-actions .btn.primary');
  if (!header.hover) fail(`desktop ${lang}: header Start trial reference missing`);
  if (header.hover && header.hover.transformY > -0.75) {
    fail(`desktop ${lang}: header reference did not show lift ${JSON.stringify(header.hover)}`);
  }

  await page.locator('.cta-section .btn.primary').scrollIntoViewIfNeeded();
  await page.waitForTimeout(160);
  const cta = await hoverMeasure(page, '.cta-section .btn.primary');
  if (!cta.hover) fail(`desktop ${lang}: bottom CTA Start trial missing`);
  if (cta.hover?.href !== 'contact.html?intent=start_trial#contact-form') {
    fail(`desktop ${lang}: bottom CTA href changed to ${cta.hover?.href}`);
  }
  if (cta.hover && cta.hover.transformY > -0.75) {
    fail(`desktop ${lang}: bottom CTA hover did not reuse the primary selected lift ${JSON.stringify(cta.hover)}`);
  }
  if (cta.base && cta.hover && cta.base.boxShadow === cta.hover.boxShadow) {
    fail(`desktop ${lang}: bottom CTA hover shadow stayed unchanged`);
  }
  if (cta.hover && !/18px 42px/.test(cta.hover.boxShadow)) {
    fail(`desktop ${lang}: bottom CTA hover shadow does not match primary selected glow ${cta.hover.boxShadow}`);
  }
  if (cta.base && !/^linear-gradient/.test(cta.base.backgroundImage)) {
    fail(`desktop ${lang}: bottom CTA base background is not the shared primary gradient ${cta.base.backgroundImage}`);
  }
  if (cta.afterLeave && !/^linear-gradient/.test(cta.afterLeave.backgroundImage)) {
    fail(`desktop ${lang}: bottom CTA mouse-leave background snaps away from the shared gradient ${cta.afterLeave.backgroundImage}`);
  }
  if (cta.afterLeave && cta.afterLeave.transformY !== 0) {
    fail(`desktop ${lang}: bottom CTA did not settle after mouse leave ${JSON.stringify(cta.afterLeave)}`);
  }
  if (cta.hover?.overflowX > 0) fail(`desktop ${lang}: horizontal overflow ${cta.hover.overflowX}`);

  await page.close();
  return {
    lang,
    headerHover: header.hover,
    ctaBase: cta.base,
    ctaHover: cta.hover,
    ctaAfterLeave: cta.afterLeave,
  };
}

async function checkMobile(browser, lang) {
  const page = await browser.newPage({ viewport: mobileViewport });
  await page.goto(url, { waitUntil: 'load' });
  await setLanguage(page, lang);
  await page.locator('.cta-section .btn.primary').scrollIntoViewIfNeeded();
  await page.waitForTimeout(160);
  const cta = await hoverMeasure(page, '.cta-section .btn.primary');
  if (!cta.hover) fail(`mobile ${lang}: bottom CTA Start trial missing`);
  if (cta.hover?.href !== 'contact.html?intent=start_trial#contact-form') {
    fail(`mobile ${lang}: bottom CTA href changed to ${cta.hover?.href}`);
  }
  if (cta.hover && cta.hover.rect.height < 42) {
    fail(`mobile ${lang}: bottom CTA height too small ${JSON.stringify(cta.hover.rect)}`);
  }
  if (cta.base && !/^linear-gradient/.test(cta.base.backgroundImage)) {
    fail(`mobile ${lang}: bottom CTA base background is not the shared primary gradient ${cta.base.backgroundImage}`);
  }
  if (cta.afterLeave && !/^linear-gradient/.test(cta.afterLeave.backgroundImage)) {
    fail(`mobile ${lang}: bottom CTA mouse-leave background snaps away from the shared gradient ${cta.afterLeave.backgroundImage}`);
  }
  if (cta.hover?.overflowX > 0) fail(`mobile ${lang}: horizontal overflow ${cta.hover.overflowX}`);
  await page.close();
  return {
    lang,
    ctaBase: cta.base,
    ctaHover: cta.hover,
    ctaAfterLeave: cta.afterLeave,
  };
}

const browser = await chromium.launch({ headless: true, executablePath: chromeExecutablePath });
const evidence = {
  chromeExecutablePath,
  desktop: [],
  mobile: [],
};

for (const lang of languages) {
  evidence.desktop.push(await checkDesktop(browser, lang));
  evidence.mobile.push(await checkMobile(browser, lang));
}

await browser.close();

console.log(JSON.stringify(evidence, null, 2));
if (failures.length) {
  console.error(`FAIL about CTA hover check:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log('PASS about CTA hover check');
