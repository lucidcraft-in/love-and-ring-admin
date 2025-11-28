const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { rateLimiter } = require('../middleware/rateLimiter');

// Apply auth and admin middleware to all routes
router.use(authMiddleware);
router.use(adminOnly);

// Apply rate limiting
router.use(rateLimiter({ windowMs: 60000, max: 100 }));

/**
 * @route   GET /api/admin/dashboard/summary
 * @desc    Get dashboard summary metrics
 * @access  Admin only
 * @query   from, to, region
 */
router.get('/summary', dashboardController.getSummary);

/**
 * @route   GET /api/admin/dashboard/trends
 * @desc    Get time-series trend data
 * @access  Admin only
 * @query   metric, from, to, groupBy
 */
router.get('/trends', dashboardController.getTrends);

/**
 * @route   GET /api/admin/dashboard/top
 * @desc    Get top-N lists (cities, consultants)
 * @access  Admin only
 * @query   limit, region
 */
router.get('/top', dashboardController.getTopLists);

/**
 * @route   GET /api/admin/dashboard/realtime
 * @desc    Get recent activity feed
 * @access  Admin only
 * @query   limit
 */
router.get('/realtime', dashboardController.getRealtimeActivity);

/**
 * @route   GET /api/admin/dashboard/stats
 * @desc    Get quick stats for widgets
 * @access  Admin only
 */
router.get('/stats', dashboardController.getQuickStats);

module.exports = router;
