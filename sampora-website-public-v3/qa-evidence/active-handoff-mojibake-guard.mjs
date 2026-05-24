import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

const read = (rel) => fs.readFileSync(path.join(repoRoot, rel), 'utf8');

const failures = [];

const chars = (...codes) => String.fromCodePoint(...codes);
const rx = (...codes) => new RegExp(chars(...codes), 'g');
const rxAny = (...codes) => new RegExp(codes.map((code) => chars(code)).join('|'), 'g');

const markerPatterns = [
  { label: 'question placeholders', re: /\?{4,}/g },
  { label: 'replacement character', re: /\uFFFD/g },
  { label: 'known bad legal marker', re: rx(0x9362, 0x590e, 0x505b) },
  { label: 'known bad filing marker', re: rx(0x9428, 0x6713, 0x43, 0x50) },
  { label: 'old panel-provider marker', re: rx(0x95c8, 0x3221, 0x6f98, 0x93c8, 0x5d85, 0x59df, 0x935f) },
  { label: 'old owned-panel marker', re: rx(0x9477, 0xe045, 0x6e41, 0x20, 0x50, 0x61, 0x6e, 0x65, 0x6c) },
  { label: 'old CLOSE marker', re: new RegExp(`${chars(0x9474)}\\??CLOSE|${chars(0x8133)} CLOSE`, 'g') },
  { label: 'known noisy marker', re: rxAny(0x95b3, 0x5a11) },
];

const activeHandoffExtraPatterns = [
  { label: 'unlabeled old dynamic-reference marker', re: rx(0x9354, 0x3126, 0x6665) },
  { label: 'unlabeled old Chinese trigger marker', re: new RegExp(`${chars(0x934f, 0x581f, 0x5bdc)}|${chars(0x93ba, 0x30e6, 0x589c)}|${chars(0x7455, 0x4f7d, 0x70e6)}`, 'g') },
  { label: 'unlabeled old legal-name marker', re: rx(0x7039, 0x590a, 0x7a98, 0x942a) },
  { label: 'unlabeled old Indic-script mojibake marker', re: rx(0x5576) },
];

function lineOf(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

function lineTextAt(text, index) {
  const start = text.lastIndexOf('\n', index) + 1;
  const end = text.indexOf('\n', index);
  return text.slice(start, end === -1 ? text.length : end);
}

function collectMatches(rel, text, patterns, allowLine = () => false) {
  for (const { label, re } of patterns) {
    re.lastIndex = 0;
    for (const match of text.matchAll(re)) {
      const lineText = lineTextAt(text, match.index);
      if (allowLine(lineText, label, match[0])) continue;
      failures.push(`${rel}:${lineOf(text, match.index)} ${label}: ${match[0]}`);
    }
  }
}

const handoff = read('SAMPORA_LATEST_REPAIR_HANDOFF.md');
collectMatches('SAMPORA_LATEST_REPAIR_HANDOFF.md', handoff, [
  ...markerPatterns,
  ...activeHandoffExtraPatterns,
]);

const log = read('SAMPORA_LATEST_REPAIR_LOG.md');
if (!log.includes('2026-05-19 CST Archive - Active handoff historical update log before mojibake boundary cleanup')) {
  failures.push('SAMPORA_LATEST_REPAIR_LOG.md: missing dated archive heading for moved historical handoff log');
}
if (!log.includes('historical evidence only') && !log.includes('historical-only')) {
  failures.push('SAMPORA_LATEST_REPAIR_LOG.md: archive heading must label moved mojibake/history samples as historical evidence only');
}

const acceptance = read('ACCEPTANCE_TESTS.md');
if (!acceptance.includes('active-handoff-mojibake-guard.mjs')) {
  failures.push('ACCEPTANCE_TESTS.md: missing active-handoff-mojibake-guard.mjs coverage reference');
}
if (!acceptance.includes('Active handoff docs must separate current instructions from historical evidence')) {
  failures.push('ACCEPTANCE_TESTS.md: missing active handoff/archive boundary acceptance rule');
}

const ledger = read('ISSUE_LEDGER.md');
if (!ledger.includes('HANDOFF-001')) {
  failures.push('ISSUE_LEDGER.md: missing HANDOFF-001 recurring issue row');
}

const publicFiles = [
  'index.html',
  'solutions.html',
  'resources.html',
  'plans.html',
  'contact.html',
  'resource-manuals.html',
  'assets/resource-manuals/app.js',
  'assets/resource-manuals/data.js',
].map((rel) => path.join('sampora-website-public-v3', rel));

for (const rel of publicFiles) {
  const full = path.join(repoRoot, rel);
  if (fs.existsSync(full)) {
    collectMatches(rel, fs.readFileSync(full, 'utf8'), markerPatterns, (line) => {
      // Existing source may contain mojibake markers only inside bad-text detector regexes.
      return line.includes('.test(t)') && line.includes('return true');
    });
  }
}

if (failures.length) {
  console.error('active handoff mojibake/archive guard: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('active handoff mojibake/archive guard: PASS');
