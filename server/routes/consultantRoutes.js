/**
 * Consultant Routes
 * Routes for authenticated consultants to manage profiles
 */
const express = require('express');
const router = express.Router();
const consultantController = require('../controllers/consultantController');
const profileController = require('../controllers/profileController');
const { consultantOnly, requirePermission } = require('../middleware/auth');
const { generalLimiter } = require('../middleware/rateLimiter');
const { createProfileValidation } = require('../middleware/validation');

// Apply rate limiter
router.use(generalLimiter);

// All routes require consultant authentication
router.use(consultantOnly);

/**
 * @route   GET /api/consultant/me
 * @desc    Get current consultant's profile
 * @access  Consultant
 */
router.get('/me', consultantController.getProfile);

/**
 * @route   GET /api/consultant/activity
 * @desc    Get consultant's activity logs
 * @access  Consultant
 * @query   page, limit, action, startDate, endDate
 */
router.get('/activity', consultantController.getActivity);

// ==================== PROFILE MANAGEMENT ====================

/**
 * @route   POST /api/consultant/profiles
 * @desc    Create a new member profile
 * @access  Consultant (requires create_profile permission)
 */
router.post(
  '/profiles',
  requirePermission('create_profile'),
  createProfileValidation,
  profileController.createProfile
);

/**
 * @route   GET /api/consultant/profiles
 * @desc    Get list of profiles
 * @access  Consultant (requires view_profile permission)
 * @query   page, limit, status, gender, search, myProfiles
 */
router.get(
  '/profiles',
  requirePermission('view_profile'),
  profileController.getProfiles
);

/**
 * @route   GET /api/consultant/profiles/:id
 * @desc    Get profile by ID
 * @access  Consultant (requires view_profile permission)
 */
router.get(
  '/profiles/:id',
  requirePermission('view_profile'),
  profileController.getProfileById
);

/**
 * @route   PATCH /api/consultant/profiles/:id
 * @desc    Update a profile
 * @access  Consultant (requires edit_profile permission)
 */
router.patch(
  '/profiles/:id',
  requirePermission('edit_profile'),
  profileController.updateProfile
);

/**
 * @route   DELETE /api/consultant/profiles/:id
 * @desc    Delete a profile (soft delete)
 * @access  Consultant (requires delete_profile permission)
 */
router.delete(
  '/profiles/:id',
  requirePermission('delete_profile'),
  profileController.deleteProfile
);

module.exports = router;
