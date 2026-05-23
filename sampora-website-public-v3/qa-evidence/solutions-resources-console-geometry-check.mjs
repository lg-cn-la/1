import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('../../playwright-local/node_modules/playwright');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const chromeExecutablePath = process.env.CHROME_EXECUTABLE_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const langs = (process.env.SAMPORA_GEOMETRY_LANGS || 'en,zh,hi').split(',').map(lang => lang.trim()).filter(Boolean);
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 900 },
];

const pages = {
  solutions: {
    file: 'solutions.html',
    consoleSelector: '.solution-console',
  },
  resources: {
    file: 'resources.html',
    consoleSelector: '.resource-console:not(.modal-open)',
  },
};

function round(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

function fileUrl(file) {
  return pathToFileURL(path.join(root, file)).href;
}

async function setLanguage(page, lang) {
  await page.evaluate(nextLang => localStorage.setItem('sampora_lang', nextLang), lang);
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(260);
  await page.locator(`.mast .lang button[data-lang="${lang}"], .mast [data-lang-btn="${lang}"]`).first().click({ timeout: 900 }).catch(() => {});
  await page.waitForTimeout(220);
}

async function samplePage(page, pageName, viewport, lang) {
  const config = pages[pageName];
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  await page.goto(fileUrl(config.file), { waitUntil: 'load' });
  await setLanguage(page, lang);
  await page.locator(config.consoleSelector).first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(220);

  return page.evaluate(({ pageName, viewport, lang, consoleSelector }) => {
    const roundInPage = value => Math.round((Number(value) || 0) * 100) / 100;
    const rect = selector => {
      const el = document.querySelector(selector);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        top: roundInPage(r.top),
        bottom: roundInPage(r.bottom),
        left: roundInPage(r.left),
        right: roundInPage(r.right),
        width: roundInPage(r.width),
        height: roundInPage(r.height),
      };
    };
    const scopeRect = localSelector => {
      const scope = document.querySelector(consoleSelector);
      const el = scope?.querySelector(localSelector);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        top: roundInPage(r.top),
        bottom: roundInPage(r.bottom),
        left: roundInPage(r.left),
        right: roundInPage(r.right),
        width: roundInPage(r.width),
        height: roundInPage(r.height),
      };
    };
    const consoleRect = rect(consoleSelector);
    const windowRect = scopeRect('.console-window');
    const mainRect = scopeRect('.console-main');
    const windowBarRect = scopeRect('.window-bar');
    const summaryRect = scopeRect('.console-summary');
    const titleRect = scopeRect('.console-summary h3');
    const copyRect = scopeRect('.console-summary p');
    const tagsRect = scopeRect('.console-tags');
    const tagRects = [...document.querySelectorAll(`${consoleSelector} .console-tags .tag, ${consoleSelector} .console-tags .chip, ${consoleSelector} .console-tags span`)].map(el => {
      const r = el.getBoundingClientRect();
      return {
        top: roundInPage(r.top),
        bottom: roundInPage(r.bottom),
        left: roundInPage(r.left),
        right: roundInPage(r.right),
        width: roundInPage(r.width),
        height: roundInPage(r.height),
      };
    });
    const tagsContentRect = tagRects.length ? {
      top: roundInPage(Math.min(...tagRects.map(item => item.top))),
      bottom: roundInPage(Math.max(...tagRects.map(item => item.bottom))),
      left: roundInPage(Math.min(...tagRects.map(item => item.left))),
      right: roundInPage(Math.max(...tagRects.map(item => item.right))),
      width: roundInPage(Math.max(...tagRects.map(item => item.right)) - Math.min(...tagRects.map(item => item.left))),
      height: roundInPage(Math.max(...tagRects.map(item => item.bottom)) - Math.min(...tagRects.map(item => item.top))),
    } : tagsRect;
    const modebarRect = scopeRect('.topo-modebar');
    const headlineRect = scopeRect('.topo-headline');
    const stageRect = scopeRect('.topo-stage');
    const tickerRect = scopeRect('.console-ticker');
    const modeButtons = [...document.querySelectorAll(`${consoleSelector} .topo-modebar button`)].map(button => {
      const r = button.getBoundingClientRect();
      return {
        width: roundInPage(r.width),
        height: roundInPage(r.height),
        text: button.innerText.replace(/\s+/g, ' ').trim(),
      };
    });
    const rightLabels = [...document.querySelectorAll(`${consoleSelector} .hub.ctrl-hub + text, ${consoleSelector} .hub.evd-hub + text, ${consoleSelector} #hubControl, ${consoleSelector} #hubEvidence, ${consoleSelector} [data-i18n-svg="nodeCtrl"], ${consoleSelector} [data-i18n-svg="nodeEvd"]`)]
      .map(el => el.textContent.trim())
      .filter(Boolean);
    const flow = document.querySelector(`${consoleSelector} .topo-svg .flow.on, ${consoleSelector} .topo-svg .flow-group.on .flow`);
    const flowStyle = flow ? getComputedStyle(flow) : null;
    const horizontalOverflow = Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const gap = (from, to) => from && to ? roundInPage(to.top - from.bottom) : null;

    return {
      pageName,
      lang,
      viewport: viewport.name,
      viewportWidth: viewport.width,
      horizontalOverflow,
      rects: {
        console: consoleRect,
        window: windowRect,
        windowBar: windowBarRect,
        main: mainRect,
        summary: summaryRect,
        title: titleRect,
        copy: copyRect,
        tags: tagsRect,
        tagsContent: tagsContentRect,
        modebar: modebarRect,
        headline: headlineRect,
        stage: stageRect,
        ticker: tickerRect,
      },
      gaps: {
        summaryToTags: gap(copyRect, tagsRect),
        tagsToModebar: gap(tagsRect, modebarRect),
        chipsToModebar: gap(tagsContentRect, modebarRect),
        modebarToHeadline: gap(modebarRect, headlineRect),
        headlineToStage: gap(headlineRect, stageRect),
        stageToTicker: gap(stageRect, tickerRect),
      },
      proportions: {
        summary: summaryRect && windowRect ? roundInPage(summaryRect.height / windowRect.height) : null,
        tagsToModebar: tagsRect && modebarRect && windowRect ? roundInPage(gap(tagsRect, modebarRect) / windowRect.height) : null,
        chipsToModebar: tagsContentRect && modebarRect && windowRect ? roundInPage(gap(tagsContentRect, modebarRect) / windowRect.height) : null,
        modebar: modebarRect && windowRect ? roundInPage(modebarRect.height / windowRect.height) : null,
        headlineToStage: headlineRect && stageRect && windowRect ? roundInPage(gap(headlineRect, stageRect) / windowRect.height) : null,
        stage: stageRect && windowRect ? roundInPage(stageRect.height / windowRect.height) : null,
        stageToTicker: stageRect && tickerRect && windowRect ? roundInPage(gap(stageRect, tickerRect) / windowRect.height) : null,
        ticker: tickerRect && windowRect ? roundInPage(tickerRect.height / windowRect.height) : null,
      },
      modeButtons,
      rightLabels,
      motion: {
        animationName: flowStyle?.animationName || null,
        animationDuration: flowStyle?.animationDuration || null,
      },
    };
  }, { pageName, viewport, lang, consoleSelector: config.consoleSelector });
}

