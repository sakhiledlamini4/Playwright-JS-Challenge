const { defineConfig } = require('@playwright/test');

/**@type {import ('@playwright/test').PlaywrightTestConfig} */
module.exports = defineConfig({
  testDir: './tests',
  use:{
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },
    reporter: [['list'], ['monocart-reporter', { name: 'Sauce Demo UI Tests', outputFile: '../../reports/sauce-demo-report/index.html' }]],
});