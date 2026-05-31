/**
 * Schema Validator for Contract Testing
 * 
 * Validates API responses against defined JSON schemas
 * Ensures API contracts don't break between versions
 */

/**
 * Validate object against schema using simple validation
 */
function validateSchema(data, schema) {
  if (!schema) return true;
  
  // Check required fields
  if (schema.required) {
    for (const field of schema.required) {
      if (!(field in data)) {
        return false;
      }
    }
  }
  
  // Check field types
  if (schema.properties) {
    for (const [field, fieldSchema] of Object.entries(schema.properties)) {
      if (field in data && fieldSchema.type) {
        const actualType = Array.isArray(data[field]) ? 'array' : typeof data[field];
        if (actualType !== fieldSchema.type) {
          return false;
        }
      }
    }
  }
  
  return true;
}

/**
 * Booking creation response schema
 */
export const bookingCreationSchema = {
  type: 'object',
  required: ['bookingid', 'booking'],
  properties: {
    bookingid: { type: 'number' },
    booking: {
      type: 'object',
      properties: {
        firstname: { type: 'string' },
        lastname: { type: 'string' },
        totalprice: { type: 'number' },
        depositpaid: { type: 'boolean' },
        bookingdates: { type: 'object' },
        additionalneeds: { type: 'string' }
      }
    }
  }
};

/**
 * Booking retrieval response schema
 */
export const bookingRetrievalSchema = {
  type: 'object',
  required: ['firstname', 'lastname', 'totalprice', 'depositpaid', 'bookingdates'],
  properties: {
    firstname: { type: 'string' },
    lastname: { type: 'string' },
    totalprice: { type: 'number' },
    depositpaid: { type: 'boolean' },
    bookingdates: { type: 'object' },
    additionalneeds: { type: 'string' }
  }
};

/**
 * Authentication response schema
 */
export const authenticationSchema = {
  type: 'object',
  required: ['token'],
  properties: {
    token: { type: 'string' }
  }
};

/**
 * Booking IDs array schema
 */
export const bookingIdsSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      bookingid: { type: 'number' }
    }
  }
};

/**
 * Schema validator object
 */
export const schemaValidator = {
  /**
   * Validate booking creation response
   */
  validateBookingCreation: function(response) {
    try {
      const data = response.json();
      return validateSchema(data, bookingCreationSchema);
    } catch (e) {
      return false;
    }
  },

  /**
   * Validate booking retrieval response
   */
  validateBookingRetrieval: function(response) {
    try {
      const data = response.json();
      return validateSchema(data, bookingRetrievalSchema);
    } catch (e) {
      return false;
    }
  },

  /**
   * Validate authentication response
   */
  validateAuthentication: function(response) {
    try {
      const data = response.json();
      return validateSchema(data, authenticationSchema);
    } catch (e) {
      return false;
    }
  },

  /**
   * Validate booking IDs list response
   */
  validateBookingIds: function(response) {
    try {
      const data = response.json();
      return Array.isArray(data);
    } catch (e) {
      return false;
    }
  },

  /**
   * Generic schema validation
   */
  validate: function(data, schema) {
    return validateSchema(data, schema);
  }
};

export default schemaValidator;
