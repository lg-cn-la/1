import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadChromium } from './playwright-loader.mjs';

const chromium = loadChromium();

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const chromeExecutablePath = process.env.CHROME_EXECUTABLE_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const langs = ['en', 'zh'];
const viewports = [
  { name: 'desktop', width: 1440, height: 900, enforceBalance: true },
  { name: 'mobile', width: 390, height: 900, enforceBalance: false },
];

const round = value => Math.round((Number(value) || 0) * 100) / 100;
const fileUrl = file => pathToFileURL(path.join(root, file)).href;

async function setLanguage(page, lang) {
  await page.evaluate(nextLang => localStorage.setItem('sampora_lang', nextLang), lang);
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(250);
  await page.locator(`.mast .lang button[data-lang="${lang}"], .mast [data-lang-btn="${lang}"]`).first().click({ timeout: 900 }).catch(() => {});
  await page.waitForTimeout(180);
}

const browser = await chromium.launch({ headless: true, executablePath: chromeExecutablePath });
const page = await browser.newPage();
const failures = [];
const samples = [];

for (const viewport of viewports) {
  await page.setViewportSize({ width: viewport.width, height: viewport.height });

  for (const lang of langs) {
    await page.goto(fileUrl('resources.html'), { waitUntil: 'load' });
    await setLanguage(page, lang);
    await page.evaluate(() => document.querySelector('.topo-headline')?.scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(260);

    const beforeMotion = await page.evaluate(() => {
      const flow = document.querySelector('.topo-svg .flow.on, .topo-svg .flow-group.on .flow');
      const packet = document.querySelector('.topo-svg .packet.on, .topo-svg .packet-group.on .packet');
      const packetRect = packet?.getBoundingClientRect();
      return {
        dashOffset: flow ? getComputedStyle(flow).strokeDashoffset : null,
        packetCenter: packetRect ? {
          x: Math.round((packetRect.left + packetRect.width / 2) * 100) / 100,
          y: Math.round((packetRect.top + packetRect.height / 2) * 100) / 100,
        } : null,
      };
    });

    await page.waitForTimeout(720);

    const sample = await page.evaluate(({ viewport, lang, beforeMotion }) => {
      const rect = selector => {
        const el = document.querySelector(selector);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          top: Math.round(r.top * 100) / 100,
          bottom: Math.round(r.bottom * 100) / 100,
          left: Math.round(r.left * 100) / 100,
          right: Math.round(r.right * 100) / 100,
          width: Math.round(r.width * 100) / 100,
          height: Math.round(r.height * 100) / 100,
        };
      };
      const headline = rect('.topo-headline');
      const stage = rect('.topo-stage');
      const ticker = rect('.console-ticker');
      const flow = document.querySelector('.topo-svg .flow.on, .topo-svg .flow-group.on .flow');
      const packet = document.querySelector('.topo-svg .packet.on, .topo-svg .packet-group.on .packet');
      const packetRect = packet?.getBoundingClientRect();
      const packetCenter = packetRect ? {
        x: Math.round((packetRect.left + packetRect.width / 2) * 100) / 100,
        y: Math.round((packetRect.top + packetRect.height / 2) * 100) / 100,
      } : null;
      const flowStyle = flow ? getComputedStyle(flow) : null;
      const topGap = headline && stage ? Math.round((stage.top - headline.bottom) * 100) / 100 : null;
      const bottomGap = stage && ticker ? Math.round((ticker.top - stage.bottom) * 100) / 100 : null;
      const delta = topGap != null && bottomGap != null ? Math.round(Math.abs(topGap - bottomGap) * 100) / 100 : null;
      const horizontalOverflow = Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth);
      const dashAfter = flowStyle?.strokeDashoffset || null;
      const dashChanged = beforeMotion.dashOffset != null && dashAfter != null && beforeMotion.dashOffset !== dashAfter;
      const packetMoved = !!beforeMotion.packetCenter && !!packetCenter
        && (Math.abs(beforeMotion.packetCenter.x - packetCenter.x) > .5 || Math.abs(beforeMotion.packetCenter.y - packetCenter.y) > .5);

      return {
        lang,
        viewport: viewport.name,
        width: viewport.width,
        headline,
        stage,
        ticker,
        topGap,
        bottomGap,
        delta,
        horizontalOverflow,
        overlap: !!(headline && stage && ticker) && (stage.top < headline.bottom || ticker.top < stage.bottom),
        motion: {
          animationName: flowStyle?.animationName || null,
          animationDuration: flowStyle?.animationDuration || null,
          dashBefore: beforeMotion.dashOffset,
          dashAfter,
          dashChanged,
          packetBefore: beforeMotion.packetCenter,
          packetAfter: packetCenter,
          packetMoved,
        },
      };
    }, { viewport, lang, beforeMotion });

    samples.push(sample);
    if (sample.horizontalOverflow > 0) failures.push(`${lang}/${viewport.name}: horizontal overflow ${sample.horizontalOverflow}px`);
    if (sample.overlap) failures.push(`${lang}/${viewport.name}: headline/stage/ticker overlap detected`);
    if (viewport.enforceBalance && (sample.delta == null || sample.delta > 2)) {
      failures.push(`${lang}/${viewport.name}: spacing delta ${sample.delta}px exceeds 2px (top ${sample.topGap}px, bottom ${sample.bottomGap}px)`);
    }
    const motionOk = sample.motion.animationName?.includes('topoDash') && (sample.motion.dashChanged || sample.motion.packetMoved);
    if (!motionOk) failures.push(`${lang}/${viewport.name}: topoDash motion guard failed`);
  }
}

await browser.close();

const lines = [
  failures.length ? 'FAIL resources topology spacing check' : 'PASS resources topology spacing check',
  `Chrome: ${chromeExecutablePath}`,
  ...samples.map(sample => `${sample.lang}/${sample.viewport}: topGap=${round(sample.topGap)} bottomGap=${round(sample.bottomGap)} delta=${round(sample.delta)} overflow=${sample.horizontalOverflow} stageH=${round(sample.stage?.height)} motion=${sample.motion.animationName}/${sample.motion.animationDuration} dashChanged=${sample.motion.dashChanged} packetMoved=${sample.motion.packetMoved}`),
];

if (failures.length) {
  lines.push(...failures.map(failure => `- ${failure}`));
}

console.log(lines.join('\n'));
process.exit(failures.length ? 1 : 0);
