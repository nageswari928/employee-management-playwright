import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import * as fs from 'fs';
import * as path from 'path';

export const test = base.extend({
  // Override page to collect V8 coverage data via window.__coverage__
  page: async ({ page }, use, testInfo) => {
    await use(page);

    const coverage = await page.evaluate(() => window.__coverage__);
    if (coverage) {
      const outputDir = path.resolve(process.cwd(), '.nyc_output');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      const cleanTitle = testInfo.title
        .replace(/[^a-zA-Z0-9]/g, '_')
        .replace(/__+/g, '_')
        .toLowerCase();
      const filename = `coverage-${cleanTitle}.json`;
      fs.writeFileSync(
        path.join(outputDir, filename),
        JSON.stringify(coverage)
      );
    }
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await use(loginPage);
  }
});

export { expect } from '@playwright/test';