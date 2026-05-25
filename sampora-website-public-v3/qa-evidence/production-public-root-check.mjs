import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const sourceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const targetRoot = path.resolve(process.env.SAMPORA_PRODUCTION_ROOT || process.argv[2] || sourceRoot);
const failures = [];

const fail = (message) => failures.push(message);

if (!fs.existsSync(targetRoot)) {
  fail(`production root does not exist: ${targetRoot}`);
} else {
  for (const name of ['qa-evidence', 'backend', 'snippets']) {
    if (fs.existsSync(path.join(targetRoot, name))) {
      fail(`production root must not expose ${name}/`);
    }
  }

  const rootMarkdown = fs.readdirSync(targetRoot)
    .filter((entry) => /\.md$/i.test(entry));
  if (rootMarkdown.length) {
    fail(`production root must not expose root Markdown files: ${rootMarkdown.join(', ')}`);
  }

  const htmlFiles = fs.readdirSync(targetRoot).filter((entry) => entry.endsWith('.html')).sort();
  const expectedHtml = ['404.html', 'about.html', 'contact.html', 'cookie-policy.html', 'index.html', 'plans.html', 'privacy.html', 'resource-manuals.html', 'resources.html', 'solutions.html', 'terms.html'];
  if (JSON.stringify(htmlFiles) !== JSON.stringify(expectedHtml)) {
    fail(`production root HTML files mismatch: expected ${JSON.stringify(expectedHtml)}, found ${JSON.stringify(htmlFiles)}`);
  }

  const stack = [targetRoot];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const absolute = path.join(current, entry.name);
      const rel = path.relative(targetRoot, absolute).replaceAll('\\', '/');
      if (entry.isDirectory()) {
        stack.push(absolute);
        continue;
      }
      if (/\.md$/i.test(entry.name)) fail(`production root must not expose Markdown file: ${rel}`);
      if (rel.startsWith('qa-evidence/') || rel.startsWith('backend/') || rel.startsWith('snippets/')) {
        fail(`production root must not expose private/support artifact: ${rel}`);
      }
    }
  }
}

if (failures.length) {
  console.log('FAIL production public root check');
  failures.forEach((message) => console.log(`- ${message}`));
  process.exitCode = 1;
} else {
  console.log(`PASS production public root check: ${targetRoot}`);
}
