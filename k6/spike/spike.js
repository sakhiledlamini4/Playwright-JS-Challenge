/**
 * Spike Test for Restful Booker API
 * 
 * Purpose: Verify how system handles sudden traffic spikes
 * VUs: Instant jump to 1000
 * Duration: ~3 minutes
 * 
 * Run with:
 *   k6 run spike/spike.js
 *   k6 run spike/spike.js --env ENV=staging
 */

import { group } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { quickBookingJourney } from '../scenarios/userJourney.js';

export const options = {
  stages: [
    { duration: '30s', target: 100 },   // Warm up to 100 VUs
    { duration: '1m', target: 1000 },   // Spike to 1000 VUs
    { duration: '30s', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000', 'p(99)<5000'],
    http_req_failed: ['rate<0.20'],
    checks: ['rate>0.80']
  },
  insecureSkipTLSVerify: true
};

export default function () {
  group('spike test - quick booking workflow', () => {
    quickBookingJourney.executeQuickWorkflow();
  });
}

export function handleSummary(data) {
  return {
    'reports/k6-spike.html': htmlReport(data),
  };
}
