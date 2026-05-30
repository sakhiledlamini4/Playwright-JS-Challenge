import http from 'k6/http';
import config from '../../Restful-Booker/config/config-manager.js';

const commonFunctions = {
    
    bookingRequest: function (payload) {
        const params = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };
        return http.post(config.baseUrl + config.endpoints.createBooking, payload, params);
    },

    getBooking: function (bookingId) {
        const params = {
            headers: {
                'Accept': 'application/json'
            }
        };
        return http.get(`${config.baseUrl}${config.endpoints.getBooking}${bookingId}`, params);
    }
};

export default commonFunctions;