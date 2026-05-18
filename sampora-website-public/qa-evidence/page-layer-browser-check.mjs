import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('../../playwright-local/node_modules/playwright');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'qa-evidence');
const pages = ['index.html', 'solutions.html', 'resources.html', 'resource-manuals.html', 'plans.html', 'contact.html'];
const widths = [1440, 1536, 1920, 390];
const desktopWidths = [1440, 1536, 1920];
const failures = [];
const evidence = {
  generatedAt: new Date().toISOString(),
  chromeExecutablePath: null,
  nav: {},
  sticky: {},
  index: {},
  topology: {},
  plans: {},
  contact: {},
  resourceManuals: {},
  screenshots: [],
};

function fileUrl(file, hash = '') {
  return `${pathToFileURL(path.join(root, file)).href}${hash}`;
}

function rectDiff(a, b, keys) {
  return Math.max(...keys.map(key => Math.abs((a?.[key] ?? 0) - (b?.[key] ?? 0))));
}

function pushFailure(message) {
  failures.push(message);
}

async function sampleStickyNavAfterScroll(file) {
  await goto(file, 1440);
  if (file === 'plans.html' && await page.locator('.matrix-wrap').count()) {
    await page.locator('.matrix-wrap').scrollIntoViewIfNeeded();
  } else {
    await page.evaluate(() => {
      const targets = [
        'main section:nth-of-type(3)',
        'main section:nth-of-type(2)',
        'section:nth-of-type(3)',
        'section:nth-of-type(2)',
        'footer',
      ];
      const target = targets.map(selector => document.querySelector(selector)).find(Boolean);
      if (target) {
        target.scrollIntoView({ block: 'start' });
      } else {
        scrollTo(0, Math.max(240, document.body.scrollHeight * 0.65));
      }
    });
  }
  await page.waitForTimeout(180);

  const sample = await page.evaluate(() => {
    const round = value => Math.round(value * 100) / 100;
    const readRect = selector => {
      const el = document.querySelector(selector);
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return {
        x: round(rect.x),
        y: round(rect.y),
        width: round(rect.width),
        height: round(rect.height),
        bottom: round(rect.bottom),
      };
    };
    const mast = document.querySelector('.mast');
    const status = document.querySelector('.status');
    const mastRect = readRect('.mast');
    const statusRect = readRect('.status');
    const mastStyle = mast ? getComputedStyle(mast) : null;
    const statusHeight = statusRect?.height || 0;
    const visible = !!mastRect && mastRect.height > 0 && mastRect.bottom > 0 && mastRect.y < innerHeight;
    const yCloseToStatus = !!mastRect && mastRect.y >= -1 && mastRect.y <= statusHeight + 12;
    return {
      scrollY: round(scrollY),
      viewportHeight: innerHeight,
      mast: mastRect,
      status: statusRect,
      mastPosition: mastStyle?.position || null,
      statusPosition: status ? getComputedStyle(status).position : null,
      visible,
      yCloseToStatus,
    };
  });

  evidence.sticky[file] = sample;
  if (!sample.mast) {
    pushFailure(`${file}: sticky nav check could not find .mast after scroll`);
    return;
  }
  if (sample.mast.height <= 0) {
    pushFailure(`${file}: sticky nav .mast has non-positive height after scroll: ${JSON.stringify(sample)}`);
  }
  if (!sample.visible) {
    pushFailure(`${file}: sticky nav .mast is not visible after scroll: ${JSON.stringify(sample)}`);
  }
  if (sample.mastPosition !== 'sticky' && !sample.yCloseToStatus) {
    pushFailure(`${file}: sticky nav .mast is not sticky and is not close to status bar after scroll: ${JSON.stringify(sample)}`);
  }
}

const chromeExecutablePath = process.env.CHROME_EXECUTABLE_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
evidence.chromeExecutablePath = chromeExecutablePath;
const browser = await chromium.launch({ headless: true, executablePath: chromeExecutablePath });
const page = await browser.newPage();

async function goto(file, width, hash = '') {
  await page.setViewportSize({ width, height: width === 390 ? 900 : 980 });
  await page.goto(fileUrl(file, hash), { waitUntil: 'load' });
  await page.waitForTimeout(250);
}

