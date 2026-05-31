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
  await expect(page).toHaveURL(/.*checkout-step-one.html/);
});

test('Shows all required form fields', async ({ page }) => {
  await expect(page.locator('span[data-test="title"]')).toBeVisible();
  await expect(page.locator('input[data-test="firstName"]')).toBeVisible();
  await expect(page.locator('input[data-test="lastName"]')).toBeVisible();
  await expect(page.locator('input[data-test="postalCode"]')).toBeVisible();
  await expect(page.locator('input[data-test="continue"]')).toBeVisible();
  await expect(page.locator('button[data-test="cancel"]')).toBeVisible();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
});

test('Shows error if required fields are missing', async ({ page }) => {
  await page.click('input[data-test="continue"]');
  await expect(page.locator('h3[data-test="error"]')).toBeVisible();
  await expect(page.locator('h3[data-test="error"]')).toContainText('Error: First Name is required');
  await page.fill('input[data-test="firstName"]', 'John');
  await page.click('input[data-test="continue"]');
  await expect(page.locator('h3[data-test="error"]')).toContainText('Error: Last Name is required');
  await page.fill('input[data-test="lastName"]', 'Doe');
  await page.click('input[data-test="continue"]');
  await expect(page.locator('h3[data-test="error"]')).toContainText('Error: Postal Code is required');
});

test(' Continue button successful navigates to checkout-step-two.html', async ({ page }) => {
  await page.fill('input[data-test="firstName"]', 'John');
  await page.fill('input[data-test="lastName"]', 'Doe');
  await page.fill('input[data-test="postalCode"]', '12345');
  await page.click('input[data-test="continue"]');
  await expect(page).toHaveURL(/.*checkout-step-two.html/);
  await expect(page.locator('.cart_list')).toBeVisible();
});

test('Cancel button navigates back to cart', async ({ page }) => {
  await expect(page.locator('button[data-test="cancel"]')).toBeVisible();
  await page.click('button[data-test="cancel"]');
  await expect(page).toHaveURL(/.*cart.html/);
  await expect(page.locator('.cart_list')).toBeVisible();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
});