import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const defaultRoot = path.resolve(here, '..');
const rootArgIndex = process.argv.indexOf('--root');
const root = path.resolve(rootArgIndex >= 0 ? process.argv[rootArgIndex + 1] : defaultRoot);

const languageRoots = [
  'translations',
  'I18N',
  'HERO_UI',
  'DATA',
  'COPY',
  'projects',
];

const rootPattern = languageRoots.join('|');
const langPattern = 'en|zh';
const rootLangAccess = `(${rootPattern})\\s*(?:\\.\\s*(${langPattern})|\\[\\s*['"](${langPattern})['"]\\s*\\])`;
const postAssignPattern = new RegExp(
  `Object(?:\\.assign|\\s*\\[\\s*['"]assign['"]\\s*\\])\\(\\s*${rootLangAccess}(?=\\s*(?:[.\\[]|,|\\)))`,
  'g',
);
const directAssignmentPattern = new RegExp(
  `\\b${rootLangAccess}\\s*(?:\\[[^\\]]+\\]|\\.[A-Za-z_$][\\w$]*)*\\s*=`,
  'g',
);

const failures = [];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    const rel = path.relative(root, full).replaceAll('\\', '/');
    if (entry.isDirectory()) {
      if (rel === 'qa-evidence' || rel.startsWith('qa-evidence/')) return [];
      return walk(full);
    }
    if (!/\.(?:html|js)$/i.test(entry.name)) return [];
    return [full];
  });
}

function lineOf(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

function collectPattern(file, text, pattern, message) {
  pattern.lastIndex = 0;
  for (const match of text.matchAll(pattern)) {
    failures.push(`${file}:${lineOf(text, match.index)} ${message(match[1], match[2] || match[3])}`);
  }
}

for (const full of walk(root)) {
  const rel = path.relative(root, full).replaceAll('\\', '/');
  const text = fs.readFileSync(full, 'utf8');
  collectPattern(rel, text, postAssignPattern, (name, lang) => `post-main Object.assign on ${name}.${lang}`);
  collectPattern(rel, text, directAssignmentPattern, (name, lang) => `post-main assignment on ${name}.${lang}`);
}

if (failures.length) {
  console.error('language layer structure check: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('language layer structure check: OK');