for (const width of widths) {
  evidence.nav[width] = {};
  for (const file of pages) {
    await goto(file, width);
    const metrics = await page.evaluate(() => {
      const read = selector => {
        const el = document.querySelector(selector);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: Math.round(r.x * 100) / 100, y: Math.round(r.y * 100) / 100, width: Math.round(r.width * 100) / 100, height: Math.round(r.height * 100) / 100 };
      };
      const active = document.querySelector('.mast .nav a.active, .mast .nav-links a.active');
      const activeStyle = active ? getComputedStyle(active, '::after') : null;
      return {
        mast: read('.mast'),
        brand: read('.mast .brand'),
        nav: read('.mast .nav, .mast .nav-links'),
        actions: read('.mast .header-actions, .mast .nav-actions, .mast .actions'),
        active: read('.mast .nav a.active, .mast .nav-links a.active'),
        activeAfterWidth: activeStyle?.width || null,
        activeAfterBottom: activeStyle?.bottom || null,
        mobileToggleVisible: (() => {
          const toggle = document.querySelector('.mobile-nav-toggle');
          return !!toggle && getComputedStyle(toggle).display !== 'none';
        })(),
      };
    });
    metrics.gaps = {
      brandToNav: metrics.brand && metrics.nav ? Math.round((metrics.nav.x - (metrics.brand.x + metrics.brand.width)) * 100) / 100 : null,
      navToActions: metrics.nav && metrics.actions ? Math.round((metrics.actions.x - (metrics.nav.x + metrics.nav.width)) * 100) / 100 : null,
    };
    evidence.nav[width][file] = metrics;
    const screenshot = `nav-${width}-${file.replace('.html', '')}.png`;
    await page.screenshot({ path: path.join(outDir, screenshot), clip: { x: 0, y: 0, width, height: width === 390 ? 132 : 118 } });
    evidence.screenshots.push(screenshot);
    if (width === 390) {
      const smoke = `mobile-smoke-390-${file.replace('.html', '')}.png`;
      await page.screenshot({ path: path.join(outDir, smoke), fullPage: false });
      evidence.screenshots.push(smoke);
    }
  }

  if (desktopWidths.includes(width)) {
    const baseline = evidence.nav[width]['index.html'];
    for (const file of pages.slice(1)) {
      const current = evidence.nav[width][file];
      for (const key of ['mast', 'nav', 'actions']) {
        const maxDiff = rectDiff(baseline[key], current[key], ['x', 'y', 'width', 'height']);
        current[`${key}MaxDiffVsIndex`] = maxDiff;
        if (maxDiff > 2) pushFailure(`desktop nav ${key} mismatch at ${width}px for ${file}: ${maxDiff}px`);
      }
      current.gapDiffsVsIndex = {
        brandToNav: baseline.gaps.brandToNav === null || current.gaps.brandToNav === null ? null : Math.round(Math.abs(baseline.gaps.brandToNav - current.gaps.brandToNav) * 100) / 100,
        navToActions: baseline.gaps.navToActions === null || current.gaps.navToActions === null ? null : Math.round(Math.abs(baseline.gaps.navToActions - current.gaps.navToActions) * 100) / 100,
      };
      for (const [gap, diff] of Object.entries(current.gapDiffsVsIndex)) {
        if (diff !== null && diff > 2) pushFailure(`desktop nav ${gap} gap mismatch at ${width}px for ${file}: ${diff}px`);
      }
    }
  }
}

for (const file of pages) {
  await sampleStickyNavAfterScroll(file);
}

await goto('index.html', 1440);
evidence.index.hero = await page.evaluate(() => {
  const heroCopy = document.querySelector('.hero-copy');
  const after = heroCopy ? getComputedStyle(heroCopy, '::after') : null;
  const rect = selector => {
    const el = document.querySelector(selector);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { width: Math.round(r.width * 100) / 100, height: Math.round(r.height * 100) / 100 };
  };
  const svg = document.querySelector('.topo-svg');
  return {
    heroCopyAfterContent: after?.content,
    heroCopyAfterDisplay: after?.display,
    heroGrid: rect('.hero-grid'),
    console: rect('.console'),
    topoGrid: rect('.topo-grid'),
    svgViewBox: svg?.getAttribute('viewBox') || null,
  };
});
if (evidence.index.hero.heroCopyAfterContent !== 'none' || evidence.index.hero.heroCopyAfterDisplay !== 'none') {
  pushFailure('homepage hero-copy::after vertical line is still active');
}
await page.screenshot({ path: path.join(outDir, 'index-hero-1440.png'), fullPage: false });
evidence.screenshots.push('index-hero-1440.png');

