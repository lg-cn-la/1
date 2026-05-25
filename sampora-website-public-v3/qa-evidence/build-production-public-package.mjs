import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const sourceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workspaceRoot = path.resolve(sourceRoot, '..');
const targetName = process.argv[2] || 'sampora-website-public-v4';
const targetRoot = path.resolve(workspaceRoot, targetName);

const rootFiles = [
  '404.html',
  'about.html',
  'contact.html',
  'cookie-policy.html',
  'index.html',
  'plans.html',
  'privacy.html',
  'resource-manuals.html',
  'resources.html',
  'robots.txt',
  'sitemap.xml',
  'solutions.html',
  'terms.html',
];

await fs.rm(targetRoot, { recursive: true, force: true });
await fs.mkdir(targetRoot, { recursive: true });

for (const file of rootFiles) {
  await fs.copyFile(path.join(sourceRoot, file), path.join(targetRoot, file));
}

await fs.cp(path.join(sourceRoot, 'assets'), path.join(targetRoot, 'assets'), {
  recursive: true,
  filter: (src) => !/\.md$/i.test(path.basename(src)),
});

console.log(`Built production public package: ${targetRoot}`);
