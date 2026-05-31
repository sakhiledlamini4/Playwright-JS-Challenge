/**
 * Shared Performance Thresholds Configuration
 * 
 * Defines performance criteria for all test types
 * Usage:
 *   import { getThresholds } from '../config/thresholds.js';
 *   export const options = {
 *     thresholds: getThresholds('smoke') // or 'load', 'stress', 'spike', 'soak'
 *   };
 */

/**
 * Smoke test thresholds - most strict (production quality)
 * For basic sanity checks
 */
export const smokeThresholds = {
  http_req_duration: ['p(95)<500', 'p(99)<1000'],
  http_req_failed: ['rate<0.05'],
  checks: ['rate>0.95']
};

/**
 * Load test thresholds - strict performance expectations
 * For typical load scenarios
 */
export const loadThresholds = {
  http_req_duration: ['p(95)<500', 'p(99)<1000'],
  http_req_failed: ['rate<0.05'],
  checks: ['rate>0.95']
};

/**
 * Stress test thresholds - relaxed (system degradation expected)
 * As load increases, performance may degrade
 */
export const stressThresholds = {
  http_req_duration: ['p(95)<1000', 'p(99)<2000'],
  http_req_failed: ['rate<0.10'],
  checks: ['rate>0.90']
};

/**
 * Spike test thresholds - very relaxed (temporary stress)
 * Spike loads may cause temporary issues
 */
export const spikeThresholds = {
  http_req_duration: ['p(95)<2000', 'p(99)<5000'],
  http_req_failed: ['rate<0.20'],
  checks: ['rate>0.80']
};

/**
 * Soak test thresholds - strict (system stability over time)
 * Long running tests should maintain performance
 */
export const soakThresholds = {
  http_req_duration: ['p(95)<500', 'p(99)<1000'],
  http_req_failed: ['rate<0.01'],
  checks: ['rate>0.95']
};

/**
 * Get thresholds by test type
 */
export const getThresholds = (testType) => {
  const thresholdsMap = {
    smoke: smokeThresholds,
    load: loadThresholds,
    stress: stressThresholds,
    spike: spikeThresholds,
    soak: soakThresholds
  };
  
  return thresholdsMap[testType] || loadThresholds;
};

/**
 * Combined thresholds with percentile breakdowns
 */
export const allThresholds = {
  // Response time percentiles
  'http_req_duration': [
    'p(50)<200',   // Median
    'p(90)<400',   // 90th percentile
    'p(95)<500',   // 95th percentile (critical)
    'p(99)<1000'   // 99th percentile
  ],
  
  // Error rates
  'http_req_failed': ['rate<0.05'],
  
  // Check pass rate
  'checks': ['rate>0.95'],
  
  // Group metrics
  'group_duration': ['p(95)<2000'],
  
  // Connection metrics
  'http_conn_connecting': ['p(95)<100'],
  'http_req_connecting': ['p(95)<100']
};

export default {
  getThresholds,
  smokeThresholds,
  loadThresholds,
  stressThresholds,
  spikeThresholds,
  soakThresholds,
  allThresholds
};