await goto('index.html', 1440, '#workflow');
await page.locator('#workflow').scrollIntoViewIfNeeded();
await page.waitForTimeout(100);
evidence.index.workflow = [];
for (const delay of [0, 1000, 3000, 6000]) {
  if (delay) await page.waitForTimeout(delay - evidence.index.workflow.at(-1).delayMs);
  evidence.index.workflow.push(await page.evaluate(delayMs => ({
    delayMs,
    steps: [...document.querySelectorAll('#workflow .workflow-grid .step')].map(step => ({
      label: step.querySelector('.tag')?.textContent?.trim() || '',
      classes: step.className,
    })),
  }), delay));
}
const workflowLabels = new Set(evidence.index.workflow.flatMap(sample => sample.steps.filter(step => /relay-running|relay-receive/.test(step.classes)).map(step => step.label.toUpperCase())));
for (const label of ['STEP 01', 'STEP 02', 'STEP 03', 'STEP 04']) {
  if (!workflowLabels.has(label)) pushFailure(`workflow did not show active/receiving state for ${label} within 6s`);
}
await page.screenshot({ path: path.join(outDir, 'index-workflow-1440.png'), fullPage: false });
evidence.screenshots.push('index-workflow-1440.png');

for (const file of ['index.html', 'solutions.html', 'resources.html']) {
  await goto(file, 1440);
  evidence.topology[file] = [];
  for (const delay of [0, 1000, 3000, 6000]) {
    if (delay) await page.waitForTimeout(delay - evidence.topology[file].at(-1).delayMs);
    evidence.topology[file].push(await page.evaluate(delayMs => {
      const flow = document.querySelector('.topo-svg .flow.on, .topo-svg .flow-group.on .flow');
      const scan = document.querySelector('.topo-scan');
      const packet = document.querySelector('.topo-svg .packet.on');
      const flowStyle = flow ? getComputedStyle(flow) : null;
      const scanStyle = scan ? getComputedStyle(scan) : null;
      const packetStyle = packet ? getComputedStyle(packet) : null;
      return {
        delayMs,
        flowOnCount: document.querySelectorAll('.topo-svg .flow.on, .topo-svg .flow-group.on .flow').length,
        flowAnimationName: flowStyle?.animationName || null,
        flowStrokeDashoffset: flowStyle?.strokeDashoffset || null,
        scanAnimationName: scanStyle?.animationName || null,
        packetOnCount: document.querySelectorAll('.topo-svg .packet.on').length,
        packetOpacity: packetStyle?.opacity || null,
      };
    }, delay));
  }
  const latest = evidence.topology[file].at(-1);
  if (!latest.flowOnCount || latest.flowAnimationName === 'none') pushFailure(`${file}: topology flow animation not active`);
  if (latest.scanAnimationName !== 'topoScan') pushFailure(`${file}: topo scan animation is ${latest.scanAnimationName}`);
  if (file === 'solutions.html' && (!latest.packetOnCount || Number(latest.packetOpacity) <= 0)) pushFailure('solutions.html: packet.on is not visible');
  const screenshot = `topology-${file.replace('.html', '')}-1440.png`;
  await page.screenshot({ path: path.join(outDir, screenshot), fullPage: false });
  evidence.screenshots.push(screenshot);
}

await goto('plans.html', 1440);
const hasMatrixWrap = await page.locator('.matrix-wrap').count();
if (hasMatrixWrap) {
  await page.locator('.matrix-wrap').scrollIntoViewIfNeeded();
} else {
  pushFailure('plans matrix DOM is missing: .matrix-wrap / #matrixTable not found after plans.html load');
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight * 0.55));
}
await page.waitForTimeout(100);
evidence.plans.matrix = await page.evaluate(() => {
  const wrap = document.querySelector('.matrix-wrap');
  const table = document.querySelector('#matrixTable');
  const th = document.querySelector('#matrixTable th');
  const td = document.querySelector('#matrixTable td');
  const wr = wrap?.getBoundingClientRect();
  const tr = table?.getBoundingClientRect();
  const thStyle = th ? getComputedStyle(th) : null;
  const tdStyle = td ? getComputedStyle(td) : null;
  return {
    wrapWidth: Math.round((wr?.width || 0) * 100) / 100,
    tableWidth: Math.round((tr?.width || 0) * 100) / 100,
    thPadding: thStyle ? `${thStyle.paddingTop} ${thStyle.paddingRight}` : null,
    tdPadding: tdStyle ? `${tdStyle.paddingTop} ${tdStyle.paddingRight}` : null,
    thFontSize: thStyle?.fontSize || null,
    tdFontSize: tdStyle?.fontSize || null,
  };
});
if (!evidence.plans.matrix.wrapWidth || !evidence.plans.matrix.tableWidth) {
  pushFailure(`plans matrix missing measurable wrap/table: ${JSON.stringify(evidence.plans.matrix)}`);
} else if (evidence.plans.matrix.wrapWidth < 1200 || evidence.plans.matrix.tableWidth < 960) {
  pushFailure(`plans matrix too narrow: ${JSON.stringify(evidence.plans.matrix)}`);
}
await page.screenshot({ path: path.join(outDir, 'plans-matrix-1440.png'), fullPage: false });
evidence.screenshots.push('plans-matrix-1440.png');

