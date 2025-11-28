/**
 * Consultant Controller
 * Handles HTTP requests for consultant management
 */
const jwt = require('jsonwebtoken');
const Consultant = require('../models/Consultant');
const ActivityLog = require('../models/ActivityLog');
const consultantService = require('../services/consultantService');

/**
 * Helper to get request info for logging
 */
const getReqInfo = (req) => ({
  ip: req.ip || req.headers['x-forwarded-for'],
  userAgent: req.headers['user-agent']
});

/**
 * Admin: Create consultant
 * POST /api/admin/consultants
 */
exports.adminCreateConsultant = async (req, res) => {
  try {
    const consultant = await consultantService.createConsultant(
      req.body,
      req.admin._id,
      getReqInfo(req)
    );
    
    res.status(201).json({
      success: true,
      data: {
        consultant: {
          _id: consultant._id,
          username: consultant.username,
          email: consultant.email,
          fullName: consultant.fullName,
          status: consultant.status,
          createdAt: consultant.createdAt
        }
      },
      message: 'Consultant created successfully. Notification email sent.'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: {
        code: 'CREATE_FAILED',
        message: error.message
      }
    });
  }
};

/**
 * Self-register consultant
 * POST /api/consultants/register
 */
exports.selfRegister = async (req, res) => {
  try {
    const consultant = await consultantService.selfRegisterConsultant(
      req.body,
      getReqInfo(req)
    );
    
    res.status(201).json({
      success: true,
      data: {
        consultant: {
          _id: consultant._id,
          username: consultant.username,
          email: consultant.email,
          fullName: consultant.fullName,
          status: consultant.status
        }
      },
      message: 'Registration successful. Your account is pending admin approval.'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: {
        code: 'REGISTRATION_FAILED',
        message: error.message
      }
    });
  }
};

/**
 * Admin: Get consultants list
 * GET /api/admin/consultants
 */
exports.getConsultants = async (req, res) => {
  try {
    const result = await consultantService.getConsultants(req.query);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: error.message
      }
    });
  }
};

/**
 * Admin: Get consultant by ID
 * GET /api/admin/consultants/:id
 */
exports.getConsultantById = async (req, res) => {
  try {
    const consultant = await consultantService.getConsultantById(req.params.id);
    
    res.json({
      success: true,
      data: { consultant }
    });
  } catch (error) {
    const statusCode = error.message === 'Consultant not found' ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: error.message
      }
    });
  }
};

/**
 * Admin: Approve consultant
 * PATCH /api/admin/consultants/:id/approve
 */
exports.approveConsultant = async (req, res) => {
  try {
    const { notify = true } = req.body;
    
    const consultant = await consultantService.approveConsultant(
      req.params.id,
      req.admin._id,
      notify,
      getReqInfo(req)
    );
    
    res.json({
      success: true,
      data: { 
        consultant: {
          _id: consultant._id,
          username: consultant.username,
          status: consultant.status,
          approvedAt: consultant.approvedAt
        }
      },
      message: 'Consultant approved successfully. Password setup email sent.'
    });
  } catch (error) {
    const statusCode = error.message === 'Consultant not found' ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      error: {
        code: 'APPROVE_FAILED',
        message: error.message
      }
    });
  }
};

/**
 * Admin: Reject consultant
 * PATCH /api/admin/consultants/:id/reject
 */
exports.rejectConsultant = async (req, res) => {
  try {
    const { reason, notify = true } = req.body;
    
    const consultant = await consultantService.rejectConsultant(
      req.params.id,
      req.admin._id,
      reason,
      notify,
      getReqInfo(req)
    );
    
    res.json({
      success: true,
      data: { 
        consultant: {
          _id: consultant._id,
          username: consultant.username,
          status: consultant.status,
          rejectedReason: consultant.rejectedReason
        }
      },
      message: 'Consultant rejected.'
    });
  } catch (error) {
    const statusCode = error.message === 'Consultant not found' ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      error: {
        code: 'REJECT_FAILED',
        message: error.message
      }
    });
  }
};

