
import { test, expect } from '@playwright/test';
import commonFunctions from '../functions/common';
import restfullBookerPaylods from '../test-data/payload-generator';

test('should login and receive a token', async ({ request }) => {
    const authData = await restfullBookerPaylods.authPayload();
    const response = await commonFunctions.login(authData);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('token');
  });