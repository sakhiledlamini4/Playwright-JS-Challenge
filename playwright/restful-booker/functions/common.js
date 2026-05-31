import fs from 'fs';
import path from 'path';
import {request} from '@playwright/test';
import config from '../config/config-manager';

const commonFunctions = {

    login: async function (authData) {
        const requestContext = await request.newContext();
        const authResponse = await requestContext.post(config.baseUrl + config.endpoints.login, {
            data: authData,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return authResponse;
    },
    
    createBooking: async function (bookingData) {
        const requestContext = await request.newContext();
        const response = await requestContext.post(config.baseUrl + config.endpoints.createBooking, {
            data: bookingData,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
      return response;
    },

    deleteBooking: async function (bookingId, token) {
        const requestContext = await request.newContext();
        const response = await requestContext.delete(`${config.baseUrl}${config.endpoints.getBooking}${bookingId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${token}`
            }
        });
        return response;
    },

    getAllBookings: async function () {
        const requestContext = await request.newContext();
        const response = await requestContext.get(config.baseUrl + config.endpoints.createBooking, {
            headers: {
                'Accept': 'application/json'
            }
        });
        return response;
    },

    getBookingById: async function (bookingId) {
        const requestContext = await request.newContext();
        const response = await requestContext.get(`${config.baseUrl}${config.endpoints.getBooking}${bookingId}`, {
            headers: {
                'Accept': 'application/json'
            }
        });
        return response;
    },

    getBookingByUserDetails: async function (payload) {
        const requestContext = await request.newContext();
        const response = await requestContext.get(config.baseUrl + config.endpoints.createBooking, {
            data: payload 
        });
        return response;
    },

    updateBooking: async function (bookingId, bookingData, token) {
        const requestContext = await request.newContext();
        const response = await requestContext.patch(`${config.baseUrl}${config.endpoints.getBooking}${bookingId}`, {
            data: bookingData,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                Cookie: `token=${token}`
            }
        });
        return response;
    }
};

export default commonFunctions;