import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadChromium } from './playwright-loader.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pages = ['privacy.html', 'cookie-policy.html', 'terms.html'];
const failures = [];
const expectedStatus = {
  'privacy.html': {
    en: {
      live: 'Privacy Policy',
      mid: 'Current Version',
      right: 'Public website and contact form data notice',
    },
    zh: {
      live: '隐私政策',
      mid: '当前版本',
      right: '公开官网与联系表单数据说明',
    },
  },
  'cookie-policy.html': {
    en: {
      live: 'Cookie Policy',
      mid: 'Necessary Storage',
      right: 'Analytics and marketing cookies are not enabled',
    },
    zh: {
      live: 'Cookie 政策',
      mid: '必要存储',
      right: '当前未启用分析与营销 Cookie',
    },
  },
  'terms.html': {
    en: {
      live: 'Terms of Use',
      mid: 'Current Version',
      right: 'Website access and sales-led onboarding terms',
    },
    zh: {
      live: '使用条款',
      mid: '当前版本',
      right: '官网访问与销售承接规则',
    },
  },
};

function fail(message) {
  failures.push(message);
}

const chromium = loadChromium();
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

async function readLegalPage(pageName, lang) {
  await page.goto(pathToFileURL(path.join(root, pageName)).href, { waitUntil: 'domcontentloaded' });
  await page.evaluate((targetLang) => {
    try {
      localStorage.setItem('sampora_lang', targetLang);
    } catch (error) {}
    const button = document.querySelector(`.lang button[data-lang="${targetLang}"]`);
    if (button) button.click();
  }, lang);
  await page.waitForTimeout(80);
  return page.evaluate(() => {
    const activePanels = Array.from(document.querySelectorAll('.legal-panel.active'));
    const heroPanel = activePanels.find(panel => panel.closest('.legal-hero'));
    const contentPanel = activePanels.find(panel => panel.closest('.legal-content'));
    const links = Array.from(document.querySelectorAll('.sampora-footer-legal a')).map(link => ({
      text: link.textContent.trim(),
      href: link.getAttribute('href'),
      current: link.getAttribute('aria-current') || '',
    }));
    const status = {
      live: document.querySelector('.status .live')?.textContent.trim() || '',
      mid: document.querySelector('[data-i18n="statusMid"]')?.textContent.trim() || '',
      right: document.querySelector('.status .right')?.textContent.trim() || '',
    };
    const footerCard = document.querySelector('#footer .sampora-footer-card');
    const footerMain = document.querySelector('#footer .sampora-footer-main');
    const footerLegal = document.querySelector('#footer .sampora-footer-legal');
    const footerCardStyle = footerCard ? getComputedStyle(footerCard) : null;
    const footerMainStyle = footerMain ? getComputedStyle(footerMain) : null;
    const footerLegalStyle = footerLegal ? getComputedStyle(footerLegal) : null;
    return {
      path: location.pathname.split('/').pop(),
      title: document.title,
      htmlLang: document.documentElement.lang,
      eyebrow: document.querySelector('.eyebrow')?.textContent.trim() || '',
      status,
      statusRight: status.right,
      h1: heroPanel?.querySelector('h1')?.textContent.replace(/\s+/g, ' ').trim() || '',
      headings: Array.from(contentPanel?.querySelectorAll('h2') || []).slice(0, 5).map(el => el.textContent.trim()),
      links,
      footer: {
        cardBorderRadius: footerCardStyle?.borderRadius || '',
        cardOverflow: footerCardStyle?.overflow || '',
        mainDisplay: footerMainStyle?.display || '',
        mainPaddingTop: footerMainStyle?.paddingTop || '',
        legalJustifyContent: footerLegalStyle?.justifyContent || '',
        legalGap: footerLegalStyle?.columnGap || footerLegalStyle?.gap || '',
        legalFontFamily: footerLegalStyle?.fontFamily || '',
      },
    };
  });
}

async function readScrollState(pageName) {
  await page.goto(pathToFileURL(path.join(root, pageName)).href, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => window.scrollTo(0, 180));
  await page.waitForTimeout(320);
  return page.evaluate(() => {
    const status = document.querySelector('.status')?.getBoundingClientRect();
    const mast = document.querySelector('.mast')?.getBoundingClientRect();
    const statusStyle = getComputedStyle(document.querySelector('.status'));
    return {
      navCondensed: document.body.classList.contains('nav-condensed'),
      mastTop: mast?.top ?? null,
      statusBottom: status?.bottom ?? null,
      statusOpacity: statusStyle.opacity,
    };
  });
}

