import { test, expect } from '@playwright/test';
import commonFunctions from '../functions/common';
import restfullBookerPaylods from '../test-data/payload-generator';

// Get all existing booking ids
test('should request all existing booking ids and receive a list of ids', async () => {
    const response = await commonFunctions.getAllBookings();

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    body.forEach(item => {
      expect(item).toHaveProperty('bookingid');
      expect(typeof item.bookingid).toBe('number');
    });
  });

// Get booking ids by firstname and lastname
  test('should request booking ids by firstname and lastname and receive a list of ids', async ({ request }) => {
    const userData = restfullBookerPaylods.getBookingByUserDetailsPayload('Jane', 'Doe');
    const response = await commonFunctions.getBookingByUserDetails(userData);
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    body.forEach(item => {
      expect(item).toHaveProperty('bookingid');
      expect(typeof item.bookingid).toBe('number');
    });
  });

// Get booking ids by check-in and check-out dates
  test('should request booking ids by check-in and check-out dates and receive a list of ids', async () => {

    let checkin, checkout;
    await test.step('Create a booking to ensure there is data for the test', async () => {
      const bookingData = await restfullBookerPaylods.bookingPayload('Test', 'User');
      checkin = bookingData.checkin;
      checkout = bookingData.checkout;
      const createResponse = await commonFunctions.createBooking(bookingData);
      expect(createResponse.ok()).toBeTruthy();
    });
    
    await test.step('Request booking ids by check-in and check-out dates', async () => {
      const checkInData = restfullBookerPaylods.getBookingByCheckinDatesPayload(checkin, checkout);
      const response = await commonFunctions.getBookingByUserDetails(checkInData);

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);
      body.forEach(item => {
        expect(item).toHaveProperty('bookingid');
        expect(typeof item.bookingid).toBe('number');
      });
    });
    
  });