function compareSamples(solution, resource) {
  const failures = [];
  const notes = [];
  const viewport = solution.viewport;
  const suffix = `${solution.lang}/${viewport}`;
  const windowDelta = round(solution.rects.window.height - resource.rects.window.height);
  const consoleDelta = round(solution.rects.console.height - resource.rects.console.height);
  const widthDelta = round(Math.abs(solution.rects.window.width - resource.rects.window.width));
  const tagsGapDelta = round(solution.gaps.tagsToModebar - resource.gaps.tagsToModebar);
  const chipsGapDelta = round(solution.gaps.chipsToModebar - resource.gaps.chipsToModebar);
  const totalTolerance = viewport === 'desktop' ? 12 : 42;
  const widthTolerance = viewport === 'desktop' ? 2 : 8;
  const tagsGapTolerance = viewport === 'desktop' ? 6 : 10;
  const stageTolerance = viewport === 'desktop' ? 8 : 8;
  const modeTolerance = viewport === 'desktop' ? 8 : 10;
  const headlineGapTolerance = viewport === 'desktop' ? 8 : 10;
  const tickerTolerance = viewport === 'desktop' ? 8 : 10;

  notes.push(`${suffix}: window=${solution.rects.window.height}px vs ${resource.rects.window.height}px windowDelta=${windowDelta}px consoleDelta=${consoleDelta}px widthDelta=${widthDelta}px windowBar=${solution.rects.windowBar.height}px vs ${resource.rects.windowBar.height}px tagsToModebar=${solution.gaps.tagsToModebar}px vs ${resource.gaps.tagsToModebar}px chipsToModebar=${solution.gaps.chipsToModebar}px vs ${resource.gaps.chipsToModebar}px`);

  if (Math.abs(windowDelta) > totalTolerance) failures.push(`${suffix}: window height delta ${windowDelta}px exceeds ${totalTolerance}px`);
  if (Math.abs(consoleDelta) > totalTolerance) failures.push(`${suffix}: console height delta ${consoleDelta}px exceeds ${totalTolerance}px`);
  if (widthDelta > widthTolerance) failures.push(`${suffix}: window width delta ${widthDelta}px exceeds ${widthTolerance}px`);
  if (tagsGapDelta > tagsGapTolerance) failures.push(`${suffix}: chips-to-modebar gap is ${tagsGapDelta}px looser than Resources, exceeding ${tagsGapTolerance}px`);
  if (chipsGapDelta > tagsGapTolerance) failures.push(`${suffix}: chips content-to-modebar gap is ${chipsGapDelta}px looser than Resources, exceeding ${tagsGapTolerance}px`);
  if (solution.gaps.chipsToModebar < 12) failures.push(`${suffix}: chips content-to-modebar gap ${solution.gaps.chipsToModebar}px is below the 12px minimum rhythm`);

  const checks = [
    ['summary height', solution.rects.summary.height, resource.rects.summary.height, modeTolerance],
    ['window bar height', solution.rects.windowBar.height, resource.rects.windowBar.height, modeTolerance],
    ['chips block height', solution.rects.tagsContent.height, resource.rects.tagsContent.height, modeTolerance],
    ['modebar height', solution.rects.modebar.height, resource.rects.modebar.height, modeTolerance],
    ['modebar-to-title gap', solution.gaps.modebarToHeadline, resource.gaps.modebarToHeadline, headlineGapTolerance],
    ['title-to-stage gap', solution.gaps.headlineToStage, resource.gaps.headlineToStage, headlineGapTolerance],
    ['stage height', solution.rects.stage.height, resource.rects.stage.height, stageTolerance],
    ['stage-to-ticker gap', solution.gaps.stageToTicker, resource.gaps.stageToTicker, headlineGapTolerance],
    ['ticker height', solution.rects.ticker.height, resource.rects.ticker.height, tickerTolerance],
  ];

  for (const [label, actual, expected, tolerance] of checks) {
    const delta = round(actual - expected);
    notes.push(`${suffix}: ${label} ${actual}px vs ${expected}px delta=${delta}px`);
    if (Math.abs(delta) > tolerance) failures.push(`${suffix}: ${label} delta ${delta}px exceeds ${tolerance}px`);
  }

  if (solution.horizontalOverflow > 0) failures.push(`${suffix}: Solutions horizontal overflow ${solution.horizontalOverflow}px`);
  if (resource.horizontalOverflow > 0) failures.push(`${suffix}: Resources reference horizontal overflow ${resource.horizontalOverflow}px`);
  if (!solution.motion.animationName?.includes('topoDash')) failures.push(`${suffix}: Solutions topoDash motion missing`);
  if (!resource.motion.animationName?.includes('topoDash')) failures.push(`${suffix}: Resources topoDash motion missing`);

  return { failures, notes };
}

const browser = await chromium.launch({ headless: true, executablePath: chromeExecutablePath });
const page = await browser.newPage();
const samples = [];
const failures = [];
const notes = [];

for (const viewport of viewports) {
  for (const lang of langs) {
    const resource = await samplePage(page, 'resources', viewport, lang);
    const solution = await samplePage(page, 'solutions', viewport, lang);
    samples.push(resource, solution);
    const comparison = compareSamples(solution, resource);
    failures.push(...comparison.failures);
    notes.push(...comparison.notes);
  }
}

await browser.close();

const lines = [
  failures.length ? 'FAIL solutions/resources console geometry check' : 'PASS solutions/resources console geometry check',
  `Chrome: ${chromeExecutablePath}`,
  ...notes,
];

if (failures.length) {
  lines.push(...failures.map(failure => `- ${failure}`));
}

console.log(lines.join('\n'));
process.exit(failures.length ? 1 : 0);
