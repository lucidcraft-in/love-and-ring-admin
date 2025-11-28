# Consultant Module - Backend API

## Overview

This module adds consultant/broker management functionality to the MatchMate admin portal. Consultants can be onboarded by admins or self-register, require approval, and once active, can manage member profiles based on assigned permissions.

## Features

- ✅ Consultant CRUD with approval workflow (PENDING → ACTIVE/REJECTED)
- ✅ JWT-based authentication for consultants
- ✅ Role-based permissions (create, edit, view, delete profiles)
- ✅ Activity logging for audit trails
- ✅ Rate limiting on login endpoints
- ✅ Email notifications (mock service for dev)
- ✅ Strong password validation

## Environment Variables

Add these to your `.env` file:

```env
# Database
MONGO_URI=mongodb://localhost:27017/matchmate

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRY=24h

# Rate Limiting
RATE_LIMIT_WINDOW=900000    # 15 minutes in milliseconds
RATE_LIMIT_MAX=100          # Max requests per window

# Email Service (Production)
MAILER_HOST=smtp.example.com
MAILER_PORT=587
MAILER_SECURE=false
MAILER_USER=your-email@example.com
MAILER_PASS=your-email-password
MAILER_FROM="MatchMate Admin" <noreply@matchmate.com>

# Client URL (for password reset links)
CLIENT_URL=http://localhost:3000

# Test Database (for running tests)
MONGO_TEST_URI=mongodb://localhost:27017/matchmate-test
```

## Installation

1. Install dependencies:
```bash
cd server
npm install express mongoose bcryptjs jsonwebtoken express-validator express-rate-limit nodemailer
npm install --save-dev jest supertest
```

2. Add routes to your main Express app (`server.js` or `app.js`):
```javascript
const adminConsultantRoutes = require('./routes/adminConsultantRoutes');
const consultantAuthRoutes = require('./routes/consultantAuthRoutes');
const consultantRoutes = require('./routes/consultantRoutes');

// Admin routes for consultant management
app.use('/api/admin/consultants', adminConsultantRoutes);

// Consultant authentication routes
app.use('/api/consultants', consultantAuthRoutes);  // For self-registration
app.use('/api/auth/consultant', consultantAuthRoutes);  // For login/password

// Authenticated consultant routes
app.use('/api/consultant', consultantRoutes);
```

3. Ensure your User model (admin) exists and has appropriate fields.

## Database Indexes

The Consultant model automatically creates these indexes:
- `username` (unique)
- `email` (unique)
- `status`
- `regions`
- `createdAt`

Run this in MongoDB shell if needed:
```javascript
db.consultants.createIndex({ username: 1 }, { unique: true });
db.consultants.createIndex({ email: 1 }, { unique: true });
db.consultants.createIndex({ status: 1 });
db.consultants.createIndex({ regions: 1 });
```

## API Endpoints

### Admin Routes (`/api/admin/consultants`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create consultant |
| GET | `/` | List consultants (with filters) |
| GET | `/:id` | Get consultant by ID |
| PATCH | `/:id/approve` | Approve consultant |
| PATCH | `/:id/reject` | Reject consultant |
| PATCH | `/:id/permissions` | Update permissions |

### Consultant Auth Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/consultants/register` | Self-register |
| POST | `/api/auth/consultant/login` | Login |
| POST | `/api/auth/consultant/set-password` | Set password after approval |

### Consultant Routes (`/api/consultant`)

| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| GET | `/me` | Get own profile | - |
| GET | `/activity` | Get activity logs | - |
| POST | `/profiles` | Create profile | create_profile |
| GET | `/profiles` | List profiles | view_profile |
| GET | `/profiles/:id` | Get profile | view_profile |
| PATCH | `/profiles/:id` | Update profile | edit_profile |
| DELETE | `/profiles/:id` | Delete profile | delete_profile |

## Request/Response Format

### Create Consultant (Admin)
```json
// POST /api/admin/consultants
{
  "username": "broker1",
  "email": "broker1@agency.com",
  "fullName": "Ravi Kumar",
  "phone": "+919876543210",
  "agencyName": "Shubh Matches",
  "regions": ["Mumbai", "Pune"],
  "permissions": {
    "create_profile": true,
    "edit_profile": true,
    "view_profile": true,
    "delete_profile": false
  }
}
```

### Response Envelope
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}

// Error response
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": [] // Optional validation errors
  }
}
```

## Testing

Run tests:
```bash
npm test -- --testPathPattern=consultant.test.js
```

## Folder Structure

```
server/
├── models/
│   ├── Consultant.js       # Consultant schema
│   ├── ActivityLog.js      # Activity logging
│   └── MemberProfile.js    # Member profile schema
├── controllers/
│   ├── consultantController.js
│   └── profileController.js
├── services/
│   ├── consultantService.js
│   └── emailService.js
├── middleware/
│   ├── auth.js             # JWT & role verification
│   ├── validation.js       # Input validation rules
│   └── rateLimiter.js      # Rate limiting
├── routes/
│   ├── adminConsultantRoutes.js
│   ├── consultantAuthRoutes.js
│   └── consultantRoutes.js
└── tests/
    └── consultant.test.js
```

## Security Considerations

1. **Password Requirements**: Min 8 chars, uppercase, lowercase, digit, special char
2. **Rate Limiting**: 5 login attempts per 15 minutes
3. **Account Locking**: 5 failed attempts = 2 hour lock
4. **JWT Expiry**: 24 hours (configurable)
5. **Password Hashing**: bcrypt with 12 salt rounds
6. **Input Validation**: express-validator on all endpoints

## Consultant Lifecycle

```
[Create] → PENDING → [Admin Approve] → ACTIVE → [Login]
                   → [Admin Reject] → REJECTED
                   
ACTIVE → [Admin Suspend] → SUSPENDED
```

Only ACTIVE consultants can log in. Status changes are logged in ActivityLog.
