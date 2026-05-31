import { test, expect } from '@playwright/test';
import commonFunctions from '../functions/common';
import restfullBookerPaylods from '../test-data/payload-generator';

test('should delete a booking successfully', async ({ request }) => {
  
  let authToken, bookingId;

  await test.step('Authenticate and get token', async () => {
    const loginPayload = await restfullBookerPaylods.authPayload();
    const authResponse = await commonFunctions.login(loginPayload);

    expect(authResponse.ok()).toBeTruthy();
    const { token } = await authResponse.json();
    authToken = token; // Store token for later use
  });
    
  await test.step('Create booking', async () => {
    // Create a booking to delete
    const bookingData = await restfullBookerPaylods.bookingPayload();
    const bookingResponse = await commonFunctions.createBooking(bookingData);

    expect(bookingResponse.ok()).toBeTruthy();
    const { bookingid } = await bookingResponse.json();
    bookingId = bookingid; // Store booking ID for later use
  }); 

  await test.step('Delete booking', async () => {
    // Delete the booking
    const deleteResponse = await commonFunctions.deleteBooking(bookingId, authToken);
    expect(deleteResponse.status()).toBe(201);

  });  

  await test.step('Verify deletion', async () => {  
    // Verify booking no longer exists
    const getDeletedBooking = await commonFunctions.getBookingById(bookingId);
    expect(getDeletedBooking.status()).toBe(404);
  });
});
