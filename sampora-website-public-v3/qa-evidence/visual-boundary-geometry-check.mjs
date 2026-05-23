import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('../../playwright-local/node_modules/playwright');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const chromeExecutablePath = process.env.CHROME_EXECUTABLE_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const langs = ['en', 'zh', 'hi'];
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 900 },
];
const surfaces = [
  {
    id: 'plans-footer',
    label: 'Plans footer',
    file: 'plans.html',
    selectors: ['#plan-fit-cta', '#footer'],
    pairs: [['#plan-fit-cta', '#footer']],
  },
  {
    id: 'about-what-timeline',
    label: 'About #what / #timeline',
    file: 'about_sampora_issues_fixed.html',
    selectors: ['#what', '#timeline'],
    pairs: [['#what', '#timeline']],
  },
  {
    id: 'solutions-compare-workflow',
    label: 'Solutions #compare / #workflow',
    file: 'solutions.html',
    selectors: ['#compare', '#workflow'],
    pairs: [['#compare', '#workflow']],
  },
  {
    id: 'solutions-footer',
    label: 'Solutions footer',
    file: 'solutions.html',
    selectors: ['#workflow', '#footer'],
    pairs: [['#workflow', '#footer']],
  },
  {
    id: 'contact-hero-form',
    label: 'Contact hero / form',
    file: 'contact.html',
    selectors: ['.hero', '#contact-form'],
    pairs: [['.hero', '#contact-form']],
  },
  {
    id: 'contact-footer',
    label: 'Contact footer',
    file: 'contact.html',
    selectors: ['.more-ways', '#footer'],
    pairs: [['.more-ways', '#footer']],
  },
];

const args = new Set(process.argv.slice(2));
const textMode = args.has('--text');
const writeIndex = process.argv.indexOf('--write-json');
const jsonOut = writeIndex >= 0
  ? (process.argv[writeIndex + 1] && !process.argv[writeIndex + 1].startsWith('--')
    ? process.argv[writeIndex + 1]
    : path.join(root, 'qa-evidence', 'visual-boundary-geometry-evidence.json'))
  : null;

function fileUrl(file) {
  return pathToFileURL(path.join(root, file)).href;
}