const samples = {};
for (const lang of ['en', 'zh']) {
  samples[lang] = [];
  for (const pageName of pages) {
    samples[lang].push(await readLegalPage(pageName, lang));
  }
}

for (const lang of ['en', 'zh']) {
  const h1Set = new Set(samples[lang].map(sample => sample.h1));
  if (h1Set.size !== pages.length) fail(`${lang}: legal page H1s are not distinct: ${JSON.stringify([...h1Set])}`);

  const eyebrowSet = new Set(samples[lang].map(sample => sample.eyebrow));
  if (eyebrowSet.size !== pages.length) fail(`${lang}: legal page eyebrow labels are not page-specific: ${JSON.stringify([...eyebrowSet])}`);

  const statusSet = new Set(samples[lang].map(sample => sample.statusRight));
  if (statusSet.size !== pages.length) fail(`${lang}: legal status-right labels are not page-specific: ${JSON.stringify([...statusSet])}`);

  for (const sample of samples[lang]) {
    const legalLinks = sample.links.slice(0, 3).map(link => link.href);
    if (JSON.stringify(legalLinks) !== JSON.stringify(pages)) {
      fail(`${lang}/${sample.path}: footer legal links are not privacy/cookie/terms in order: ${JSON.stringify(legalLinks)}`);
    }

    const expected = expectedStatus[sample.path]?.[lang];
    if (!expected) {
      fail(`${lang}/${sample.path}: missing expected public legal status fixture`);
    } else {
      for (const key of ['live', 'mid', 'right']) {
        if (sample.status[key] !== expected[key]) {
          fail(`${lang}/${sample.path}: status ${key} ${JSON.stringify(sample.status[key])} !== ${JSON.stringify(expected[key])}`);
        }
      }
    }
    const forbiddenInternalStatus = [
      'Delivery workflow / Live',
      'Minimal production handoff',
      '交付工作流 / 在线',
      '最小生产交付包',
    ];
    for (const text of forbiddenInternalStatus) {
      if (Object.values(sample.status).includes(text)) fail(`${lang}/${sample.path}: internal delivery status is visible: ${text}`);
    }

    const currentLink = sample.links.find(link => link.href === sample.path);
    if (!currentLink) {
      fail(`${lang}/${sample.path}: no footer link points to the current legal page`);
    } else if (currentLink.current !== 'page') {
      fail(`${lang}/${sample.path}: current footer link is not marked aria-current="page"`);
    }

    if (!sample.headings.length) fail(`${lang}/${sample.path}: active legal content headings are missing`);
    if (sample.footer.cardBorderRadius !== '24px') fail(`${lang}/${sample.path}: footer card radius is not homepage-style 24px`);
    if (sample.footer.cardOverflow !== 'hidden') fail(`${lang}/${sample.path}: footer card overflow is not hidden like homepage footer`);
    if (sample.footer.mainDisplay !== 'grid') fail(`${lang}/${sample.path}: footer main is not grid`);
    if (sample.footer.mainPaddingTop !== '42px') fail(`${lang}/${sample.path}: footer main top padding ${sample.footer.mainPaddingTop} is not homepage-style 42px`);
    if (sample.footer.legalJustifyContent !== 'center') fail(`${lang}/${sample.path}: footer legal row is not centered`);
    if (sample.footer.legalGap !== '28px') fail(`${lang}/${sample.path}: footer legal gap ${sample.footer.legalGap} is not homepage-style 28px`);
    if (!/JetBrains Mono/.test(sample.footer.legalFontFamily)) fail(`${lang}/${sample.path}: footer legal font is not homepage mono style`);
  }
}

for (const pageName of pages) {
  const scroll = await readScrollState(pageName);
  if (!scroll.navCondensed) fail(`${pageName}: scrolling does not set body.nav-condensed`);
  if (typeof scroll.mastTop === 'number' && Math.abs(scroll.mastTop) > 1) {
    fail(`${pageName}: mast top after scroll is ${scroll.mastTop}, expected 0`);
  }
  if (typeof scroll.statusBottom === 'number' && scroll.statusBottom > 1 && scroll.statusOpacity !== '0') {
    fail(`${pageName}: status bar remains visible after scroll, bottom=${scroll.statusBottom}, opacity=${scroll.statusOpacity}`);
  }
}

await browser.close();

if (failures.length) {
  console.log('FAIL legal pages distinct check');
  failures.forEach(message => console.log(`- ${message}`));
  process.exitCode = 1;
} else {
  console.log('PASS legal pages distinct check');
}
