const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

function loadTestData(filename) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '../test-data', filename), 'utf8'));
}

test('should create a booking and receive booking details back', async ({ request }) => {
    const bookingData = loadTestData('booking.json');
    const response = await request.post('https://restful-booker.herokuapp.com/booking', {
      data: bookingData,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('bookingid');
    expect(body).toHaveProperty('booking');
    expect(body.booking).toEqual(bookingData);
  });                                  