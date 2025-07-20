const { test, expect } = require('@playwright/test');

test.describe('Sauce Demo Inventory Item Details Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('input[data-test="username"]', 'standard_user');
    await page.fill('input[data-test="password"]', 'secret_sauce');
    await page.click('input[data-test="login-button"]');
    await expect(page).toHaveURL(/.*inventory.html/);
    
    await page.click('a[id="item_4_title_link"]');
    await expect(page).toHaveURL(/.*inventory-item.html/);
  });

  test('shows product name, description, price, and image', async ({ page }) => {
    await expect(page.locator('.inventory_details_name')).toBeVisible();
    await expect(page.locator('.inventory_details_desc')).toBeVisible();
    await expect(page.locator('.inventory_details_price')).toBeVisible();
    await expect(page.locator('.inventory_details_img')).toBeVisible();
  });

  test('add to cart button adds item and updates badge', async ({ page }) => {
    await expect(page.locator('button[data-test="add-to-cart"]')).toBeVisible();
    await page.click('button[data-test="add-to-cart"]');

    await expect(page.locator('button[data-test="remove"]')).toBeVisible();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('remove from cart button removes item and badge', async ({ page }) => {
    await page.click('button[data-test="add-to-cart"]');
    await expect(page.locator('button[data-test="remove"]')).toBeVisible();
    await page.click('button[data-test="remove"]');

    await expect(page.locator('button[data-test="add-to-cart"]')).toBeVisible();
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

  test('back to products button navigates to inventory', async ({ page }) => {
    await expect(page.locator('button[data-test="back-to-products"]')).toBeVisible();
    await page.click('button[data-test="back-to-products"]');

    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('shopping cart link navigates to cart page', async ({ page }) => {
    await expect(page.locator('a.shopping_cart_link')).toBeVisible();
    await page.click('a.shopping_cart_link');

    await expect(page).toHaveURL(/.*cart.html/);
    await expect(page.locator('.cart_list')).toBeVisible();
  });
});
