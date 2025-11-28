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

describe('User API', () => {
  let testUserId;

  beforeAll(async () => {
    const mongoUri = process.env.MONGO_TEST_URI || 'mongodb://localhost:27017/matchmate_test';
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    
    // Seed test users
    const users = await User.insertMany([
      { username: 'activeuser', email: 'active@test.com', fullName: 'Active User', isActive: true, membership: 'Premium', location: { city: 'Mumbai' } },
      { username: 'inactiveuser', email: 'inactive@test.com', fullName: 'Inactive User', isActive: false, membership: 'Free' },
      { username: 'suspendeduser', email: 'suspended@test.com', fullName: 'Suspended User', isActive: true, isSuspended: true, membership: 'Free' },
      { username: 'pendinguser', email: 'pending@test.com', fullName: 'Pending User', isActive: true, isVerified: false, membership: 'Free' }
    ]);
    testUserId = users[0]._id.toString();
  });

  describe('GET /api/admin/users', () => {
    it('should return paginated users list', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.meta).toHaveProperty('total');
      expect(res.body.meta).toHaveProperty('page');
      expect(res.body.meta).toHaveProperty('limit');
      expect(res.body.meta).toHaveProperty('pages');
    });

    it('should support pagination', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .query({ page: 1, limit: 2 })
        .expect(200);

      expect(res.body.data.length).toBeLessThanOrEqual(2);
      expect(res.body.meta.limit).toBe(2);
    });

    it('should filter by status=active', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .query({ status: 'active' })
        .expect(200);

      expect(res.body.data.every(u => u.isActive && !u.isSuspended)).toBe(true);
    });

    it('should filter by status=suspended', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .query({ status: 'suspended' })
        .expect(200);

      expect(res.body.data.every(u => u.isSuspended)).toBe(true);
    });

    it('should search by name', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .query({ search: 'Active' })
        .expect(200);

      expect(res.body.data.some(u => u.fullName.includes('Active'))).toBe(true);
    });

    it('should filter by membership', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .query({ membership: 'Premium' })
        .expect(200);

      expect(res.body.data.every(u => u.membership === 'Premium')).toBe(true);
    });

    it('should sort by createdAt descending by default', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .expect(200);

      if (res.body.data.length >= 2) {
        const first = new Date(res.body.data[0].createdAt);
        const second = new Date(res.body.data[1].createdAt);
        expect(first >= second).toBe(true);
      }
    });

    it('should return card-friendly format', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .expect(200);

      const user = res.body.data[0];
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('username');
      expect(user).toHaveProperty('fullName');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('isActive');
      expect(user).toHaveProperty('quickActions');
      expect(user).not.toHaveProperty('passwordHash');
    });
  });

  describe('GET /api/admin/users/:id', () => {
    it('should return user details', async () => {
      const res = await request(app)
        .get(`/api/admin/users/${testUserId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(testUserId);
      expect(res.body.data.username).toBe('activeuser');
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/admin/users/${fakeId}`)
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('User not found');
    });

    it('should return 400 for invalid ObjectId', async () => {
      const res = await request(app)
        .get('/api/admin/users/invalid-id')
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/admin/users', () => {
    it('should create a new user', async () => {
      const userData = {
        username: 'newuser',
        email: 'new@test.com',
        fullName: 'New User',
        phone: '+919876543210'
      };

      const res = await request(app)
        .post('/api/admin/users')
        .send(userData)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.username).toBe('newuser');
      expect(res.body.data.email).toBe('new@test.com');
    });

    it('should reject duplicate email', async () => {
      const res = await request(app)
        .post('/api/admin/users')
        .send({
          username: 'uniqueuser',
          email: 'active@test.com', // Already exists
          fullName: 'Duplicate Email'
        })
        .expect(409);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Email');
    });

    it('should reject duplicate username', async () => {
      const res = await request(app)
        .post('/api/admin/users')
        .send({
          username: 'activeuser', // Already exists
          email: 'unique@test.com',
          fullName: 'Duplicate Username'
        })
        .expect(409);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Username');
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/admin/users')
        .send({ fullName: 'Missing Required' })
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  describe('PATCH /api/admin/users/:id', () => {
    it('should update user', async () => {
      const res = await request(app)
        .patch(`/api/admin/users/${testUserId}`)
        .send({ fullName: 'Updated Name' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.fullName).toBe('Updated Name');
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .patch(`/api/admin/users/${fakeId}`)
        .send({ fullName: 'Test' })
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/admin/users/:id', () => {
    it('should soft delete user by default', async () => {
      const res = await request(app)
        .delete(`/api/admin/users/${testUserId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.hard).toBe(false);

      // User should not appear in list
      const listRes = await request(app)
        .get('/api/admin/users')
        .expect(200);

      expect(listRes.body.data.find(u => u.id === testUserId)).toBeUndefined();
    });

    it('should hard delete when hard=true', async () => {
      const res = await request(app)
        .delete(`/api/admin/users/${testUserId}`)
        .query({ hard: 'true' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.hard).toBe(true);
    });
  });

  describe('POST /api/admin/users/:id/status', () => {
    it('should activate user', async () => {
      // First deactivate
      await User.findByIdAndUpdate(testUserId, { isActive: false });

      const res = await request(app)
        .post(`/api/admin/users/${testUserId}/status`)
        .send({ action: 'activate' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.isActive).toBe(true);
    });

    it('should suspend user', async () => {
      const res = await request(app)
        .post(`/api/admin/users/${testUserId}/status`)
        .send({ action: 'suspend', reason: 'Violation of terms' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.isSuspended).toBe(true);
    });

    it('should reject invalid action', async () => {
      const res = await request(app)
        .post(`/api/admin/users/${testUserId}/status`)
        .send({ action: 'invalid' })
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/admin/users/bulk', () => {
    it('should perform bulk activate', async () => {
      const users = await User.find({ isActive: false });
      const ids = users.map(u => u._id.toString());

      const res = await request(app)
        .post('/api/admin/users/bulk')
        .send({ action: 'activate', ids })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.success.length).toBe(ids.length);
    });

    it('should perform bulk suspend', async () => {
      const users = await User.find({ isActive: true });
      const ids = users.slice(0, 2).map(u => u._id.toString());

      const res = await request(app)
        .post('/api/admin/users/bulk')
        .send({ action: 'suspend', ids })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.success.length).toBe(2);
    });

    it('should reject empty ids array', async () => {
      const res = await request(app)
        .post('/api/admin/users/bulk')
        .send({ action: 'activate', ids: [] })
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/admin/users/export', () => {
    it('should return CSV content', async () => {
      const res = await request(app)
        .get('/api/admin/users/export')
        .expect(200);

      expect(res.headers['content-type']).toContain('text/csv');
      expect(res.headers['content-disposition']).toContain('attachment');
      expect(res.text).toContain('ID');
      expect(res.text).toContain('Username');
      expect(res.text).toContain('Email');
    });

    it('should respect filters', async () => {
      const res = await request(app)
        .get('/api/admin/users/export')
        .query({ membership: 'Premium' })
        .expect(200);

      expect(res.headers['content-type']).toContain('text/csv');
    });
  });

  describe('GET /api/admin/users/:id/activity', () => {
    it('should return user activity logs', async () => {
      const res = await request(app)
        .get(`/api/admin/users/${testUserId}/activity`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.meta).toHaveProperty('total');
    });
  });
});
