import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadChromium } from './playwright-loader.mjs';

const chromium = loadChromium();

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const url = pathToFileURL(path.join(root, 'about_sampora_issues_fixed.html')).href;
const chromeExecutablePath = process.env.CHROME_EXECUTABLE_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const failures = [];

const round = value => Math.round(value * 100) / 100;

function fail(message) {
  failures.push(message);
}

async function sample(page) {
  return page.evaluate(() => {
    const read = selector => {
      const el = document.querySelector(selector);
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return {
        top: Math.round(rect.top * 100) / 100,
        bottom: Math.round(rect.bottom * 100) / 100,
        height: Math.round(rect.height * 100) / 100,
      };
    };
    const status = document.querySelector('.status');
    return {
      scrollY: Math.round(window.scrollY * 100) / 100,
      compact: document.body.classList.contains('nav-condensed'),
      mast: read('.mast'),
      status: read('.status'),
      statusDisplay: status ? getComputedStyle(status).display : null,
      overflowX: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
    };
  });
}

async function checkDesktop(browser, width) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(250);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(100);

  const top = await sample(page);
  if (top.compact) fail(`${width}: top of page should not be compact`);
  if (!top.status || top.status.height < 30 || top.mast.top < 30) {
    fail(`${width}: top status/mast geometry unexpected ${JSON.stringify(top)}`);
  }

  await page.evaluate(() => window.scrollTo(0, 52));
  await page.waitForTimeout(100);

  const samples = [];
  let lastCompact = (await sample(page)).compact;
  let toggles = 0;
  for (let i = 0; i < 24; i += 1) {
    await page.mouse.wheel(0, 6);
    await page.waitForTimeout(45);
    const current = await sample(page);
    samples.push(current);
    if (current.compact !== lastCompact) {
      toggles += 1;
      lastCompact = current.compact;
    }
  }

  const finalSample = samples.at(-1);
  const compactSamples = samples.filter(item => item.compact);
  const nonCompactScrolledSamples = samples.filter(item => !item.compact && item.scrollY > 56);
  const compactGapSamples = compactSamples.filter(item => item.mast && Math.abs(item.mast.top) > 1.5);

  if (toggles > 2) fail(`${width}: sticky threshold jitter toggled ${toggles} times`);
  if (!finalSample?.compact) fail(`${width}: expected compact state after wheel sequence, got ${JSON.stringify(finalSample)}`);
  if (compactGapSamples.length) fail(`${width}: compact samples left mast gap ${JSON.stringify(compactGapSamples.slice(0, 3))}`);
  if (nonCompactScrolledSamples.length) fail(`${width}: non-compact samples remained above threshold ${JSON.stringify(nonCompactScrolledSamples.slice(0, 3))}`);
  if (finalSample && finalSample.overflowX > 0) fail(`${width}: horizontal overflow ${finalSample.overflowX}`);

  await page.close();
  return {
    width,
    top,
    toggles,
    final: finalSample,
    scrollYSeries: samples.map(item => round(item.scrollY)),
    compactSeries: samples.map(item => item.compact),
    mastTopSeries: samples.map(item => item.mast?.top ?? null),
  };
}

async function checkMobile(browser) {
  const page = await browser.newPage({ viewport: { width: 390, height: 900 } });
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(250);
  await page.evaluate(() => window.scrollTo(0, 180));
  await page.waitForTimeout(100);
  const mobile = await sample(page);
  if (mobile.compact) fail(`390: mobile should not use nav-condensed ${JSON.stringify(mobile)}`);
  if (mobile.statusDisplay !== 'none') fail(`390: status should be hidden ${JSON.stringify(mobile)}`);
  if (!mobile.mast || Math.abs(mobile.mast.top) > 1.5) fail(`390: mast should sit at top ${JSON.stringify(mobile)}`);
  if (mobile.overflowX > 0) fail(`390: horizontal overflow ${mobile.overflowX}`);
  await page.close();
  return mobile;
}

const browser = await chromium.launch({ headless: true, executablePath: chromeExecutablePath });
const evidence = {
  chromeExecutablePath,
  desktop1440: await checkDesktop(browser, 1440),
  desktop1314: await checkDesktop(browser, 1314),
  mobile390: await checkMobile(browser),
};
await browser.close();

console.log(JSON.stringify(evidence, null, 2));
if (failures.length) {
  console.error(`FAIL about sticky wheel jitter check:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log('PASS about sticky wheel jitter check');
