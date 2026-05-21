import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('../../playwright-local/node_modules/playwright');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const referencePage = 'about_sampora_issues_fixed.html';
const targetPages = [
  'index.html',
  'solutions.html',
  'resources.html',
  'plans.html',
  'contact.html',
  'resource-manuals.html',
];
const langs = ['en', 'zh', 'hi'];
const chromeExecutablePath = process.env.CHROME_EXECUTABLE_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const failures = [];
const evidence = {
  generatedAt: new Date().toISOString(),
  referencePage,
  targetPages,
  chromeExecutablePath,
  desktop: {},
  mobile: {},
};

function fileUrl(file) {
  return pathToFileURL(path.join(root, file)).href;
}

function round(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

function pushFailure(message) {
  failures.push(message);
  console.log(`FAIL ${message}`);
}

function nearlyEqual(actual, expected, tolerance) {
  return Math.abs(round(actual) - round(expected)) <= tolerance;
}

function compareNumber(pageName, lang, label, actual, expected, tolerance) {
  if (!nearlyEqual(actual, expected, tolerance)) {
    pushFailure(`${pageName} ${lang}: ${label} expected ${round(expected)} +/- ${tolerance}, found ${round(actual)}`);
  }
}

function compareString(pageName, lang, label, actual, expected) {
  if (actual !== expected) {
    pushFailure(`${pageName} ${lang}: ${label} expected ${JSON.stringify(expected)}, found ${JSON.stringify(actual)}`);
  }
}

async function setLanguage(page, lang) {
  await page.evaluate((nextLang) => {
    localStorage.setItem('sampora_lang', nextLang);
  }, lang);
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(300);
  await page.locator(`.mast .lang button[data-lang="${lang}"], .mast [data-lang-btn="${lang}"]`).first().click({ timeout: 1000 }).catch(() => {});
  await page.waitForTimeout(250);
}

async function sample(page, file, lang, viewport) {
  await page.setViewportSize(viewport);
  await page.goto(fileUrl(file), { waitUntil: 'load' });
  await setLanguage(page, lang);
  return await page.evaluate(() => {
    const readRect = (el) => {
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return {
        x: Math.round(rect.x * 100) / 100,
        y: Math.round(rect.y * 100) / 100,
        width: Math.round(rect.width * 100) / 100,
        height: Math.round(rect.height * 100) / 100,
        top: Math.round(rect.top * 100) / 100,
        right: Math.round(rect.right * 100) / 100,
        bottom: Math.round(rect.bottom * 100) / 100,
      };
    };
    const css = (el) => {
      if (!el) return null;
      const style = getComputedStyle(el);
      return {
        display: style.display,
        alignItems: style.alignItems,
        gap: style.gap,
        color: style.color,
        backgroundColor: style.backgroundColor,
        backgroundImage: style.backgroundImage,
        borderColor: style.borderColor,
        borderRadius: style.borderRadius,
        boxShadow: style.boxShadow,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        fontFamily: style.fontFamily,
        lineHeight: style.lineHeight,
        letterSpacing: style.letterSpacing,
        textTransform: style.textTransform,
      };
    };
    const mast = document.querySelector('.mast');
    const brand = document.querySelector('.mast .brand');
    const mark = brand?.querySelector('.mark');
    const name = brand?.querySelector('b, .brand-name');
    const subtitle = brand?.querySelector('small, .brand-sub, [data-brand-sub]');
    const mastRect = readRect(mast);
    const brandRect = readRect(brand);
    const markRect = readRect(mark);
    const nameRect = readRect(name);
    const subtitleRect = readRect(subtitle);
    return {
      pageTitle: document.title,
      viewport: { width: innerWidth, height: innerHeight },
      overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth, document.body.scrollWidth - innerWidth),
      mast: { rect: mastRect, css: css(mast) },
      brand: {
        text: brand?.innerText?.replace(/\s+/g, ' ').trim() || '',
        rect: brandRect,
        css: css(brand),
        topInMast: brandRect && mastRect ? Math.round((brandRect.top - mastRect.top) * 100) / 100 : null,
        centerDeltaFromMast: brandRect && mastRect
          ? Math.round(((brandRect.top + brandRect.height / 2) - (mastRect.top + mastRect.height / 2)) * 100) / 100
          : null,
      },
      mark: { rect: markRect, css: css(mark) },
      name: { rect: nameRect, css: css(name) },
      subtitle: {
        rect: subtitleRect,
        css: css(subtitle),
        topInBrand: subtitleRect && brandRect ? Math.round((subtitleRect.top - brandRect.top) * 100) / 100 : null,
      },
    };
  });
}

