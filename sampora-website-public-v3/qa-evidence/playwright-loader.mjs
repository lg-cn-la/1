import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

export function loadChromium() {
  try {
    return require('playwright').chromium;
  } catch (standardError) {
    try {
      return require('../../playwright-local/node_modules/playwright').chromium;
    } catch (legacyError) {
      throw new Error(
        'Missing Playwright dependency. Install playwright in the package root or keep the legacy ../../playwright-local directory. Original error: ' +
          standardError.message
      );
    }
  }
}
