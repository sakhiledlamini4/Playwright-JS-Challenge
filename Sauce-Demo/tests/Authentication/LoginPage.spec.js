const { test, expect } = require('@playwright/test');

test.describe('Sauce Demo UI test suite', () => {
    test('homepage has title', async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');
        await expect(page).toHaveTitle('Swag Labs');
    });

    test('login form is visible', async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');
        await expect(page.locator('input[data-test="username"]')).toBeVisible();
        await expect(page.locator('input[data-test="password"]')).toBeVisible();
        await expect(page.locator('input[data-test="login-button"]')).toBeVisible();
    });

    test('shows error on invalid login', async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');
        await page.fill('input[data-test="username"]', 'invalid_user');
        await page.fill('input[data-test="password"]', 'invalid_pass');
        await page.click('input[data-test="login-button"]');
        await expect(page.locator('h3[data-test="error"]')).toBeVisible();
        await expect(page.locator('h3[data-test="error"]')).toContainText('Username and password do not match');
    });

    test('successful login redirects to inventory', async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');
        await page.fill('input[data-test="username"]', 'standard_user');
        await page.fill('input[data-test="password"]', 'secret_sauce');
        await page.click('input[data-test="login-button"]');
        await expect(page).toHaveURL(/.*inventory.html/);
        await expect(page.locator('.inventory_list')).toBeVisible();
    });
});