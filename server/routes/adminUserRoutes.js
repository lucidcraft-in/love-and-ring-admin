const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { rateLimiter } = require('../middleware/rateLimiter');
const {
  validateCreateUser,
  validateUpdateUser,
  validateStatusChange,
  validateBulkAction,
  validateObjectId
} = require('../middleware/validation');

// Apply auth and admin middleware to all routes
router.use(authMiddleware);
router.use(adminOnly);

// Apply rate limiting
router.use(rateLimiter({ windowMs: 60000, max: 100 }));

/**
 * @route   GET /api/admin/users
 * @desc    List users with pagination and filters
 * @access  Admin only
 * @query   page, limit, search, status, role, sortBy, sortOrder, region, createdFrom, createdTo, tags, membership
 */
router.get('/', userController.listUsers);

/**
 * @route   GET /api/admin/users/export
 * @desc    Export users to CSV
 * @access  Admin only
 * @query   status, role, region, membership
 */
router.get('/export', userController.exportUsers);

/**
 * @route   POST /api/admin/users/bulk
 * @desc    Bulk actions on multiple users
 * @access  Admin only
 * @body    { action, ids }
 */
router.post('/bulk', validateBulkAction, userController.bulkAction);

/**
 * @route   GET /api/admin/users/:id
 * @desc    Get single user details
 * @access  Admin only
 * @params  id - User ID
 */
router.get('/:id', validateObjectId('id'), userController.getUser);

/**
 * @route   POST /api/admin/users
 * @desc    Create new user
 * @access  Admin only
 * @body    User data
 */
router.post('/', validateCreateUser, userController.createUser);

/**
 * @route   PATCH /api/admin/users/:id
 * @desc    Update user
 * @access  Admin only
 * @params  id - User ID
 * @body    User data (partial)
 */
router.patch('/:id', validateObjectId('id'), validateUpdateUser, userController.updateUser);

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete user (soft or hard)
 * @access  Admin only
 * @params  id - User ID
 * @query   hard - If true, permanently delete
 */
router.delete('/:id', validateObjectId('id'), userController.deleteUser);

/**
 * @route   POST /api/admin/users/:id/status
 * @desc    Change user status
 * @access  Admin only
 * @params  id - User ID
 * @body    { action, reason? }
 */
router.post('/:id/status', validateObjectId('id'), validateStatusChange, userController.changeStatus);

/**
 * @route   GET /api/admin/users/:id/activity
 * @desc    Get user activity logs
 * @access  Admin only
 * @params  id - User ID
 * @query   page, limit
 */
router.get('/:id/activity', validateObjectId('id'), userController.getUserActivity);

module.exports = router;
