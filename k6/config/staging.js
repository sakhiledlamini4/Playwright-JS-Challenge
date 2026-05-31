/**
 * Staging Environment Configuration
 */
export const stagingConfig = {
  env: 'staging',
  baseUrl: 'https://restful-booker-staging.herokuapp.com',
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
