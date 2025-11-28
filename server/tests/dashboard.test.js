const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Adjust path as needed
const User = require('../models/User');

// Mock auth middleware for testing
jest.mock('../middleware/auth', () => ({
  authMiddleware: (req, res, next) => {
    req.user = { id: 'admin123', roles: ['admin'] };
    next();
  },
  adminOnly: (req, res, next) => next()
}));

describe('Dashboard API', () => {
  beforeAll(async () => {
    // Connect to test database
    const mongoUri = process.env.MONGO_TEST_URI || 'mongodb://localhost:27017/matchmate_test';
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clean up and seed test data
    await User.deleteMany({});
    
    // Seed test users
    await User.insertMany([
      { username: 'user1', email: 'user1@test.com', fullName: 'Test User 1', isActive: true, membership: 'Free' },
      { username: 'user2', email: 'user2@test.com', fullName: 'Test User 2', isActive: true, membership: 'Premium' },
      { username: 'user3', email: 'user3@test.com', fullName: 'Test User 3', isActive: false, membership: 'Free' },
      { username: 'user4', email: 'user4@test.com', fullName: 'Test User 4', isActive: true, isSuspended: true, membership: 'Free' },
      { username: 'user5', email: 'user5@test.com', fullName: 'Test User 5', isActive: true, isVerified: false, membership: 'Premium' }
    ]);
  });

  describe('GET /api/admin/dashboard/summary', () => {
    it('should return dashboard summary with expected keys', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard/summary')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('totalUsers');
      expect(res.body.data).toHaveProperty('activeUsers');
      expect(res.body.data).toHaveProperty('newThisWeek');
      expect(res.body.data).toHaveProperty('pendingVerifications');
      expect(res.body.data).toHaveProperty('suspendedUsers');
      expect(res.body.data).toHaveProperty('premiumUsers');
      expect(res.body.data).toHaveProperty('freeUsers');
      expect(res.body.data).toHaveProperty('generatedAt');
    });

    it('should return correct counts', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard/summary')
        .expect(200);

      expect(res.body.data.totalUsers).toBe(5);
      expect(res.body.data.activeUsers).toBe(3); // Active and not suspended
      expect(res.body.data.suspendedUsers).toBe(1);
      expect(res.body.data.premiumUsers).toBe(2);
    });

    it('should accept date range filters', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard/summary')
        .query({
          from: '2024-01-01',
          to: '2024-12-31'
        })
        .expect(200);

      expect(res.body.success).toBe(true);
    });

    it('should accept region filter', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard/summary')
        .query({ region: 'Mumbai' })
        .expect(200);

      expect(res.body.success).toBe(true);
    });
  });

  describe('GET /api/admin/dashboard/trends', () => {
    it('should return trends data', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard/trends')
        .query({ metric: 'users', groupBy: 'day' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('metric', 'users');
      expect(res.body.data).toHaveProperty('groupBy', 'day');
      expect(res.body.data).toHaveProperty('data');
      expect(Array.isArray(res.body.data.data)).toBe(true);
    });

    it('should reject invalid groupBy value', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard/trends')
        .query({ groupBy: 'invalid' })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('should support different groupBy values', async () => {
      for (const groupBy of ['day', 'week', 'month']) {
        const res = await request(app)
          .get('/api/admin/dashboard/trends')
          .query({ groupBy })
          .expect(200);

        expect(res.body.data.groupBy).toBe(groupBy);
      }
    });
  });

  describe('GET /api/admin/dashboard/top', () => {
    it('should return top lists', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard/top')
        .query({ limit: 5 })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('topCities');
      expect(res.body.data).toHaveProperty('membershipDistribution');
    });

    it('should respect limit parameter', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard/top')
        .query({ limit: 3 })
        .expect(200);

      expect(res.body.data.topCities.length).toBeLessThanOrEqual(3);
    });
  });

  describe('GET /api/admin/dashboard/realtime', () => {
    it('should return activity feed', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard/realtime')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should respect limit parameter', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard/realtime')
        .query({ limit: 10 })
        .expect(200);

      expect(res.body.data.length).toBeLessThanOrEqual(10);
    });
  });

  describe('GET /api/admin/dashboard/stats', () => {
    it('should return quick stats', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard/stats')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('totalUsers');
      expect(res.body.data).toHaveProperty('activeUsers');
      expect(res.body.data).toHaveProperty('premiumUsers');
      expect(res.body.data).toHaveProperty('newThisWeek');
    });
  });
});
