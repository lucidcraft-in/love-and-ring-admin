/**
 * Admin Consultant Routes
 * Routes for admin to manage consultants
 */
const express = require('express');
const router = express.Router();
const consultantController = require('../controllers/consultantController');
const { adminOnly } = require('../middleware/auth');
const { generalLimiter } = require('../middleware/rateLimiter');
const {
  createConsultantValidation,
  approveConsultantValidation,
  rejectConsultantValidation,
  updatePermissionsValidation,
  listConsultantsValidation
} = require('../middleware/validation');

// Apply general rate limiter to all routes
router.use(generalLimiter);

// All routes require admin authentication
router.use(adminOnly);

/**
 * @route   POST /api/admin/consultants
 * @desc    Create a new consultant
 * @access  Admin
 */
router.post('/', createConsultantValidation, consultantController.adminCreateConsultant);

/**
 * @route   GET /api/admin/consultants
 * @desc    Get list of consultants with filters
 * @access  Admin
 * @query   page, limit, status, region, search, sortBy, sortOrder
 */
router.get('/', listConsultantsValidation, consultantController.getConsultants);

/**
 * @route   GET /api/admin/consultants/:id
 * @desc    Get consultant by ID
 * @access  Admin
 */
router.get('/:id', consultantController.getConsultantById);

/**
 * @route   PATCH /api/admin/consultants/:id/approve
 * @desc    Approve a consultant
 * @access  Admin
 * @body    { notify: boolean }
 */
router.patch('/:id/approve', approveConsultantValidation, consultantController.approveConsultant);

/**
 * @route   PATCH /api/admin/consultants/:id/reject
 * @desc    Reject a consultant
 * @access  Admin
 * @body    { reason: string, notify: boolean }
 */
router.patch('/:id/reject', rejectConsultantValidation, consultantController.rejectConsultant);

/**
 * @route   PATCH /api/admin/consultants/:id/permissions
 * @desc    Update consultant permissions
 * @access  Admin
 * @body    { permissions: { create_profile, edit_profile, view_profile, delete_profile } }
 */
router.patch('/:id/permissions', updatePermissionsValidation, consultantController.updatePermissions);

module.exports = router;
