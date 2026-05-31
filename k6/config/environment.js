/**
 * Unified Environment Configuration
 * 
 * Usage:
 *   k6 run test.js --env ENV=dev
 *   k6 run test.js --env ENV=staging
 *   k6 run test.js --env ENV=prod
 * 
 * In test file:
 *   import config from './config/environment.js';
 *   // config.baseUrl, config.endpoints, etc.
 */

import { devConfig } from './dev.js';
import { stagingConfig } from './staging.js';
import { prodConfig } from './prod.js';

// Get environment from __ENV variable or default to 'dev'
const environment = __ENV.ENV || 'dev';

// Configuration mapping
const configs = {
  dev: devConfig,
  staging: stagingConfig,
  prod: prodConfig
};

// Get the appropriate configuration
export const config = configs[environment] || devConfig;

// Export default for convenience
export default config;

// Log which environment is being used
console.log(`🔧 Running tests in ${config.env.toUpperCase()} environment`);
console.log(`📍 Base URL: ${config.baseUrl}`);
