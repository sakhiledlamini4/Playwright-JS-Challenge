import http from 'k6/http';
import config from '../config/environment.js';

const apiClient = {
    
    /**
     * Authenticate with the API
     */
    authenticate: function (payload) {
        const params = {
            headers: config.headers
        };
        return http.post(config.baseUrl + config.endpoints.auth, payload, params);
    },

    /**
     * Create a new booking
     */
    createBooking: function (payload) {
        const params = {
            headers: config.headers
        };
        return http.post(config.baseUrl + config.endpoints.createBooking, payload, params);
    },

    /**
     * Alias for createBooking (backward compatibility)
     */
    bookingRequest: function (payload) {
        return this.createBooking(payload);
    },

    /**
     * Get booking by ID
     */
    getBooking: function (bookingId) {
        const params = {
            headers: config.headers
        };
        return http.get(`${config.baseUrl}${config.endpoints.getBooking}${bookingId}`, params);
    },

    /**
     * Get all booking IDs
     */
    getAllBookingIds: function () {
        const params = {
            headers: config.headers
        };
        return http.get(config.baseUrl + config.endpoints.getBookingIds, params);
    },

    /**
     * Get bookings by date range
     */
    getBookingsByDateRange: function (dateParams) {
        const params = {
            headers: config.headers,
            tags: { name: 'GetBookingsByDateRange' }
        };
        const queryString = `?checkin=${dateParams.checkin}&checkout=${dateParams.checkout}`;
        return http.get(config.baseUrl + config.endpoints.getBookingIds + queryString, params);
    },

    /**
     * Update entire booking (requires authentication in some APIs)
     */
    updateBooking: function (bookingId, payload, token = null) {
        const params = {
            headers: { ...config.headers }
        };
        if (token) {
            params.headers['Cookie'] = `token=${token}`;
        }
        return http.put(`${config.baseUrl}${config.endpoints.updateBooking}${bookingId}`, payload, params);
    },

    /**
     * Partial update of booking (PATCH)
     */
    partialUpdateBooking: function (bookingId, payload, token = null) {
        const params = {
            headers: { ...config.headers }
        };
        if (token) {
            params.headers['Cookie'] = `token=${token}`;
        }
        return http.patch(`${config.baseUrl}${config.endpoints.partialUpdateBooking}${bookingId}`, payload, params);
    },

    /**
     * Delete a booking
     */
    deleteBooking: function (bookingId, token = null) {
        const params = {
            headers: config.headers
        };
        if (token) {
            params.headers['Cookie'] = `token=${token}`;
        }
        return http.del(`${config.baseUrl}${config.endpoints.deleteBooking}${bookingId}`, null, params);
    }
};

export default apiClient;