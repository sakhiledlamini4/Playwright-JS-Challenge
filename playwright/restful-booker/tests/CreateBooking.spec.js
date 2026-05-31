import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import commonFunctions from '../functions/common';
import restfullBookerPaylods from '../test-data/payload-generator';

test('should create a booking and receive booking details back', async ({ request }) => {

  await test.step('Generate booking payload', async () => {

    const bookingData = await restfullBookerPaylods.bookingPayload();
    const response = await commonFunctions.createBooking(bookingData);
    const body = await response.json();
    
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('bookingid');
    expect(body).toHaveProperty('booking');
    expect(body.booking).toEqual(bookingData);
  });
    
});                                  