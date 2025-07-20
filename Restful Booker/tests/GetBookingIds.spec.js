const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

function loadTestData(filename) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '../test-data', filename), 'utf8'));
}

// Get all existing booking ids
test.describe('Restful Booker test suite', () => {
  test('should request all existing booking ids and receive a list of ids', async ({ request }) => {
    const response = await request.get('https://restful-booker.herokuapp.com/booking');
    
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
    const userData = loadTestData('getBookingByUserDetails.json');
    const response = await request.get('https://restful-booker.herokuapp.com/booking', {
      data: userData
    });
    
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
  test('should request booking ids by check-in and check-out dates and receive a list of ids', async ({ request }) => {
    const checkInData = loadTestData('getBookingByCheckInDates.json');
    const response = await request.get('https://restful-booker.herokuapp.com/booking', {
      data: checkInData
    });
    
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