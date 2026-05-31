/**
 * User Journey Scenarios for Restful Booker
 * 
 * Implements complete real-world workflows that virtual users follow
 */

import { check, sleep } from 'k6';
import apiClient from '../helpers/apiClient.js';
import dataGenerator from '../data/dataGenerator.js';

/**
 * Complete booking lifecycle workflow
 * Authenticate → Create Booking → Get Booking → Update Booking → Delete Booking
 */
export const completeBookingJourney = {
  /**
   * Step 1: Authenticate with the API
   */
  authenticate: function() {
    const authPayload = JSON.stringify(dataGenerator.generateAuthPayload());
    const response = apiClient.authenticate(authPayload);
    
    check(response, {
      'authentication successful': (r) => r.status === 200,
      'auth response has token': (r) => r.json('token') !== null
    });
    
    sleep(0.5);
    return response.json('token');
  },

  /**
   * Step 2: Create a new booking
   */
  createBooking: function(token = null) {
    const bookingPayload = JSON.stringify(
      dataGenerator.generateBookingPayload(__VU, __ITER)
    );
    const response = apiClient.createBooking(bookingPayload);
    
    check(response, {
      'booking created': (r) => r.status === 200,
      'booking has ID': (r) => r.json('bookingid') !== null,
      'booking has details': (r) => r.json('booking') !== null
    });
    
    sleep(0.5);
    return response.json('bookingid');
  },

  /**
   * Step 3: Retrieve booking details
   */
  getBooking: function(bookingId) {
    const response = apiClient.getBooking(bookingId);
    
    check(response, {
      'get booking successful': (r) => r.status === 200,
      'response contains firstname': (r) => r.json('firstname') !== null,
      'response contains lastname': (r) => r.json('lastname') !== null
    });
    
    sleep(0.5);
    return response.json();
  },

  /**
   * Step 4: Update existing booking
   */
  updateBooking: function(bookingId, token = null) {
    const updatePayload = JSON.stringify(
      dataGenerator.generateUpdatePayload(__VU, __ITER)
    );
    const response = apiClient.updateBooking(bookingId, updatePayload, token);
    
    check(response, {
      'booking updated': (r) => r.status === 200,
      'updated firstname present': (r) => r.json('firstname') !== null
    });
    
    sleep(0.5);
    return response.json();
  },

  /**
   * Step 5: Partial update of booking
   */
  partialUpdateBooking: function(bookingId, token = null) {
    const partialPayload = JSON.stringify(
      dataGenerator.generatePartialUpdatePayload(__VU, __ITER)
    );
    const response = apiClient.partialUpdateBooking(bookingId, partialPayload, token);
    
    check(response, {
      'partial update successful': (r) => r.status === 200 || r.status === 403
    });
    
    sleep(0.5);
    return response;
  },

  /**
   * Step 6: Delete booking
   */
  deleteBooking: function(bookingId, token = null) {
    const response = apiClient.deleteBooking(bookingId, token);
    
    check(response, {
      'booking deleted': (r) => r.status === 201 || r.status === 200 || r.status === 204
    });
    
    sleep(0.5);
    return response;
  },

  /**
   * Execute complete booking workflow
   */
  executeCompleteWorkflow: function() {
    // Step 1: Create a booking
    const bookingId = this.createBooking();
    
    if (!bookingId) {
      console.log('Failed to create booking');
      return false;
    }
    
    // Step 2: Get the booking
    const booking = this.getBooking(bookingId);
    if (!booking) {
      console.log('Failed to retrieve booking');
      return false;
    }
    
    // Step 3: Update the booking
    const updated = this.updateBooking(bookingId);
    if (!updated) {
      console.log('Failed to update booking');
      return false;
    }
    
    // Step 4: Partial update
    this.partialUpdateBooking(bookingId);
    
    // Step 5: Delete the booking
    this.deleteBooking(bookingId);
    
    return true;
  }
};

/**
 * Quick booking workflow (simplified for spike testing)
 */
export const quickBookingJourney = {
  /**
   * Quick journey: Create and retrieve only
   */
  executeQuickWorkflow: function() {
    const bookingId = completeBookingJourney.createBooking();
    if (!bookingId) return false;
    
    completeBookingJourney.getBooking(bookingId);
    return true;
  }
};

/**
 * Read-heavy workflow (simulates users browsing)
 */
export const readHeavyJourney = {
  /**
   * Get bookings by date range
   */
  getBookingsByDateRange: function() {
    const dateRange = dataGenerator.generateDateRangePayload();
    const response = apiClient.getBookingsByDateRange(dateRange);
    
    check(response, {
      'date range query successful': (r) => r.status === 200,
      'returns array': (r) => Array.isArray(r.json())
    });
    
    return response.json();
  },

  /**
   * Get all booking IDs
   */
  getAllBookingIds: function() {
    const response = apiClient.getAllBookingIds();
    
    check(response, {
      'get all IDs successful': (r) => r.status === 200,
      'returns array': (r) => Array.isArray(r.json())
    });
    
    sleep(0.5);
    return response.json();
  },

  /**
   * Execute read-heavy workflow
   */
  executeReadWorkflow: function() {
    this.getAllBookingIds();
    this.getBookingsByDateRange();
    
    // Optionally get a random booking
    const bookingIds = this.getAllBookingIds();
    if (bookingIds && bookingIds.length > 0) {
      const randomId = bookingIds[Math.floor(Math.random() * bookingIds.length)];
      completeBookingJourney.getBooking(randomId);
    }
    
    return true;
  }
};

export default {
  completeBookingJourney,
  quickBookingJourney,
  readHeavyJourney
};
