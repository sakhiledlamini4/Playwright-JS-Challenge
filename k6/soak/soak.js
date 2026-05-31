/**
 * Soak Test for Restful Booker API
 * 
 * Purpose: Verify system stability under sustained load over extended period
 * VUs: 100
 * Duration: 2 hours
 * 
 * Run with:
 *   k6 run soak/soak.js
 *   k6 run soak/soak.js --env ENV=staging
 */

import { group } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { completeBookingJourney } from '../scenarios/userJourney.js';

export const options = {
  stages: [
    { duration: '5m', target: 100 },    // Ramp to 100 VUs
    { duration: '120m', target: 100 },  // Maintain 100 VUs for 2 hours
    { duration: '5m', target: 0 },      // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.01'],
    checks: ['rate>0.95']
  },
  insecureSkipTLSVerify: true
};

export default function () {
  group('soak test - booking workflow', () => {
    completeBookingJourney.executeCompleteWorkflow();
  });
}

export function handleSummary(data) {
  return {
    'reports/k6-soak.html': htmlReport(data),
  };
}
