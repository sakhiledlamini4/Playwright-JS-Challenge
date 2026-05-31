/**
 * Stress Test for Restful Booker API
 * 
 * Purpose: Find the breaking point of the application
 * VUs: Ramp from 50 to 500
 * Duration: ~15 minutes
 * 
 * Run with:
 *   k6 run stress/stress.js
 *   k6 run stress/stress.js --env ENV=staging
 */

import { group } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { completeBookingJourney } from '../scenarios/userJourney.js';

export const options = {
  stages: [
    { duration: '2m', target: 50 },   // Ramp to 50 VUs
    { duration: '2m', target: 100 },  // Ramp to 100 VUs
    { duration: '2m', target: 200 },  // Ramp to 200 VUs
    { duration: '2m', target: 300 },  // Ramp to 300 VUs
    { duration: '2m', target: 400 },  // Ramp to 400 VUs
    { duration: '2m', target: 500 },  // Ramp to 500 VUs (max stress)
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000', 'p(99)<2000'],
    http_req_failed: ['rate<0.10'],
    checks: ['rate>0.90']
  },
  insecureSkipTLSVerify: true
};

export default function () {
  group('stress test - booking workflow', () => {
    completeBookingJourney.executeCompleteWorkflow();
  });
}

export function handleSummary(data) {
  return {
    'reports/k6-stress.html': htmlReport(data),
  };
}
