import fs from 'node:fs';
import vm from 'node:vm';

const dataPath = new URL('../assets/resource-manuals/data.js', import.meta.url);
const appPath = new URL('../assets/resource-manuals/app.js', import.meta.url);
const context = { window: {} };

vm.runInNewContext(fs.readFileSync(dataPath, 'utf8'), context, { filename: dataPath.pathname });

const languages = new Set(['en', 'zh']);
const failures = [];

function hasLanguageKeys(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  return Object.keys(value).some((key) => languages.has(key));
}

function visit(value, path = 'root', activeLang = null) {
  if (typeof value === 'string') {
    if (activeLang && value.includes('?')) failures.push(`${path}: literal question mark in ${activeLang} string`);
    if (activeLang === 'zh' && !/[\u3400-\u9FFF]/.test(value) && path.includes('SAMPORA_UI')) {
      failures.push(`${path}: zh UI string should contain CJK or be empty`);
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => visit(item, `${path}[${index}]`, activeLang));
    return;
  }
  if (!value || typeof value !== 'object') return;

  const languageObject = hasLanguageKeys(value);
  for (const [key, child] of Object.entries(value)) {
    visit(child, `${path}.${key}`, languageObject && languages.has(key) ? key : activeLang);
  }
}

visit(context.window.SAMPORA_UI, 'SAMPORA_UI');
visit(context.window.SAMPORA_CONTENT, 'SAMPORA_CONTENT');

const appSource = fs.readFileSync(appPath, 'utf8');
if (/UI\.zh|\?\.zh/.test(appSource)) {
  failures.push('app.js fallback chain still references zh fallback after en');
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('resource manuals language smoke: OK');
