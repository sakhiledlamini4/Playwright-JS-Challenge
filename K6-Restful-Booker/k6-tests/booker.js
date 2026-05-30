import http from 'k6/http';
import { check, sleep } from 'k6';
import config from '../../Restful-Booker/config/config-manager.js';
import commonFunctions from '../functions/common.js';
import restfullBookerPaylods from '../../Restful-Booker/test-data/payload-generator.js';

export const options = {
  stages: [
    { duration: '15s', target: 10 },
    { duration: '30s', target: 10 },
    { duration: '15s', target: 0 },
  ],
  thresholds: {
    checks: ['rate>0.95'],
    http_req_duration: ['p(95)<250'],
    'http_req_failed{type:createBooking}': ['rate<0.01'],
  },
  discardResponseBodies: false,
  insecureSkipTLSVerify: true,
};

export default function () {
  const bookingData = JSON.stringify(restfullBookerPaylods.bookingPayload());
  const createRes = commonFunctions.bookingRequest(bookingData);
  const bookingId = createRes.json().bookingid;

  check(createRes, {
    'booking created': (r) => r.status === 200 && bookingId !== undefined,
  });

  if (bookingId) {
    const getRes = commonFunctions.getBooking(bookingId);
    check(getRes, {
      'get booking success': (r) => r.status === 200,
    });
  }

  sleep(1);
}
