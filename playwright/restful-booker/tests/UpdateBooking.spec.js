import { test, expect } from '@playwright/test';
import commonFunctions from '../functions/common';
import restfullBookerPaylods from '../test-data/payload-generator';

test('Should login, create booking and update details', async ({ request }) => {
  
  let authToken, bookingId, bookingData;
  await test.step('Login and get token', async () => {

    const authData = await restfullBookerPaylods.authPayload();
    const authResponse = await commonFunctions.login(authData);

    expect(authResponse.ok()).toBeTruthy();
    const { token } = await authResponse.json();
    authToken = token;
  });

  await test.step('Create a booking', async () => {
    bookingData = await restfullBookerPaylods.bookingPayload();
    const bookingResponse = await commonFunctions.createBooking(bookingData);

    expect(bookingResponse.ok()).toBeTruthy();
    const { bookingid } = await bookingResponse.json();
    bookingId = bookingid;
  });

  await test.step('Update the booking details', async () => {
    const updatedBookingData = await restfullBookerPaylods.updateBookingPayload();
    const updateResponse = await commonFunctions.updateBooking(bookingId, updatedBookingData, authToken);
    const body = await updateResponse.json();

    expect(updateResponse.status()).toBe(200);
    expect(body).toEqual(updatedBookingData);
  });
});
