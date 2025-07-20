const { test, expect } = require('@playwright/test');

test('should request booking data by booking id and receive booking info', async ({ request }) => {
    const response = await request.get('https://restful-booker.herokuapp.com/booking/2', {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('firstname');
    expect(body).toHaveProperty('lastname');
    expect(body).toHaveProperty('totalprice');
    expect(body).toHaveProperty('depositpaid');
    expect(body).toHaveProperty('bookingdates');
    expect(body.bookingdates).toHaveProperty('checkin');
    expect(body.bookingdates).toHaveProperty('checkout');
  });