await goto('contact.html', 1440, '#contact-form');
await page.locator('#contact-form').scrollIntoViewIfNeeded();
await page.waitForTimeout(100);
evidence.contact.initial = await page.evaluate(() => {
  const submit = document.querySelector('#contactForm button[type="submit"]');
  const form = document.querySelector('#contactForm');
  const fields = ['name', 'email', 'company', 'role', 'business_type', 'message'];
  const hiddenFields = ['intent', 'source_page', 'source_section', 'plan', 'lang'];
  const fieldDetails = Object.fromEntries(fields.map((name) => {
    const control = form?.querySelector(`#${CSS.escape(name)}[name="${name}"]`) || null;
    return [name, {
      present: !!control,
      required: !!control?.required,
      tagName: control?.tagName.toLowerCase() || null,
      type: control?.getAttribute('type') || null,
    }];
  }));
  const hiddenFieldDetails = Object.fromEntries(hiddenFields.map((name) => {
    const control = form?.querySelector(`input[type="hidden"][name="${name}"]`) || null;
    return [name, {
      present: !!control,
      value: control?.value ?? null,
    }];
  }));
  return {
    submitText: submit?.textContent.trim() || null,
    containsFalseSendInquiry: /send inquiry/i.test(document.body.innerText),
    method: form?.getAttribute('method') || null,
    action: form?.getAttribute('action') || null,
    endpoint: form?.dataset.endpoint || null,
    fieldDetails,
    hiddenFieldDetails,
    fieldsPresent: fields.every((name) => !!fieldDetails[name].present),
    hiddenFieldsPresent: hiddenFields.every((name) => !!hiddenFieldDetails[name].present),
    hasPendingStorageCode: [...document.scripts].some(s => s.textContent.includes('sampora_contact_pending')),
    hasBackendPlaceholderCheck: [...document.scripts].some(s => s.textContent.includes('[BACKEND_CONTACT_ENDPOINT]') && s.textContent.includes('fetch(')),
  };
});
if (evidence.contact.initial.submitText !== 'Submit request') pushFailure(`contact submit text is not Submit request: ${evidence.contact.initial.submitText}`);
if (evidence.contact.initial.containsFalseSendInquiry) pushFailure('contact page still contains false "Send inquiry" copy');
if (evidence.contact.initial.method !== 'post' || evidence.contact.initial.action !== '[BACKEND_CONTACT_ENDPOINT]' || evidence.contact.initial.endpoint !== '[BACKEND_CONTACT_ENDPOINT]') {
  pushFailure(`contact backend placeholder structure missing: ${JSON.stringify(evidence.contact.initial)}`);
}
if (!evidence.contact.initial.fieldsPresent || !evidence.contact.initial.hiddenFieldsPresent || !evidence.contact.initial.hasPendingStorageCode || !evidence.contact.initial.hasBackendPlaceholderCheck) {
  pushFailure(`contact backend-ready fields or placeholder behavior missing: ${JSON.stringify(evidence.contact.initial)}`);
}
const contactRequests = [];
page.on('request', request => {
  if (request.url().includes('[BACKEND_CONTACT_ENDPOINT]')) {
    contactRequests.push({
      url: request.url(),
      method: request.method(),
      postData: request.postData(),
    });
  }
});
await page.fill('#name', 'QA Reviewer');
await page.fill('#company', 'QA Evidence Co');
await page.fill('#email', 'qa@example.com');
await page.selectOption('#role', 'Sample Supplier');
await page.selectOption('#business_type', 'contact_sales');
await page.fill('#message', 'QA evidence backend placeholder check.');
try {
  await page.click('#contactForm button[type="submit"]');
  await page.waitForTimeout(500);
} catch (error) {
  evidence.contact.submitError = error.message;
}
evidence.contact.afterSubmit = await page.evaluate(() => {
  const storedPending = sessionStorage.getItem('sampora_contact_pending');
  const params = storedPending ? Object.fromEntries(new URLSearchParams(storedPending)) : {};
  return {
    url: location.href,
    storedPending,
    pendingParams: params,
    toastVisible: document.querySelector('#toast')?.classList.contains('show') || false,
  };
});
evidence.contact.submitRequests = contactRequests;
const expectedPending = {
  name: 'QA Reviewer',
  company: 'QA Evidence Co',
  email: 'qa@example.com',
  role: 'Sample Supplier',
  business_type: 'contact_sales',
  message: 'QA evidence backend placeholder check.',
  intent: 'contact_sales',
  source_page: 'contact.html',
  source_section: 'contact-form',
  plan: 'contact_sales',
  lang: 'en',
};
const pendingMismatches = Object.entries(expectedPending).filter(([key, value]) => evidence.contact.afterSubmit.pendingParams?.[key] !== value);
if (!evidence.contact.afterSubmit.storedPending || pendingMismatches.length) {
  pushFailure(`contact submit did not store backend-ready pending payload in sessionStorage: ${JSON.stringify({ pendingMismatches, afterSubmit: evidence.contact.afterSubmit })}`);
}
if (!evidence.contact.afterSubmit.toastVisible) pushFailure('contact placeholder submit did not show pending toast');
if (evidence.contact.submitRequests.length) pushFailure(`contact placeholder submit attempted backend request: ${JSON.stringify(evidence.contact.submitRequests)}`);
await page.screenshot({ path: path.join(outDir, 'contact-form-1440.png'), fullPage: false });
evidence.screenshots.push('contact-form-1440.png');

