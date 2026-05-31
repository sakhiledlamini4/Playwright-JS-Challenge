import { test, expect } from '@playwright/test';
import commonFunctions from '../functions/common';
import restfullBookerPaylods from '../test-data/payload-generator';

test('should request booking data by booking id and receive booking info', async ({ request }) => {

  let bookingId;

  await test.step('Create a booking to ensure there is data for the test', async () => {
    const bookingData = await restfullBookerPaylods.bookingPayload();
    const bookingResponse = await commonFunctions.createBooking(bookingData);

    expect(bookingResponse.ok()).toBeTruthy();
    const { bookingid } = await bookingResponse.json();
    bookingId = bookingid; // Store booking ID for later use
  });

  await test.step('Request booking data by booking id', async () => {
    const response = await commonFunctions.getBookingById(bookingId);
    const body = await response.json();
    
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('firstname');
    expect(body).toHaveProperty('lastname');
    expect(body).toHaveProperty('totalprice');
    expect(body).toHaveProperty('depositpaid');
    expect(body).toHaveProperty('bookingdates');
    expect(body.bookingdates).toHaveProperty('checkin');
    expect(body.bookingdates).toHaveProperty('checkout');
  });
});