/**
 * Admin: Update consultant permissions
 * PATCH /api/admin/consultants/:id/permissions
 */
exports.updatePermissions = async (req, res) => {
  try {
    const { permissions } = req.body;
    
    const consultant = await consultantService.updatePermissions(
      req.params.id,
      permissions,
      req.admin._id,
      getReqInfo(req)
    );
    
    res.json({
      success: true,
      data: { 
        consultant: {
          _id: consultant._id,
          username: consultant.username,
          permissions: consultant.permissions
        }
      },
      message: 'Permissions updated successfully.'
    });
  } catch (error) {
    const statusCode = error.message === 'Consultant not found' ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      error: {
        code: 'UPDATE_FAILED',
        message: error.message
      }
    });
  }
};

/**
 * Consultant: Login
 * POST /api/auth/consultant/login
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const consultant = await Consultant.findByCredentials(username, password);
    
    // Generate JWT
    const token = jwt.sign(
      { 
        id: consultant._id, 
        role: 'consultant',
        username: consultant.username
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || '24h' }
    );
    
    // Log successful login
    await ActivityLog.log({
      actor: consultant._id,
      actorModel: 'Consultant',
      action: 'CONSULTANT_LOGIN',
      targetType: 'Consultant',
      targetId: consultant._id,
      ipAddress: getReqInfo(req).ip,
      userAgent: getReqInfo(req).userAgent
    });
    
    res.json({
      success: true,
      data: {
        token,
        consultant: {
          _id: consultant._id,
          username: consultant.username,
          email: consultant.email,
          fullName: consultant.fullName,
          agencyName: consultant.agencyName,
          regions: consultant.regions,
          permissions: consultant.permissions,
          status: consultant.status
        }
      }
    });
  } catch (error) {
    // Log failed login attempt
    const consultant = await Consultant.findOne({
      $or: [
        { username: req.body.username?.toLowerCase() },
        { email: req.body.username?.toLowerCase() }
      ]
    });
    
    if (consultant) {
      await ActivityLog.log({
        actor: consultant._id,
        actorModel: 'Consultant',
        action: 'CONSULTANT_LOGIN_FAILED',
        targetType: 'Consultant',
        targetId: consultant._id,
        status: 'FAILURE',
        errorMessage: error.message,
        ipAddress: getReqInfo(req).ip,
        userAgent: getReqInfo(req).userAgent
      });
    }
    
    // Determine status code
    let statusCode = 401;
    if (error.message.includes('pending') || error.message.includes('rejected') || error.message.includes('suspended')) {
      statusCode = 403;
    }
    
    res.status(statusCode).json({
      success: false,
      error: {
        code: 'LOGIN_FAILED',
        message: error.message
      }
    });
  }
};

/**
 * Consultant: Set password after approval
 * POST /api/auth/consultant/set-password
 */
exports.setPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    await consultantService.setPassword(token, password, getReqInfo(req));
    
    res.json({
      success: true,
      message: 'Password set successfully. You can now login.'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: {
        code: 'PASSWORD_SET_FAILED',
        message: error.message
      }
    });
  }
};

/**
 * Consultant: Get own profile
 * GET /api/consultant/me
 */
exports.getProfile = async (req, res) => {
  try {
    const consultant = await Consultant.findById(req.consultant._id)
      .select('-passwordHash -passwordResetToken -passwordResetExpires')
      .lean();
    
    res.json({
      success: true,
      data: { consultant }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: error.message
      }
    });
  }
};

/**
 * Consultant: Get activity logs
 * GET /api/consultant/activity
 */
exports.getActivity = async (req, res) => {
  try {
    const result = await ActivityLog.getConsultantActivity(
      req.consultant._id,
      req.query
    );
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: error.message
      }
    });
  }
};
