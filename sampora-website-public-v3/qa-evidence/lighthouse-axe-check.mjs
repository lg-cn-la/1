import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { createReadStream } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'qa-evidence');

function createQaRequire() {
  const candidates = [
    createRequire(import.meta.url),
    createRequire(path.join(root, '..', 'playwright-local', 'package.json')),
  ];
  const requiredModules = ['playwright', '@axe-core/playwright', 'lighthouse', 'chrome-launcher'];

  for (const candidate of candidates) {
    try {
      for (const moduleName of requiredModules) candidate.resolve(moduleName);
      return candidate;
    } catch {
      // try next candidate
    }
  }

  throw new Error(
    'Missing QA dependencies. Install playwright, @axe-core/playwright, lighthouse, and chrome-launcher in the package root, or keep the legacy ../playwright-local tool directory.'
  );
}

const toolRequire = createQaRequire();
const { chromium } = toolRequire('playwright');
const { AxeBuilder } = toolRequire('@axe-core/playwright');
const lighthouse = (await import(pathToFileURL(toolRequire.resolve('lighthouse')).href)).default;
const chromeLauncher = await import(pathToFileURL(toolRequire.resolve('chrome-launcher')).href);

const pages = ['index.html', 'solutions.html', 'resources.html', 'resource-manuals.html', 'plans.html', 'contact.html', 'about.html'];
const chromeExecutablePath = process.env.CHROME_EXECUTABLE_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

function startServer() {
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url || '/', 'http://127.0.0.1');
      const pathname = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
      const absolute = path.resolve(root, `.${pathname}`);
      if (!absolute.startsWith(root)) {
        res.writeHead(403).end('Forbidden');
        return;
      }
      const stat = await fs.stat(absolute);
      if (!stat.isFile()) {
        res.writeHead(404).end('Not found');
        return;
      }
      res.writeHead(200, {
        'content-type': mime[path.extname(absolute).toLowerCase()] || 'application/octet-stream',
        'cache-control': 'no-store',
      });
      createReadStream(absolute).pipe(res);
    } catch {
      res.writeHead(404).end('Not found');
    }
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

const server = await startServer();
const baseUrl = `http://127.0.0.1:${server.address().port}`;

const lighthouseSummary = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  chromeExecutablePath,
  pages: {},
};
let chrome;
try {
  chrome = await chromeLauncher.launch({
    chromePath: chromeExecutablePath,
    chromeFlags: ['--headless=new', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage'],
  });
  for (const page of pages) {
    const result = await lighthouse(`${baseUrl}/${page}`, {
      port: chrome.port,
      output: 'json',
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      formFactor: 'desktop',
      screenEmulation: { disabled: true },
      throttlingMethod: 'provided',
    });
    const lhr = result.lhr;
    const file = `lighthouse-${page.replace('.html', '')}.json`;
    await fs.writeFile(path.join(outDir, file), JSON.stringify(lhr, null, 2));
    lighthouseSummary.pages[page] = {
      url: `${baseUrl}/${page}`,
      artifact: file,
      categories: Object.fromEntries(Object.entries(lhr.categories).map(([key, value]) => [key, value.score])),
      finalUrl: lhr.finalDisplayedUrl || lhr.finalUrl,
      runtimeError: lhr.runtimeError || null,
    };
  }
} finally {
  if (chrome) {
    try {
      await chrome.kill();
    } catch (error) {
      lighthouseSummary.chromeCleanupWarning = error.message;
    }
  }
}
await fs.writeFile(path.join(outDir, 'lighthouse-output.json'), JSON.stringify(lighthouseSummary, null, 2));

const axeSummary = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  chromeExecutablePath,
  pages: {},
  violationCount: 0,
};
const browser = await chromium.launch({ headless: true, executablePath: chromeExecutablePath });
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  for (const file of pages) {
    await page.goto(`${baseUrl}/${file}`, { waitUntil: 'load' });
    await page.waitForTimeout(300);
    const result = await new AxeBuilder({ page }).analyze();
    axeSummary.pages[file] = {
      url: `${baseUrl}/${file}`,
      violations: result.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        description: violation.description,
        help: violation.help,
        helpUrl: violation.helpUrl,
        nodes: violation.nodes.map((node) => ({
          target: node.target,
          failureSummary: node.failureSummary,
        })),
      })),
      passes: result.passes.length,
      incomplete: result.incomplete.length,
    };
    axeSummary.violationCount += result.violations.length;
  }
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
axeSummary.blockingViolationCount = Object.values(axeSummary.pages)
  .flatMap((page) => page.violations)
  .filter((violation) => ['serious', 'critical'].includes(violation.impact)).length;
await fs.writeFile(path.join(outDir, 'axe-output.json'), JSON.stringify(axeSummary, null, 2));

console.log(JSON.stringify({
  status: axeSummary.blockingViolationCount ? 'FAIL' : 'PASS',
  lighthouse: 'qa-evidence/lighthouse-output.json',
  axe: 'qa-evidence/axe-output.json',
  axeViolationCount: axeSummary.violationCount,
  axeBlockingViolationCount: axeSummary.blockingViolationCount,
}, null, 2));
process.exitCode = axeSummary.blockingViolationCount ? 1 : 0;
process.exit(process.exitCode);
