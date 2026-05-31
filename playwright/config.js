/**
 * Playwright Environment Configuration
 * 
 * Usage:
 *   Set environment variable: ENV=dev|staging|prod
 *   npx playwright test
 */

const devConfig = {
  env: 'dev',
  baseUrl: 'https://restful-booker.herokuapp.com',
  timeout: 30000,
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

const stagingConfig = {
  env: 'staging',
  baseUrl: 'https://restful-booker-staging.herokuapp.com',
  timeout: 30000,
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

const prodConfig = {
  env: 'prod',
  baseUrl: 'https://restful-booker.herokuapp.com',
  timeout: 30000,
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

// Get environment from process.env or default to 'dev'
const environment = process.env.ENV || 'dev';

const configs = {
  dev: devConfig,
  staging: stagingConfig,
  prod: prodConfig
};

const config = configs[environment] || devConfig;

console.log(`🔧 Playwright tests running in ${config.env.toUpperCase()} environment`);
console.log(`📍 Base URL: ${config.baseUrl}`);

export default config;
