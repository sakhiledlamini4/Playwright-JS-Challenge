/**
 * Load Test for Restful Booker API
 * 
 * Purpose: Verify system behavior under typical load
 * VUs: Ramp to 50, maintain for 5 minutes
 * Duration: ~7 minutes
 * 
 * Run with:
 *   k6 run load/load.js
 *   k6 run load/load.js --env ENV=staging
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import config from '../config/environment.js';
import apiClient from '../helpers/apiClient.js';
import dataGenerator from '../data/dataGenerator.js';

export const options = {
  stages: [
    { duration: '1m', target: 10 },   // Ramp to 10 VUs
    { duration: '2m', target: 50 },   // Ramp to 50 VUs
    { duration: '5m', target: 50 },   // Maintain 50 VUs for 5 minutes
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.05'],
    checks: ['rate>0.95']
  },
  discardResponseBodies: false,
  insecureSkipTLSVerify: true
};

export default function () {
  group('load test - booking workflow', () => {
    const bookingData = JSON.stringify(dataGenerator.generateBookingPayload(__VU, __ITER));
    const createRes = apiClient.bookingRequest(bookingData);
    const bookingId = createRes.json().bookingid;

    check(createRes, {
      'booking created': (r) => r.status === 200 && bookingId !== undefined,
    }, { type: 'createBooking' });

    if (bookingId) {
      sleep(0.5);
      const getRes = apiClient.getBooking(bookingId);
      check(getRes, {
        'get booking success': (r) => r.status === 200,
      });
    }

    sleep(1);
  });
}

export function handleSummary(data) {
  return {
    'reports/k6-load.html': htmlReport(data),
  };
}
