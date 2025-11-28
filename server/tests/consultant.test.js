/**
 * Consultant API Tests
 * Unit tests for consultant management endpoints
 */
const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../app'); // Your Express app
const Consultant = require('../models/Consultant');
const User = require('../models/User'); // Admin user model

// Test data
const testAdmin = {
  _id: new mongoose.Types.ObjectId(),
  name: 'Test Admin',
  email: 'admin@test.com',
  role: 'admin'
};

const testConsultantData = {
  username: 'testconsultant',
  email: 'consultant@test.com',
  fullName: 'Test Consultant',
  phone: '+919876543210',
  agencyName: 'Test Agency',
  regions: ['Mumbai', 'Pune'],
  permissions: {
    create_profile: true,
    edit_profile: true,
    view_profile: true,
    delete_profile: false
  }
};

let adminToken;
let consultantToken;
let createdConsultantId;

// Generate admin JWT for testing
const generateAdminToken = () => {
  return jwt.sign(
    { id: testAdmin._id, role: 'admin' },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  );
};

describe('Consultant API Tests', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGO_TEST_URI || 'mongodb://localhost:27017/matchmate-test');
    
    // Create admin token
    adminToken = generateAdminToken();
  });

  afterAll(async () => {
    // Clean up test data
    await Consultant.deleteMany({ email: /@test\.com$/ });
    await mongoose.connection.close();
  });

  // ==================== CREATE CONSULTANT ====================
  describe('POST /api/admin/consultants', () => {
    it('should create a new consultant with PENDING status', async () => {
      const res = await request(app)
        .post('/api/admin/consultants')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(testConsultantData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.consultant).toBeDefined();
      expect(res.body.data.consultant.status).toBe('PENDING');
      expect(res.body.data.consultant.username).toBe(testConsultantData.username);
      
      createdConsultantId = res.body.data.consultant._id;
    });

    it('should reject duplicate username', async () => {
      const res = await request(app)
        .post('/api/admin/consultants')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(testConsultantData);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toContain('already exists');
    });

    it('should reject invalid email', async () => {
      const res = await request(app)
        .post('/api/admin/consultants')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          ...testConsultantData,
          username: 'newuser',
          email: 'invalid-email'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject without admin token', async () => {
      const res = await request(app)
        .post('/api/admin/consultants')
        .send(testConsultantData);

      expect(res.status).toBe(401);
    });
  });

  // ==================== LOGIN BEFORE APPROVAL ====================
  describe('POST /api/auth/consultant/login - Before Approval', () => {
    it('should return 403 for PENDING consultant', async () => {
      // First set a password directly for testing
      const consultant = await Consultant.findById(createdConsultantId);
      consultant.passwordHash = 'TestPassword123!';
      await consultant.save();

      const res = await request(app)
        .post('/api/auth/consultant/login')
        .send({
          username: testConsultantData.username,
          password: 'TestPassword123!'
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toContain('pending');
    });
  });

  // ==================== APPROVE CONSULTANT ====================
  describe('PATCH /api/admin/consultants/:id/approve', () => {
    it('should approve consultant and change status to ACTIVE', async () => {
      const res = await request(app)
        .patch(`/api/admin/consultants/${createdConsultantId}/approve`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ notify: false }); // Don't send email in test

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.consultant.status).toBe('ACTIVE');
      expect(res.body.data.consultant.approvedAt).toBeDefined();
    });

    it('should reject if already approved', async () => {
      const res = await request(app)
        .patch(`/api/admin/consultants/${createdConsultantId}/approve`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ notify: false });

      expect(res.status).toBe(400);
      expect(res.body.error.message).toContain('already approved');
    });

    it('should return 404 for non-existent consultant', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .patch(`/api/admin/consultants/${fakeId}/approve`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ notify: false });

      expect(res.status).toBe(404);
    });
  });

  // ==================== LOGIN AFTER APPROVAL ====================
  describe('POST /api/auth/consultant/login - After Approval', () => {
    beforeAll(async () => {
      // Set password for approved consultant
      const consultant = await Consultant.findById(createdConsultantId);
      consultant.passwordHash = 'TestPassword123!';
      await consultant.save();
    });

    it('should return JWT for ACTIVE consultant', async () => {
      const res = await request(app)
        .post('/api/auth/consultant/login')
        .send({
          username: testConsultantData.username,
          password: 'TestPassword123!'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.consultant.username).toBe(testConsultantData.username);
      
      consultantToken = res.body.data.token;
    });

    it('should reject invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/consultant/login')
        .send({
          username: testConsultantData.username,
          password: 'WrongPassword123!'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  // ==================== PERMISSION ENFORCEMENT ====================
  describe('Permission Enforcement Tests', () => {
    it('should allow profile creation with create_profile permission', async () => {
      const res = await request(app)
        .post('/api/consultant/profiles')
        .set('Authorization', `Bearer ${consultantToken}`)
        .send({
          fullName: 'Test Member',
          gender: 'Male',
          dateOfBirth: '1995-05-15',
          phone: '+919876543211'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('should deny profile deletion without delete_profile permission', async () => {
      // First create a profile
      const createRes = await request(app)
        .post('/api/consultant/profiles')
        .set('Authorization', `Bearer ${consultantToken}`)
        .send({
          fullName: 'Profile To Delete',
          gender: 'Female',
          dateOfBirth: '1998-03-20',
          phone: '+919876543212'
        });

      const profileId = createRes.body.data.profile._id;

      // Try to delete (should fail - delete_profile is false)
      const res = await request(app)
        .delete(`/api/consultant/profiles/${profileId}`)
        .set('Authorization', `Bearer ${consultantToken}`);

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('PERMISSION_DENIED');
    });
  });

  // ==================== REJECT CONSULTANT ====================
  describe('PATCH /api/admin/consultants/:id/reject', () => {
    let rejectionTestConsultantId;

    beforeAll(async () => {
      // Create a consultant to reject
      const consultant = new Consultant({
        username: 'rejecttest',
        email: 'reject@test.com',
        fullName: 'Reject Test',
        phone: '+919876543299',
        status: 'PENDING'
      });
      await consultant.save();
      rejectionTestConsultantId = consultant._id;
    });

    it('should reject consultant with reason', async () => {
      const res = await request(app)
        .patch(`/api/admin/consultants/${rejectionTestConsultantId}/reject`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          reason: 'Incomplete documentation',
          notify: false
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.consultant.status).toBe('REJECTED');
      expect(res.body.data.consultant.rejectedReason).toBe('Incomplete documentation');
    });

    it('should return 403 when REJECTED consultant tries to login', async () => {
      // Set password
      const consultant = await Consultant.findById(rejectionTestConsultantId);
      consultant.passwordHash = 'TestPassword123!';
      await consultant.save();

      const res = await request(app)
        .post('/api/auth/consultant/login')
        .send({
          username: 'rejecttest',
          password: 'TestPassword123!'
        });

      expect(res.status).toBe(403);
      expect(res.body.error.message).toContain('rejected');
    });
  });

  // ==================== UPDATE PERMISSIONS ====================
  describe('PATCH /api/admin/consultants/:id/permissions', () => {
    it('should update consultant permissions', async () => {
      const res = await request(app)
        .patch(`/api/admin/consultants/${createdConsultantId}/permissions`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          permissions: {
            create_profile: true,
            edit_profile: true,
            view_profile: true,
            delete_profile: true // Enable delete permission
          }
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.consultant.permissions.delete_profile).toBe(true);
    });

    it('should now allow profile deletion with updated permission', async () => {
      // Need to get new token with updated permissions
      const loginRes = await request(app)
        .post('/api/auth/consultant/login')
        .send({
          username: testConsultantData.username,
          password: 'TestPassword123!'
        });

      const newToken = loginRes.body.data.token;

      // Create a profile to delete
      const createRes = await request(app)
        .post('/api/consultant/profiles')
        .set('Authorization', `Bearer ${newToken}`)
        .send({
          fullName: 'Delete Me',
          gender: 'Male',
          dateOfBirth: '1990-01-01',
          phone: '+919876543213'
        });

      const profileId = createRes.body.data.profile._id;

      // Now try to delete (should succeed)
      const res = await request(app)
        .delete(`/api/consultant/profiles/${profileId}`)
        .set('Authorization', `Bearer ${newToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // ==================== GET CONSULTANTS LIST ====================
  describe('GET /api/admin/consultants', () => {
    it('should return paginated list of consultants', async () => {
      const res = await request(app)
        .get('/api/admin/consultants')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ page: 1, limit: 10 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.consultants).toBeDefined();
      expect(res.body.data.pagination).toBeDefined();
    });

    it('should filter by status', async () => {
      const res = await request(app)
        .get('/api/admin/consultants')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ status: 'ACTIVE' });

      expect(res.status).toBe(200);
      res.body.data.consultants.forEach(c => {
        expect(c.status).toBe('ACTIVE');
      });
    });

    it('should search by name/email', async () => {
      const res = await request(app)
        .get('/api/admin/consultants')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ search: testConsultantData.fullName });

      expect(res.status).toBe(200);
      expect(res.body.data.consultants.length).toBeGreaterThan(0);
    });
  });
});

// ==================== E2E TEST PLAN ====================
/**
 * E2E Test Plan for Consultant Onboarding Flow
 * 
 * Test Scenario 1: Admin Creates Consultant
 * 1. Admin logs into admin portal
 * 2. Admin navigates to Consultants > Create New
 * 3. Admin fills consultant form with all details
 * 4. Admin submits form
 * 5. System creates consultant with PENDING status
 * 6. System sends "created" email to consultant
 * 7. Consultant appears in admin list with PENDING badge
 * 
 * Test Scenario 2: Consultant Self-Registration
 * 1. Consultant visits registration page
 * 2. Consultant fills registration form
 * 3. Consultant submits form
 * 4. System creates consultant with PENDING status
 * 5. Consultant sees "pending approval" message
 * 6. Admin sees new consultant in PENDING list
 * 
 * Test Scenario 3: Admin Approves Consultant
 * 1. Admin views consultant detail page
 * 2. Admin clicks "Approve" button
 * 3. Modal asks for confirmation
 * 4. Admin confirms approval
 * 5. System updates status to ACTIVE
 * 6. System generates password reset token
 * 7. System sends "approved" email with set-password link
 * 8. Consultant status changes to ACTIVE in list
 * 
 * Test Scenario 4: Consultant Sets Password
 * 1. Consultant clicks link in email
 * 2. Consultant is redirected to set-password page
 * 3. Consultant enters new password (must meet requirements)
 * 4. System validates password strength
 * 5. System saves hashed password
 * 6. System sends confirmation email
 * 7. Consultant is redirected to login page
 * 
 * Test Scenario 5: Consultant Login & Profile CRUD
 * 1. Consultant enters credentials on login page
 * 2. System validates credentials and status
 * 3. System returns JWT token
 * 4. Consultant is redirected to dashboard
 * 5. Consultant creates new member profile
 * 6. Consultant views profile list
 * 7. Consultant edits a profile
 * 8. Consultant attempts to delete (blocked if no permission)
 * 
 * Test Scenario 6: Admin Rejects Consultant
 * 1. Admin views pending consultant
 * 2. Admin clicks "Reject" button
 * 3. Modal prompts for rejection reason
 * 4. Admin enters reason and confirms
 * 5. System updates status to REJECTED
 * 6. System sends rejection email with reason
 * 7. Consultant cannot login (403 with message)
 * 
 * Test Scenario 7: Permission Changes
 * 1. Admin opens consultant's permission editor
 * 2. Admin toggles delete_profile permission ON
 * 3. Admin saves changes
 * 4. Consultant can now delete profiles
 * 5. Admin toggles create_profile permission OFF
 * 6. Consultant can no longer create profiles
 */
