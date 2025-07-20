const { test, expect } = require('@playwright/test');

test.describe('Sauce Demo Inventory Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('input[data-test="username"]', 'standard_user');
    await page.fill('input[data-test="password"]', 'secret_sauce');
    await page.click('input[data-test="login-button"]');
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Inventory list is visible', async ({ page }) => {
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('Shows more than zero products', async ({ page }) => {
    const count = await page.locator('.inventory_item').count();
    expect(count).toBeGreaterThan(0);
  });

  test('Each product has name, price, and add to cart button', async ({ page }) => {
    const items = page.locator('.inventory_item');
    for (let i = 0; i < 6; i++) {
      await expect(items.nth(i).locator('.inventory_item_name')).toBeVisible();
      await expect(items.nth(i).locator('.inventory_item_price')).toBeVisible();
      await expect(items.nth(i).locator('button[data-test^="add-to-cart"]')).toBeVisible();
    }
  });

  test('Add product to cart updates cart badge', async ({ page }) => {
    await page.click('button[data-test="add-to-cart-sauce-labs-backpack"]');
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('Shopping cart link navigates to cart page', async ({ page }) => {
    await expect(page.locator('a.shopping_cart_link')).toBeVisible();
    await page.click('a.shopping_cart_link');
    await expect(page).toHaveURL(/.*cart.html/);
    await expect(page.locator('.cart_list')).toBeVisible();
  });

  test('Sort products by price (low to high)', async ({ page }) => {
    const sortDropdown = page.locator('select[data-test="product-sort-container"]');
    await expect(sortDropdown).toBeVisible({ timeout: 10000 });
    await sortDropdown.selectOption('lohi');
    
    await page.waitForFunction(() => {
      const prices = Array.from(document.querySelectorAll('.inventory_item_price')).map(e => parseFloat(e.textContent.replace('$', '')));
      return prices.length > 1 && prices[0] === Math.min(...prices);
    });
    const prices = await page.$$eval('.inventory_item_price', els => els.map(e => parseFloat(e.textContent.replace('$', ''))));
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
    }
  });

  test('Menu can be opened and closed', async ({ page }) => {
    const menuButton = page.locator('#react-burger-menu-btn');
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    await expect(page.locator('.bm-menu')).toBeVisible();
    const closeButton = page.locator('#react-burger-cross-btn');
    await expect(closeButton).toBeVisible();
    await closeButton.click();
    await expect(page.locator('.bm-menu')).not.toBeVisible();
  });

  test('Menu About link navigates to Sauce Labs', async ({ page }) => {
    await page.locator('#react-burger-menu-btn').click();
    const aboutLink = page.locator('a[data-test="about-sidebar-link"]');
    await expect(aboutLink).toBeVisible();
    await aboutLink.click();
    await expect(page).toHaveURL(/saucelabs.com/);
  });

  test('Menu Logout link logs out user', async ({ page }) => {
    await page.locator('#react-burger-menu-btn').click();
    const logoutLink = page.locator('a[data-test="logout-sidebar-link"]');
    await expect(logoutLink).toBeVisible();
    await logoutLink.click();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('input[data-test="username"]')).toBeVisible();
  });

  test('Menu Reset App State resets cart', async ({ page }) => {
    // Add product to cart
    await page.click('button[data-test="add-to-cart-sauce-labs-backpack"]');
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    // Open menu and reset
    await page.locator('#react-burger-menu-btn').click();
    const resetLink = page.locator('a[data-test="reset-sidebar-link"]');
    await expect(resetLink).toBeVisible();
    await resetLink.click();
    
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });
});
