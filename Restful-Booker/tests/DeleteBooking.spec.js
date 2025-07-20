const { test, expect } = require('@playwright/test');

test('should delete a booking successfully', async ({ request }) => {
    // Create a token (authentication)
    const authResponse = await request.post('https://restful-booker.herokuapp.com/auth', {
      data: {
        username: 'admin',
        password: 'password123'
      },
      headers: {
          'Content-Type': 'application/json'
        }
    });

    expect(authResponse.ok()).toBeTruthy();
    const { token } = await authResponse.json();

    // Create a booking to delete
    const bookingResponse = await request.post('https://restful-booker.herokuapp.com/booking', {
      data: {
        firstname: 'Sakhile',
        lastname: 'Dlamini',
        totalprice: 200,
        depositpaid: true,
        bookingdates: {
          checkin: '2025-10-01',
          checkout: '2025-10-10'
        },
        additionalneeds: 'Breakfast'
      },
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
    });

    expect(bookingResponse.ok()).toBeTruthy();
    const { bookingid } = await bookingResponse.json();

    // Delete the booking
    const deleteResponse = await request.delete(`https://restful-booker.herokuapp.com/booking/${bookingid}`, {
      headers: {
          'Content-Type': 'application/json',
          Cookie: `token=${token}`
      }
    });

    expect(deleteResponse.status()).toBe(201);

    // Verify booking no longer exists
    const getDeletedBooking = await request.get(`https://restful-booker.herokuapp.com/booking/${bookingid}`);
    expect(getDeletedBooking.status()).toBe(404);
  });
