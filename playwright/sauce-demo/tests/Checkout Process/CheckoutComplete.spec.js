const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.fill('input[data-test="username"]', 'standard_user');
  await page.fill('input[data-test="password"]', 'secret_sauce');
  await page.click('input[data-test="login-button"]');
  await expect(page).toHaveURL(/.*inventory.html/);
  await page.click('button[data-test="add-to-cart-sauce-labs-backpack"]');
  await page.click('a.shopping_cart_link');
  await page.click('button[data-test="checkout"]');
  await page.fill('input[data-test="firstName"]', 'John');
  await page.fill('input[data-test="lastName"]', 'Doe');
  await page.fill('input[data-test="postalCode"]', '12345');
  await page.click('input[data-test="continue"]');
  await expect(page).toHaveURL(/.*checkout-step-two.html/);
  await page.click('button[data-test="finish"]');
  await expect(page).toHaveURL(/.*checkout-complete.html/);
});

test('Shows confirmation message and image', async ({ page }) => {
  await expect(page.locator('.title')).toBeVisible();
  await expect(page.locator('.complete-header')).toBeVisible();
  await expect(page.locator('.complete-header')).toContainText('Thank you for your order!');
  await expect(page.locator('.complete-text')).toBeVisible();
  await expect(page.locator('.pony_express')).toBeVisible();
  await expect(page.locator('button[data-test="back-to-products"]')).toBeVisible();
});

test('Back Home button navigates to inventory page', async ({ page }) => {
  await expect(page.locator('button[data-test="back-to-products"]')).toBeVisible();
  await page.click('button[data-test="back-to-products"]');
  await expect(page).toHaveURL(/.*inventory.html/);
  await expect(page.locator('.inventory_list')).toBeVisible();
});

test('No cart badge after order completion', async ({ page }) => {
  await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
});