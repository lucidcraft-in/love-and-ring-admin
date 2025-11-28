/**
 * Authentication Middleware
 * Handles JWT verification and role-based access control
 */
const jwt = require('jsonwebtoken');
const Consultant = require('../models/Consultant');
const User = require('../models/User'); // Assuming you have a User model for admins

/**
 * Verify JWT token and attach user to request
 */
const authMiddleware = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      // Get token from header
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'NO_TOKEN',
            message: 'Access denied. No token provided.'
          }
        });
      }
      
      const token = authHeader.split(' ')[1];
      
      // Verify token
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (jwtError) {
        if (jwtError.name === 'TokenExpiredError') {
          return res.status(401).json({
            success: false,
            error: {
              code: 'TOKEN_EXPIRED',
              message: 'Token has expired. Please login again.'
            }
          });
        }
        throw jwtError;
      }
      
      // Get user based on role
      let user;
      if (decoded.role === 'consultant') {
        user = await Consultant.findById(decoded.id).select('-passwordHash');
        
        if (!user) {
          return res.status(401).json({
            success: false,
            error: {
              code: 'USER_NOT_FOUND',
              message: 'Consultant not found.'
            }
          });
        }
        
        // Check if consultant is active
        if (user.status !== 'ACTIVE') {
          const statusMessages = {
            'PENDING': 'Your account is pending approval.',
            'REJECTED': 'Your account has been rejected.',
            'SUSPENDED': 'Your account has been suspended.'
          };
          return res.status(403).json({
            success: false,
            error: {
              code: 'ACCOUNT_NOT_ACTIVE',
              message: statusMessages[user.status] || 'Account is not active.'
            }
          });
        }
        
        req.consultant = user;
        req.userRole = 'consultant';
      } else if (decoded.role === 'admin') {
        user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
          return res.status(401).json({
            success: false,
            error: {
              code: 'USER_NOT_FOUND',
              message: 'Admin user not found.'
            }
          });
        }
        
        req.admin = user;
        req.userRole = 'admin';
      }
      
      req.user = user;
      req.userId = decoded.id;
      
      // Check if role is allowed
      if (allowedRoles.length > 0 && !allowedRoles.includes(req.userRole)) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You do not have permission to access this resource.'
          }
        });
      }
      
      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid token.'
        }
      });
    }
  };
};

/**
 * Admin only middleware
 */
const adminOnly = authMiddleware(['admin']);

/**
 * Consultant only middleware
 */
const consultantOnly = authMiddleware(['consultant']);

/**
 * Permission middleware for consultants
 */
const requirePermission = (permissionKey) => {
  return async (req, res, next) => {
    try {
      if (!req.consultant) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'NOT_CONSULTANT',
            message: 'This action requires consultant access.'
          }
        });
      }
      
      // Refresh consultant permissions from DB
      const consultant = await Consultant.findById(req.consultant._id);
      
      if (!consultant.permissions || !consultant.permissions[permissionKey]) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'PERMISSION_DENIED',
            message: `You do not have the required permission: ${permissionKey.replace('_', ' ')}`
          }
        });
      }
      
      next();
    } catch (error) {
      console.error('Permission middleware error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Error checking permissions.'
        }
      });
    }
  };
};

module.exports = {
  authMiddleware,
  adminOnly,
  consultantOnly,
  requirePermission
};
