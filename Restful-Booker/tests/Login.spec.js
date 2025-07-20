
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

function loadTestData(filename) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '../test-data', filename), 'utf8'));
}

test.describe('Restful Booker test suite', () => {
  test('should login and receive a token', async ({ request }) => {
    const authData = loadTestData('auth.json');
    const response = await request.post('https://restful-booker.herokuapp.com/auth', {
      data: authData,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('token');
  });
});