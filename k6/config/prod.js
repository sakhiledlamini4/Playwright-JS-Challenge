/**
 * Production Environment Configuration
 */
export const prodConfig = {
  env: 'prod',
  baseUrl: 'https://restful-booker.herokuapp.com',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  endpoints: {
    createBooking: '/booking',
    getBooking: '/booking/',
    updateBooking: '/booking/',
    partialUpdateBooking: '/booking/',
    deleteBooking: '/booking/',
    getBookingIds: '/booking',
    auth: '/auth'
  },
  credentials: {
    username: 'admin',
    password: 'password123'
  }
};
