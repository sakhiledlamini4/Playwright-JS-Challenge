const { test, expect } = require('@playwright/test');

test.describe('Sauce Demo Shopping Cart Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('input[data-test="username"]', 'standard_user');
    await page.fill('input[data-test="password"]', 'secret_sauce');
    await page.click('input[data-test="login-button"]');
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Cart is empty when opened without adding items', async ({ page }) => {
    await page.click('a.shopping_cart_link');
    await expect(page).toHaveURL(/.*cart.html/);
    
    await expect(page.locator('.cart_list')).toBeVisible();
    await expect(page.locator('.cart_item')).toHaveCount(0);
    await expect(page.locator('button[data-test="continue-shopping"]')).toBeVisible();
    await expect(page.locator('button[data-test="checkout"]')).toBeVisible();
  });

  test('Cart shows items when products are added', async ({ page }) => {
    await page.click('button[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('button[data-test="add-to-cart-sauce-labs-bike-light"]');
    await page.click('a.shopping_cart_link');

    await expect(page).toHaveURL(/.*cart.html/);
    await expect(page.locator('.cart_item')).toHaveCount(2);
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveText([/Sauce Labs Backpack/, /Sauce Labs Bike Light/]);
    for (let i = 0; i < await cartItems.count(); i++) {
        await expect(cartItems.nth(i).locator('div[data-test="inventory-item-desc"]')).toBeVisible();
    }
    await expect(page.locator('button[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    await expect(page.locator('button[data-test="remove-sauce-labs-bike-light"]')).toBeVisible();
    await expect(page.locator('button[data-test="continue-shopping"]')).toBeVisible();
    await expect(page.locator('button[data-test="checkout"]')).toBeVisible();
  });

  test('Continue Shopping button navigates back to inventory', async ({ page }) => {
    await page.click('button[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('a.shopping_cart_link');
    await expect(page).toHaveURL(/.*cart.html/);
    
    await expect(page.locator('button[data-test="continue-shopping"]')).toBeVisible();
    await page.click('button[data-test="continue-shopping"]');

    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(page.locator('.inventory_list')).toBeVisible();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('Checkout button navigates to checkout page', async ({ page }) => {
    await page.click('button[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('a.shopping_cart_link');
    await expect(page).toHaveURL(/.*cart.html/);
    
    await expect(page.locator('button[data-test="checkout"]')).toBeVisible();
    await page.click('button[data-test="checkout"]');

    await expect(page).toHaveURL(/.*checkout-step-one.html/);
  });

  test('Clicking a cart item navigates to the item detail page', async ({ page }) => {
    await page.click('button[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('a.shopping_cart_link');
    await expect(page).toHaveURL(/.*cart.html/);
    
    const itemLink = page.locator('.cart_item .inventory_item_name').first();
    await expect(itemLink).toBeVisible();
    await itemLink.click();
    
    await expect(page).toHaveURL(/.*inventory-item.html/);
    await expect(page.locator('.inventory_details_name')).toBeVisible();
    await expect(page.locator('.inventory_details_name')).toContainText('Sauce Labs Backpack');
    await expect(page.locator('.inventory_details_price')).toBeVisible();
    await expect(page.locator('button[data-test="remove"]')).toBeVisible();
    await expect(page.locator('button[data-test="back-to-products"]')).toBeVisible();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('Removing item from cart updates cart items and badge', async ({ page }) => {
    await page.click('button[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('button[data-test="add-to-cart-sauce-labs-bike-light"]');
    await page.click('a.shopping_cart_link');
    await expect(page.locator('.cart_item')).toHaveCount(2);
    await expect(page.locator('button[data-test="remove-sauce-labs-bike-light"]')).toBeVisible();
    await page.click('button[data-test="remove-sauce-labs-bike-light"]');
    
    await expect(page.locator('.cart_item')).toHaveCount(1);
    await expect(page.locator('.cart_item')).toContainText('Sauce Labs Backpack');
    await expect(page.locator('.cart_item')).not.toContainText('Sauce Labs Bike Light');
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });
});