const manualRoutes = [
  ['resource-manuals.html', '#doc/config', 'en'],
  ['resource-manuals.html', '#doc/ops', 'en'],
  ['resource-manuals.html', '#category/ops-station', 'en'],
  ['resource-manuals.html', '#doc/config', 'zh'],
  ['resource-manuals.html', '#doc/config', 'hi'],
];
for (const [file, hash, targetLang] of manualRoutes) {
  await page.setViewportSize({ width: 1440, height: 980 });
  await page.goto(fileUrl(file), { waitUntil: 'load' });
  await page.evaluate(lang => localStorage.setItem('sampora_lang', lang), targetLang);
  await page.goto(fileUrl(file, hash), { waitUntil: 'load' });
  await page.waitForTimeout(350);
  const key = `${targetLang}-${hash.slice(1).replace('/', '-')}`;
  evidence.resourceManuals[key] = await page.evaluate(() => {
    const visible = selector => !document.querySelector(selector)?.classList.contains('hidden');
    const text = document.body.innerText;
    return {
      hash: location.hash,
      htmlLang: document.documentElement.lang,
      visibleViews: {
        home: visible('#viewHome'),
        doc: visible('#viewDoc'),
        category: visible('#viewCategory'),
        article: visible('#viewArticle'),
        search: visible('#viewSearch'),
      },
      title: document.querySelector('#docTitle, #categoryTitle, #readerTitle, .hero h1')?.textContent.trim() || null,
      questionMarkCount: (text.match(/\?/g) || []).length,
      replacementCharCount: (text.match(/\uFFFD/g) || []).length,
      sampleQuestionText: text.split('\n').filter(line => line.includes('?')).slice(0, 8),
    };
  });
  if (targetLang === 'en' && evidence.resourceManuals[key].visibleViews.home) pushFailure(`resource manuals route did not open target view for ${hash}`);
  if (['zh', 'hi'].includes(targetLang) && evidence.resourceManuals[key].questionMarkCount > 0) {
    pushFailure(`resource manuals ${targetLang} rendered ${evidence.resourceManuals[key].questionMarkCount} question-mark placeholder(s)`);
  }
  const screenshot = `resource-manuals-${key}-1440.png`;
  await page.screenshot({ path: path.join(outDir, screenshot), fullPage: false });
  evidence.screenshots.push(screenshot);
}

await browser.close();

evidence.failures = failures;
await fs.writeFile(path.join(outDir, 'page-layer-browser-evidence.json'), JSON.stringify(evidence, null, 2));
console.log(JSON.stringify({
  status: failures.length ? 'FAIL' : 'PASS',
  failures,
  evidence: 'qa-evidence/page-layer-browser-evidence.json',
  screenshots: evidence.screenshots.length,
}, null, 2));
process.exitCode = failures.length ? 1 : 0;
