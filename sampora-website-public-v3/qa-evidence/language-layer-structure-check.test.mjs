import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const script = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'language-layer-structure-check.mjs');
const finalAuditScript = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'final-audit-static-check.mjs');
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'sampora-language-layer-'));

try {
  fs.writeFileSync(path.join(tempRoot, 'good.html'), `
    <script>
      const I18N = { en: { title: 'A' }, zh: { title: 'B' } };
      const copy = { en: { footer: 'A' }, zh: { footer: 'B' } };
      window.__samporaContactTranslations = I18N;
    </script>
  `);
  fs.writeFileSync(path.join(tempRoot, 'bad.html'), `
    <script>
      const translations = { en: {}, zh: {} };
      Object.assign(translations.zh, { title: 'late patch' });
      const DATA = { en: {}, zh: {} };
      DATA.en.card = { title: 'late patch' };
      const projects = { en: [{}], zh: [{}] };
      Object.assign(projects.zh[0], { title: 'late project patch' });
      const COPY = { en: {}, zh: {} };
      COPY['zh'].nodeCtrl = 'late bracket patch';
      Object['assign'](COPY['en'], { nodeCtrl: 'late obfuscated patch' });
    </script>
  `);

  const failRun = spawnSync(process.execPath, [script, '--root', tempRoot], { encoding: 'utf8' });
  assert.equal(failRun.status, 1, 'fixture with post-main language patches should fail');
  const failOutput = `${failRun.stdout}\n${failRun.stderr}`;
  assert.match(failOutput, /bad\.html:\d+ post-main Object\.assign on translations\.zh/);
  assert.match(failOutput, /bad\.html:\d+ post-main assignment on DATA\.en/);
  assert.match(failOutput, /bad\.html:\d+ post-main Object\.assign on projects\.zh/);
  assert.match(failOutput, /bad\.html:\d+ post-main assignment on COPY\.zh/);
  assert.match(failOutput, /bad\.html:\d+ post-main Object\.assign on COPY\.en/);

  fs.unlinkSync(path.join(tempRoot, 'bad.html'));
  const passRun = spawnSync(process.execPath, [script, '--root', tempRoot], { encoding: 'utf8' });
  assert.equal(passRun.status, 0, passRun.stdout + passRun.stderr);
  assert.match(passRun.stdout, /language layer structure check: OK/);

  assert.match(
    fs.readFileSync(finalAuditScript, 'utf8'),
    /language-layer-structure-check\.mjs/,
    'final static audit should run the language layer guard',
  );
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
