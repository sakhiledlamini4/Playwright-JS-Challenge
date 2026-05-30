import http from 'k6/http';
import { check, sleep } from 'k6';
import config from '../config/config-manager.js';

export const options = {
  stages: [
    { duration: '15s', target: 10 },
    { duration: '30s', target: 10 },
    { duration: '15s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    'http_req_failed{type:createBooking}': ['rate<0.01'],
  },
};

const BASE_URL = config.baseUrl;
const bookingData = JSON.parse(open('../test-data/booking.json'));

export default function () {
  //const payload = JSON.stringify(bookingPayload());
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  const createRes = http.post(config.baseUrl + config.endpoints.createBooking, JSON.stringify(bookingData), params);
  const bookingId = createRes.json().bookingid;

  check(createRes, {
    'booking created': (r) => r.status === 200 && bookingId !== undefined,
  });

  if (bookingId) {
    const getRes = http.get(`${BASE_URL}/booking/${bookingId}`);
    check(getRes, {
      'get booking success': (r) => r.status === 200,
    });
  }

  sleep(1);
}
