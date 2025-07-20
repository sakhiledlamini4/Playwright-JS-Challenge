const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const usersPath = path.resolve(__dirname, '../../test-data/users.json');
const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));

for (const username of users) {
  test(`login as ${username}`, async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('input[data-test="username"]', username);
    await page.fill('input[data-test="password"]', 'secret_sauce');
    await page.click('input[data-test="login-button"]');
    if (username === 'locked_out_user') {
      await expect(page.locator('h3[data-test="error"]')).toBeVisible();
      await expect(page.locator('h3[data-test="error"]')).toContainText('Sorry, this user has been locked out.');
    } else {
      await expect(page).toHaveURL(/.*inventory.html/);
      await expect(page.locator('.inventory_list')).toBeVisible();
    }
  });
}