function compareDesktop(pageName, lang, actual, reference) {
  if (!actual.brand.rect || !actual.mark.rect || !actual.name.rect || !actual.subtitle.rect) {
    pushFailure(`${pageName} ${lang}: missing one or more header brand elements`);
    return;
  }

  compareNumber(pageName, lang, 'brand block height', actual.brand.rect.height, reference.brand.rect.height, 1);
  compareNumber(pageName, lang, 'brand block width', actual.brand.rect.width, reference.brand.rect.width, 6);
  compareNumber(pageName, lang, 'brand top in mast', actual.brand.topInMast, reference.brand.topInMast, 1.5);
  compareNumber(pageName, lang, 'brand vertical center delta', actual.brand.centerDeltaFromMast, reference.brand.centerDeltaFromMast, 1.5);
  compareString(pageName, lang, 'brand display', actual.brand.css.display, reference.brand.css.display);
  compareString(pageName, lang, 'brand align-items', actual.brand.css.alignItems, reference.brand.css.alignItems);
  compareString(pageName, lang, 'brand gap', actual.brand.css.gap, reference.brand.css.gap);

  compareNumber(pageName, lang, 'mark width', actual.mark.rect.width, reference.mark.rect.width, 0.5);
  compareNumber(pageName, lang, 'mark height', actual.mark.rect.height, reference.mark.rect.height, 0.5);
  compareString(pageName, lang, 'mark background image', actual.mark.css.backgroundImage, reference.mark.css.backgroundImage);
  compareString(pageName, lang, 'mark background color', actual.mark.css.backgroundColor, reference.mark.css.backgroundColor);
  compareString(pageName, lang, 'mark border color', actual.mark.css.borderColor, reference.mark.css.borderColor);
  compareString(pageName, lang, 'mark border radius', actual.mark.css.borderRadius, reference.mark.css.borderRadius);
  compareString(pageName, lang, 'mark font weight', actual.mark.css.fontWeight, reference.mark.css.fontWeight);
  compareString(pageName, lang, 'mark font size', actual.mark.css.fontSize, reference.mark.css.fontSize);

  compareString(pageName, lang, 'brand name font weight', actual.name.css.fontWeight, reference.name.css.fontWeight);
  compareString(pageName, lang, 'brand name letter spacing', actual.name.css.letterSpacing, reference.name.css.letterSpacing);

  compareNumber(pageName, lang, 'subtitle height', actual.subtitle.rect.height, reference.subtitle.rect.height, 1);
  compareNumber(pageName, lang, 'subtitle top in brand', actual.subtitle.topInBrand, reference.subtitle.topInBrand, 1.5);
  compareString(pageName, lang, 'subtitle color', actual.subtitle.css.color, reference.subtitle.css.color);
  compareString(pageName, lang, 'subtitle font size', actual.subtitle.css.fontSize, reference.subtitle.css.fontSize);
  compareString(pageName, lang, 'subtitle font family', actual.subtitle.css.fontFamily, reference.subtitle.css.fontFamily);
  compareString(pageName, lang, 'subtitle letter spacing', actual.subtitle.css.letterSpacing, reference.subtitle.css.letterSpacing);
  compareString(pageName, lang, 'subtitle text transform', actual.subtitle.css.textTransform, reference.subtitle.css.textTransform);
}

function checkMobile(pageName, lang, actual) {
  if (!actual.brand.rect || !actual.mark.rect || !actual.name.rect) {
    pushFailure(`${pageName} ${lang} mobile: missing visible brand/mark/name`);
    return;
  }
  if (actual.overflowX > 0) {
    pushFailure(`${pageName} ${lang} mobile: document horizontal overflow ${actual.overflowX}`);
  }
  if (actual.brand.rect.left < -0.5 || actual.mark.rect.left < -0.5) {
    pushFailure(`${pageName} ${lang} mobile: brand block clips left edge`);
  }
  if (actual.brand.rect.right > actual.viewport.width + 0.5) {
    pushFailure(`${pageName} ${lang} mobile: brand block clips right edge ${actual.brand.rect.right} > ${actual.viewport.width}`);
  }
  if (actual.mark.rect.width < 29.5 || actual.mark.rect.height < 29.5) {
    pushFailure(`${pageName} ${lang} mobile: mark rendered smaller than About baseline size`);
  }
}

const browser = await chromium.launch({ headless: true, executablePath: chromeExecutablePath });
const page = await browser.newPage();

for (const lang of langs) {
  const reference = await sample(page, referencePage, lang, { width: 1440, height: 900 });
  evidence.desktop[`${referencePage}:${lang}`] = reference;
  for (const target of targetPages) {
    const actual = await sample(page, target, lang, { width: 1440, height: 900 });
    evidence.desktop[`${target}:${lang}`] = actual;
    compareDesktop(target, lang, actual, reference);
  }
}

for (const lang of langs) {
  const reference = await sample(page, referencePage, lang, { width: 390, height: 900 });
  evidence.mobile[`${referencePage}:${lang}`] = reference;
  for (const target of targetPages) {
    const actual = await sample(page, target, lang, { width: 390, height: 900 });
    evidence.mobile[`${target}:${lang}`] = actual;
    checkMobile(target, lang, actual);
  }
}

await browser.close();

if (!failures.length) {
  console.log(`PASS header brand visual check: ${targetPages.length} target pages match ${referencePage} brand block at 1440x900 and keep mobile brand visible at 390x900 across EN/ZH/HI`);
}

process.exitCode = failures.length ? 1 : 0;