function round(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

async function setLanguage(page, lang) {
  await page.evaluate(nextLang => localStorage.setItem('sampora_lang', nextLang), lang);
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(250);
  await page.locator(`.mast .lang button[data-lang="${lang}"], .mast [data-lang-btn="${lang}"]`).first().click({ timeout: 900 }).catch(() => {});
  await page.waitForTimeout(200);
}

function formatText(report) {
  const lines = [
    `${report.status} visual boundary geometry check`,
    `Chrome: ${report.chromeExecutablePath}`,
  ];
  for (const surface of report.surfaces) {
    lines.push(`${surface.status} ${surface.id} (${surface.file})`);
    for (const item of surface.findings) {
      lines.push(`- ${item.severity} ${item.lang}/${item.viewport}: ${item.message}`);
    }
  }
  return lines.join('\n');
}

const browser = await chromium.launch({ headless: true, executablePath: chromeExecutablePath });
const page = await browser.newPage();
const findings = [];
const surfaceReports = [];

for (const surface of surfaces) {
  const samples = [];
  const surfaceFindings = [];

  for (const viewport of viewports) {
    for (const lang of langs) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(fileUrl(surface.file), { waitUntil: 'load' });
      await setLanguage(page, lang);
      await page.evaluate(firstSelector => document.querySelector(firstSelector)?.scrollIntoView({ block: 'center' }), surface.selectors[0]);
      await page.waitForTimeout(120);

      const sample = await page.evaluate(({ selectors, pairs }) => {
        const parsePx = value => {
          const parsed = Number.parseFloat(value);
          return Number.isFinite(parsed) ? parsed : 0;
        };
        const roundInPage = value => Math.round((Number(value) || 0) * 100) / 100;
        const maxAlpha = cssText => {
          if (!cssText || cssText === 'none') return 0;
          const lower = cssText.toLowerCase();
          if (lower.includes('transparent')) return 0;
          let max = 0;
          for (const match of lower.matchAll(/rgba?\(([^)]+)\)/g)) {
            const parts = match[1].split(/[,\s/]+/).filter(Boolean);
            const alpha = match[0].startsWith('rgba') || parts.length >= 4 ? Number.parseFloat(parts.at(-1)) : 1;
            if (Number.isFinite(alpha)) max = Math.max(max, alpha);
          }
          return max;
        };
        const rectFor = el => {
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          return {
            top: roundInPage(rect.top),
            bottom: roundInPage(rect.bottom),
            left: roundInPage(rect.left),
            right: roundInPage(rect.right),
            width: roundInPage(rect.width),
            height: roundInPage(rect.height),
          };
        };
        const pseudoFor = (el, name) => {
          if (!el) return null;
          const style = getComputedStyle(el, name);
          const alpha = Math.max(maxAlpha(style.backgroundColor), maxAlpha(style.backgroundImage));
          const height = parsePx(style.height);
          const active = !['none', 'normal', ''].includes(style.content)
            && style.display !== 'none'
            && style.visibility !== 'hidden'
            && Number(style.opacity || 1) > 0.01;
          return {
            active,
            content: style.content,
            display: style.display,
            position: style.position,
            height: roundInPage(height),
            opacity: roundInPage(style.opacity),
            backgroundColor: style.backgroundColor,
            backgroundImage: style.backgroundImage,
            maxBackgroundAlpha: roundInPage(alpha),
            largeSolidOverlay: active && height > 24 && alpha >= 0.9,
            softTransitionCandidate: active && height >= 8 && height <= 180 && alpha < 0.9 && /gradient|transparent|rgba/i.test(`${style.backgroundColor} ${style.backgroundImage}`),
          };
        };
        const nodeFor = selector => {
          const el = document.querySelector(selector);
          if (!el) return null;
          const style = getComputedStyle(el);
          return {
            selector,
            rect: rectFor(el),
            className: el.className || '',
            backgroundColor: style.backgroundColor,
            backgroundImage: style.backgroundImage,
            maxBackgroundAlpha: roundInPage(Math.max(maxAlpha(style.backgroundColor), maxAlpha(style.backgroundImage))),
            softTransitionCandidate: /gradient/i.test(style.backgroundImage)
              && /transparent|rgba/i.test(style.backgroundImage)
              && maxAlpha(style.backgroundImage) < 0.9,
            borderTopWidth: style.borderTopWidth,
            borderTopColor: style.borderTopColor,
            before: pseudoFor(el, '::before'),
            after: pseudoFor(el, '::after'),
          };
        };
        const nodes = Object.fromEntries(selectors.map(selector => [selector, nodeFor(selector)]));
        const boundaryPairs = pairs.map(([fromSelector, toSelector]) => {
          const from = nodes[fromSelector];
          const to = nodes[toSelector];
          const gap = from?.rect && to?.rect ? roundInPage(to.rect.top - from.rect.bottom) : null;
          const changedBackground = !!from && !!to
            && `${from.backgroundColor}|${from.backgroundImage}` !== `${to.backgroundColor}|${to.backgroundImage}`;
          const hasSoftTransition = !!(
            from?.softTransitionCandidate
            || to?.softTransitionCandidate
            || from?.after?.softTransitionCandidate
            || to?.before?.softTransitionCandidate
          );
          const hardBackgroundChange = changedBackground
            && gap !== null
            && gap >= -12
            && gap <= 16
            && !hasSoftTransition
            && Math.max(from.maxBackgroundAlpha, to.maxBackgroundAlpha) >= 0.85;
          return {
            from: fromSelector,
            to: toSelector,
            gap,
            changedBackground,
            hasSoftTransition,
            hardBackgroundChange,
            fromBackgroundAlpha: from?.maxBackgroundAlpha ?? null,
            toBackgroundAlpha: to?.maxBackgroundAlpha ?? null,
          };
        });
        return {
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          overflowX: Math.max(0, document.documentElement.scrollWidth - window.innerWidth, document.body.scrollWidth - window.innerWidth),
          nodes,
          boundaryPairs,
        };
      }, { selectors: surface.selectors, pairs: surface.pairs });

      const context = { surface: surface.id, file: surface.file, lang, viewport: viewport.name };
      samples.push({ ...context, width: viewport.width, height: viewport.height, sample });

      if (sample.overflowX > 1) {
        surfaceFindings.push({ ...context, severity: 'FAIL', message: `horizontal overflow ${round(sample.overflowX)}px` });
      }
      for (const [selector, node] of Object.entries(sample.nodes)) {
        if (!node) {
          surfaceFindings.push({ ...context, severity: 'FAIL', message: `missing selector ${selector}` });
          continue;
        }
        if (node.maxBackgroundAlpha >= 0.85 && !/transparent/i.test(`${node.backgroundColor} ${node.backgroundImage}`)) {
          surfaceFindings.push({
            ...context,
            severity: 'FAIL',
            message: `${selector} has near-solid background alpha ${node.maxBackgroundAlpha}`,
          });
        }
        if (selector === '#footer' && node.maxBackgroundAlpha > 0.02 && !/^rgba?\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\)$/i.test(node.backgroundColor)) {
          surfaceFindings.push({
            ...context,
            severity: 'FAIL',
            message: `${selector} outer background contributes a full-width band alpha ${node.maxBackgroundAlpha}`,
          });
        }
        for (const pseudoName of ['before', 'after']) {
          const pseudo = node[pseudoName];
          if (selector === '#footer' && pseudo?.active && pseudo.height > 24 && pseudo.maxBackgroundAlpha > 0.01) {
            surfaceFindings.push({
              ...context,
              severity: 'FAIL',
              message: `${selector}::${pseudoName} contributes a full-width footer band alpha ${pseudo.maxBackgroundAlpha} at ${pseudo.height}px height`,
            });
          }
          if (pseudo?.largeSolidOverlay) {
            surfaceFindings.push({
              ...context,
              severity: 'FAIL',
              message: `${selector}::${pseudoName} has near-solid boundary overlay alpha ${pseudo.maxBackgroundAlpha} at ${pseudo.height}px height`,
            });
          }
        }
      }
      for (const pair of sample.boundaryPairs) {
        const maxGap = viewport.width <= 480 ? 72 : 96;
        if (pair.gap !== null && pair.gap > maxGap) {
          surfaceFindings.push({ ...context, severity: 'FAIL', message: `${pair.from} -> ${pair.to} boundary gap ${pair.gap}px exceeds ${maxGap}px` });
        }
        if (pair.hardBackgroundChange) {
          surfaceFindings.push({
            ...context,
            severity: 'FAIL',
            message: `${pair.from} -> ${pair.to} has a hard high-alpha background change without a soft transition`,
          });
        } else if (pair.changedBackground && !pair.hasSoftTransition && pair.gap !== null && pair.gap >= -12 && pair.gap <= 16) {
          surfaceFindings.push({
            ...context,
            severity: 'WARN',
            message: `${pair.from} -> ${pair.to} background changes at the boundary; human visual review must confirm it is not a hard band`,
          });
        }
      }
    }
  }

  findings.push(...surfaceFindings);
  surfaceReports.push({
    id: surface.id,
    label: surface.label,
    file: surface.file,
    status: surfaceFindings.some(item => item.severity === 'FAIL') ? 'FAIL' : surfaceFindings.length ? 'WARN' : 'PASS',
    findings: surfaceFindings,
    samples,
  });
}

await browser.close();

const report = {
  status: findings.some(item => item.severity === 'FAIL') ? 'FAIL' : findings.length ? 'WARN' : 'PASS',
  generatedAt: new Date().toISOString(),
  chromeExecutablePath,
  note: 'Auxiliary geometry guard only. It does not replace screenshots or real visual perception review.',
  surfaces: surfaceReports,
};

if (jsonOut) {
  await fs.writeFile(path.resolve(jsonOut), JSON.stringify(report, null, 2));
}

console.log(textMode ? formatText(report) : JSON.stringify(report, null, 2));
process.exitCode = report.status === 'FAIL' ? 1 : 0;
