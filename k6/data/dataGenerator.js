/**
 * Dynamic Test Data Generator for k6
 * 
 * Generates unique test data for each virtual user to ensure:
 * - No data conflicts in concurrent tests
 * - Realistic variety in test data
 * - Reproducibility with seed
 */

// Simple seeded random number generator for reproducibility
class SeededRandom {
  constructor(seed) {
    this.seed = seed;
  }

  next() {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  nextInt(max) {
    return Math.floor(this.next() * max);
  }

  choice(array) {
    return array[this.nextInt(array.length)];
  }
}

// Mini-faker implementation for k6 (no external dependencies)
class Faker {
  constructor(seed) {
    this.rng = new SeededRandom(seed || Date.now() + Math.random() * 1000);
    this.firstNames = [
      'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'Robert', 'Lisa',
      'James', 'Mary', 'William', 'Patricia', 'Richard', 'Jennifer', 'Thomas', 'Linda',
      'Charles', 'Barbara', 'Christopher', 'Susan', 'Donald', 'Jessica', 'Matthew', 'Sarah',
      'Mark', 'Karen', 'Donald', 'Nancy', 'Steven', 'Sandra', 'Paul', 'Donna'
    ];
    
    this.lastNames = [
      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
      'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
      'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
      'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Young'
    ];

    this.additionalNeeds = [
      'Breakfast',
      'Late checkout',
      'Early check-in',
      'Crib',
      'High chair',
      'Pet',
      'Parking',
      'None'
    ];
  }

  firstName() {
    return this.rng.choice(this.firstNames);
  }

  lastName() {
    return this.rng.choice(this.lastNames);
  }

  fullName() {
    return `${this.firstName()} ${this.lastName()}`;
  }

  dateAfter(baseDate, daysOffset) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().split('T')[0];
  }

  randomBetween(min, max) {
    return Math.floor(this.rng.next() * (max - min + 1)) + min;
  }

  randomPrice(min = 50, max = 1000) {
    return this.randomBetween(min, max);
  }

  randomBoolean() {
    return this.rng.next() > 0.5;
  }

  randomAdditionalNeeds() {
    return this.rng.choice(this.additionalNeeds);
  }
}

// Export data generator functions
export const dataGenerator = {
  /**
   * Generate unique booking data
   * Each VU gets unique data based on __VU and __ITER variables
   */
  generateBookingPayload(vuId = 0, iterationId = 0) {
    const seed = vuId * 100000 + iterationId;
    const faker = new Faker(seed);

    const checkInDate = faker.dateAfter(new Date(), faker.randomBetween(1, 7));
    const checkOutDate = faker.dateAfter(new Date(checkInDate), faker.randomBetween(2, 5));

    return {
      firstname: faker.firstName(),
      lastname: faker.lastName(),
      totalprice: faker.randomPrice(50, 1000),
      depositpaid: faker.randomBoolean(),
      bookingdates: {
        checkin: checkInDate,
        checkout: checkOutDate
      },
      additionalneeds: faker.randomAdditionalNeeds()
    };
  },

  /**
   * Generate authentication payload
   */
  generateAuthPayload() {
    return {
      username: 'admin',
      password: 'password123'
    };
  },

  /**
   * Generate update payload for booking
   */
  generateUpdatePayload(vuId = 0, iterationId = 0) {
    const seed = vuId * 100000 + iterationId;
    const faker = new Faker(seed);

    return {
      firstname: faker.firstName(),
      lastname: faker.lastName(),
      totalprice: faker.randomPrice(50, 1000),
      depositpaid: faker.randomBoolean(),
      bookingdates: {
        checkin: faker.dateAfter(new Date(), faker.randomBetween(1, 7)),
        checkout: faker.dateAfter(new Date(), faker.randomBetween(8, 15))
      },
      additionalneeds: faker.randomAdditionalNeeds()
    };
  },

  /**
   * Generate partial update payload
   */
  generatePartialUpdatePayload(vuId = 0, iterationId = 0) {
    const seed = vuId * 100000 + iterationId;
    const faker = new Faker(seed);

    return {
      firstname: faker.firstName(),
      totalprice: faker.randomPrice(50, 1000)
    };
  },

  /**
   * Generate check-in/checkout dates for querying
   */
  generateDateRangePayload() {
    const faker = new Faker();
    const checkin = faker.dateAfter(new Date(), faker.randomBetween(1, 7));
    const checkout = faker.dateAfter(new Date(checkin), faker.randomBetween(1, 5));

    return {
      checkin: checkin,
      checkout: checkout
    };
  }
};

export default dataGenerator;