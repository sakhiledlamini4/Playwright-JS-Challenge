const { test, expect } = require('@playwright/test');

test.describe('Sauce Demo Checkout Step Two Page', () => {
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
  });

  test('Shows summary information and finish/cancel buttons', async ({ page }) => {
    await expect(page.locator('.cart_list')).toBeVisible();
    await expect(page.locator('.cart_item')).toHaveCount(1);
    await expect(page.locator('.summary_info')).toBeVisible();
    await expect(page.locator('div[data-test="payment-info-label"]')).toBeVisible();
    await expect(page.locator('div[data-test="payment-info-value"]')).toBeVisible();
    await expect(page.locator('div[data-test="shipping-info-label"]')).toBeVisible();
    await expect(page.locator('div[data-test="shipping-info-value"]')).toBeVisible();
    await expect(page.locator('div[data-test="total-info-label"]')).toBeVisible();
    await expect(page.locator('div[data-test="subtotal-label"]')).toBeVisible();
    await expect(page.locator('div[data-test="tax-label"]')).toBeVisible();
    await expect(page.locator('div[data-test="total-label"]')).toBeVisible();
    await expect(page.locator('button[data-test="finish"]')).toBeVisible();
    await expect(page.locator('button[data-test="cancel"]')).toBeVisible(); 
  });

  test('Finish button completes the order and shows confirmation', async ({ page }) => {
    await page.click('button[data-test="finish"]');
    await expect(page).toHaveURL(/.*checkout-complete.html/);
    await expect(page.locator('.complete-header')).toBeVisible();
    await expect(page.locator('.complete-header')).toContainText('Thank you for your order!');
    await expect(page.locator('.complete-text')).toBeVisible();
  });

  test('Cancel button navigates back to inventory', async ({ page }) => {
    await page.click('button[data-test="cancel"]');
    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(page.locator('.inventory_list')).toBeVisible();
  });
});
