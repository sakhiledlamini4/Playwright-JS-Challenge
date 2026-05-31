/**
 * Custom Metrics Module for k6
 * 
 * Tracks business-level metrics beyond standard HTTP metrics
 * Usage:
 *   import { metrics } from '../metrics/customMetrics.js';
 *   metrics.recordBookingCreation(1234);
 */

import { Trend, Counter, Rate, Gauge } from 'k6/metrics';

/**
 * Trend Metrics - for tracking values over time (latency, duration, etc.)
 */
export const bookingCreationTime = new Trend('booking_creation_time', { unit: 'ms' });
export const bookingUpdateTime = new Trend('booking_update_time', { unit: 'ms' });
export const bookingDeleteTime = new Trend('booking_deletion_time', { unit: 'ms' });
export const bookingRetrievalTime = new Trend('booking_retrieval_time', { unit: 'ms' });
export const authenticationTime = new Trend('authentication_time', { unit: 'ms' });
export const apiResponseTime = new Trend('api_response_time', { unit: 'ms' });

/**
 * Counter Metrics - for counting discrete events
 */
export const bookingsCreated = new Counter('booking_created_count');
export const bookingsUpdated = new Counter('booking_updated_count');
export const bookingsDeleted = new Counter('booking_deleted_count');
export const bookingsRetrieved = new Counter('booking_retrieved_count');
export const authenticationAttempts = new Counter('authentication_attempts');
export const apiErrors = new Counter('api_errors_count');

/**
 * Rate Metrics - for tracking success/failure rates
 */
export const bookingFailureRate = new Rate('booking_failure_rate');
export const authenticationFailureRate = new Rate('authentication_failure_rate');
export const apiErrorRate = new Rate('api_error_rate');

/**
 * Gauge Metrics - for tracking current values
 */
export const concurrentBookings = new Gauge('concurrent_bookings');
export const activeUsers = new Gauge('active_users');

/**
 * Comprehensive metrics tracking object
 */
export const metrics = {
  // Record booking creation
  recordBookingCreation: function(duration, success = true) {
    bookingCreationTime.add(duration);
    bookingsCreated.add(1);
    if (!success) {
      bookingFailureRate.add(1, { type: 'create' });
    } else {
      bookingFailureRate.add(0, { type: 'create' });
    }
  },

  // Record booking retrieval
  recordBookingRetrieval: function(duration, success = true) {
    bookingRetrievalTime.add(duration);
    bookingsRetrieved.add(1);
    if (!success) {
      bookingFailureRate.add(1, { type: 'retrieve' });
    } else {
      bookingFailureRate.add(0, { type: 'retrieve' });
    }
  },

  // Record booking update
  recordBookingUpdate: function(duration, success = true) {
    bookingUpdateTime.add(duration);
    bookingsUpdated.add(1);
    if (!success) {
      bookingFailureRate.add(1, { type: 'update' });
    } else {
      bookingFailureRate.add(0, { type: 'update' });
    }
  },

  // Record booking deletion
  recordBookingDeletion: function(duration, success = true) {
    bookingDeleteTime.add(duration);
    bookingsDeleted.add(1);
    if (!success) {
      bookingFailureRate.add(1, { type: 'delete' });
    } else {
      bookingFailureRate.add(0, { type: 'delete' });
    }
  },

  // Record authentication
  recordAuthentication: function(duration, success = true) {
    authenticationTime.add(duration);
    authenticationAttempts.add(1);
    if (!success) {
      authenticationFailureRate.add(1);
    } else {
      authenticationFailureRate.add(0);
    }
  },

  // Record API response
  recordApiResponse: function(duration, statusCode) {
    apiResponseTime.add(duration);
    const isError = statusCode >= 400;
    if (isError) {
      apiErrors.add(1);
      apiErrorRate.add(1);
    } else {
      apiErrorRate.add(0);
    }
  },

  // Update concurrent bookings gauge
  setConcurrentBookings: function(count) {
    concurrentBookings.set(count);
  },

  // Update active users gauge
  setActiveUsers: function(count) {
    activeUsers.set(count);
  }
};

export default metrics;
