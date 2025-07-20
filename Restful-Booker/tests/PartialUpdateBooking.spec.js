const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

function loadTestData(filename) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '../test-data', filename), 'utf8'));
}

test.describe('Restful Booker test suite', () => {
  test('Should login , create booking and partially update details', async ({ request }) => {
    const authData = loadTestData('auth.json');
    const bookingData = loadTestData('booking.json');
    const partialUpdateData = { firstname: 'James', lastname: 'Brown' };

    // Create a token (authentication)
    const authResponse = await request.post('https://restful-booker.herokuapp.com/auth', {
      data: authData,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    expect(authResponse.ok()).toBeTruthy();
    const { token } = await authResponse.json();

    // Create a booking
    const bookingResponse = await request.post('https://restful-booker.herokuapp.com/booking', {
      data: bookingData,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    expect(bookingResponse.ok()).toBeTruthy();
    const { bookingid } = await bookingResponse.json();

    // Partially Updating the booking details
    const updateResponse = await request.patch(`https://restful-booker.herokuapp.com/booking/${bookingid}`, {
        data: partialUpdateData,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            Cookie: `token=${token}`
        }
    });

    expect(updateResponse.status()).toBe(200);
    const body = await updateResponse.json();
    expect(body).toEqual({
      ...bookingData,
      ...partialUpdateData
    });
  });
});
