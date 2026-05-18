import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('../../playwright-local/node_modules/playwright');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'qa-evidence');
const chromeExecutablePath = process.env.CHROME_EXECUTABLE_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const routes = [
  ['en-doc-config', '#doc/config', 'en'],
  ['en-doc-ops', '#doc/ops', 'en'],
  ['en-category-ops-station', '#category/ops-station', 'en'],
  ['zh-doc-config', '#doc/config', 'zh'],
  ['hi-doc-config', '#doc/config', 'hi'],
];
const failures = [];
const evidence = {};
const browser = await chromium.launch({ executablePath: chromeExecutablePath, headless: true });

for (const [key, hash, lang] of routes) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 980 } });
  await context.addInitScript((value) => localStorage.setItem('sampora_lang', value), lang);
  const page = await context.newPage();
  await page.goto(pathToFileURL(path.join(root, 'resource-manuals.html')).href + hash, { waitUntil: 'load' });
  await page.waitForTimeout(250);
  evidence[key] = await page.evaluate(() => {
    const visible = selector => !document.querySelector(selector)?.classList.contains('hidden');
    const text = document.body.innerText;
    const buttons = Array.from(document.querySelectorAll('button, .btn, a')).map((item) => item.textContent.trim());
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
      docTitle: document.querySelector('#docTitle')?.textContent.trim() || '',
      categoryTitle: document.querySelector('#categoryTitle')?.textContent.trim() || '',
      heroTitle: document.querySelector('.hero h1')?.textContent.trim() || '',
      questionMarkCount: (text.match(/\?/g) || []).length,
      replacementCharCount: (text.match(/\uFFFD/g) || []).length,
      emptyButtonCount: buttons.filter((label) => !label).length,
      hasCjk: /[\u3400-\u9FFF]/.test(text),
      hasDevanagari: /[\u0900-\u097F]/.test(text),
    };
  });
  const item = evidence[key];
  if (item.questionMarkCount) failures.push(`${key}: rendered ${item.questionMarkCount} question mark(s)`);
  if (item.replacementCharCount) failures.push(`${key}: rendered replacement character(s)`);
  if (item.emptyButtonCount) failures.push(`${key}: rendered ${item.emptyButtonCount} empty button/link label(s)`);
  if (lang === 'zh' && !item.hasCjk) failures.push(`${key}: missing CJK text`);
  if (lang === 'hi' && !item.hasDevanagari) failures.push(`${key}: missing Devanagari text`);
  if (lang === 'hi' && /[\u3400-\u9FFF]/.test(item.docTitle + item.categoryTitle + item.heroTitle)) failures.push(`${key}: sampled title contains Chinese text`);
  await context.close();
}

await browser.close();
await fs.writeFile(path.join(outDir, 'resource-manuals-browser-language-evidence.json'), JSON.stringify({ failures, evidence }, null, 2));

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('resource manuals browser language check: OK');
