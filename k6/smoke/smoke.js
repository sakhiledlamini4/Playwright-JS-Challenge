/**
 * Smoke Test for Restful Booker API
 * 
 * Purpose: Verify basic API functionality
 * VUs: 1
 * Duration: 1 minute
 * 
 * Run with:
 *   k6 run smoke/smoke.js
 *   k6 run smoke/smoke.js --env ENV=staging
 */

import { group } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { completeBookingJourney } from '../scenarios/userJourney.js';

export const options = {
  stages: [
    { duration: '1m', target: 1 },  // 1 minute at 1 VU
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.05'],
    checks: ['rate>0.95']
  },
  insecureSkipTLSVerify: true
};

export default function () {
  group('smoke test - booking workflow', () => {
    completeBookingJourney.executeCompleteWorkflow();
  });
}

export function handleSummary(data) {
  return {
    'reports/k6-smoke.html': htmlReport(data),
  };
}
