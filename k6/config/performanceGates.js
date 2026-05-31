/**
 * Performance Gates Configuration
 * 
 * Defines automatic pass/fail criteria for the CI/CD pipeline
 * Pipeline fails if ANY gate threshold is violated
 */

export const performanceGates = {
  /**
   * Response time gates
   * These are critical for user experience
   */
  responseTimes: {
    // 95th percentile must be under 500ms
    p95MaxMs: 500,
    // 99th percentile must be under 1000ms
    p99MaxMs: 1000,
    // Average response time must be under 300ms
    avgMaxMs: 300,
    // Median response time must be under 200ms
    medianMaxMs: 200
  },

  /**
   * Error rate gates
   * Strict limits on failures
   */
  errorRates: {
    // Overall error rate must be below 1%
    maxErrorRate: 0.01,
    // Failed booking creations must be below 0.5%
    maxBookingCreationFailure: 0.005,
    // Failed booking retrievals must be below 0.5%
    maxBookingRetrievalFailure: 0.005
  },

  /**
   * Throughput gates
   * Minimum performance requirements
   */
  throughput: {
    // Must handle at least 10 requests per second
    minRequestsPerSec: 10,
    // Must successfully create at least 5 bookings per second
    minBookingCreationsPerSec: 5
  },

  /**
   * Availability gates
   * System must remain operational
   */
  availability: {
    // Check success rate must be above 95%
    minCheckPassRate: 0.95,
    // API availability must be above 99%
    minApiAvailability: 0.99
  },

  /**
   * Resource gates
   * Prevent resource exhaustion
   */
  resources: {
    // Connection establishment time must be below 100ms
    maxConnectionTimeMs: 100,
    // TLS handshake must complete in reasonable time
    maxTlsTimeMs: 200
  },

  /**
   * Booking operation gates
   * Business-specific requirements
   */
  bookingOperations: {
    // Average booking creation time must be below 400ms
    maxCreationTimeMs: 400,
    // Average booking update time must be below 400ms
    maxUpdateTimeMs: 400,
    // Average booking deletion time must be below 300ms
    maxDeletionTimeMs: 300,
    // At least 95% of check validations must pass
    minCheckPassRate: 0.95
  },

  /**
   * Soak test specific gates
   * For extended duration tests
   */
  soakTest: {
    // Response time must not degrade more than 10% during soak test
    maxResponseTimeDegradationPercent: 10,
    // Error rate must remain stable
    maxErrorRate: 0.01,
    // Memory should not leak (no continuous growth)
    preventMemoryLeaks: true
  }
};

/**
 * Gate validation function
 * Compares actual metrics against gates
 */
export const validateGates = (metrics) => {
  const results = {
    passed: true,
    violations: []
  };

  // Validate response times
  if (metrics.http_req_duration_p95 > performanceGates.responseTimes.p95MaxMs) {
    results.violations.push(
      `P95 response time (${metrics.http_req_duration_p95}ms) exceeds limit (${performanceGates.responseTimes.p95MaxMs}ms)`
    );
    results.passed = false;
  }

  if (metrics.http_req_duration_p99 > performanceGates.responseTimes.p99MaxMs) {
    results.violations.push(
      `P99 response time (${metrics.http_req_duration_p99}ms) exceeds limit (${performanceGates.responseTimes.p99MaxMs}ms)`
    );
    results.passed = false;
  }

  if (metrics.http_req_duration_avg > performanceGates.responseTimes.avgMaxMs) {
    results.violations.push(
      `Average response time (${metrics.http_req_duration_avg}ms) exceeds limit (${performanceGates.responseTimes.avgMaxMs}ms)`
    );
    results.passed = false;
  }

  // Validate error rates
  if (metrics.http_req_failed_rate > performanceGates.errorRates.maxErrorRate) {
    results.violations.push(
      `Error rate (${(metrics.http_req_failed_rate * 100).toFixed(2)}%) exceeds limit (${(performanceGates.errorRates.maxErrorRate * 100).toFixed(2)}%)`
    );
    results.passed = false;
  }

  // Validate throughput
  if (metrics.http_reqs_per_sec < performanceGates.throughput.minRequestsPerSec) {
    results.violations.push(
      `Throughput (${metrics.http_reqs_per_sec}/s) below minimum (${performanceGates.throughput.minRequestsPerSec}/s)`
    );
    results.passed = false;
  }

  // Validate availability
  if (metrics.checks_pass_rate < performanceGates.availability.minCheckPassRate) {
    results.violations.push(
      `Check pass rate (${(metrics.checks_pass_rate * 100).toFixed(2)}%) below minimum (${(performanceGates.availability.minCheckPassRate * 100).toFixed(2)}%)`
    );
    results.passed = false;
  }

  return results;
};

/**
 * Generate gate report
 */
export const generateGateReport = (validationResults) => {
  let report = '\n=== Performance Gates Report ===\n\n';

  if (validationResults.passed) {
    report += '✅ All performance gates PASSED\n';
  } else {
    report += '❌ Performance gates FAILED\n\n';
    report += 'Violations:\n';
    validationResults.violations.forEach((violation, index) => {
      report += `  ${index + 1}. ${violation}\n`;
    });
  }

  return report;
};

export default {
  performanceGates,
  validateGates,
  generateGateReport
};
