const dashboardService = require('../services/dashboardService');

/**
 * Dashboard Controller
 * Handles HTTP requests for dashboard endpoints
 */
const dashboardController = {
  /**
   * GET /api/admin/dashboard/summary
   * Returns aggregated dashboard metrics
   */
  async getSummary(req, res, next) {
    try {
      const { from, to, region } = req.query;

      const summary = await dashboardService.getSummary({ from, to, region });

      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/admin/dashboard/trends
   * Returns time-series trend data
   */
  async getTrends(req, res, next) {
    try {
      const { metric = 'users', from, to, groupBy = 'day' } = req.query;

      // Validate groupBy
      const validGroupBy = ['day', 'week', 'month'];
      if (!validGroupBy.includes(groupBy)) {
        return res.status(400).json({
          success: false,
          error: `Invalid groupBy value. Must be one of: ${validGroupBy.join(', ')}`
        });
      }

      const trends = await dashboardService.getTrends({ metric, from, to, groupBy });

      res.json({
        success: true,
        data: trends
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/admin/dashboard/top
   * Returns top-N lists (cities, consultants, etc.)
   */
  async getTopLists(req, res, next) {
    try {
      const { limit = 10, region } = req.query;

      const topLists = await dashboardService.getTopLists({
        limit: parseInt(limit, 10),
        region
      });

      res.json({
        success: true,
        data: topLists
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/admin/dashboard/realtime
   * Returns recent activity feed
   */
  async getRealtimeActivity(req, res, next) {
    try {
      const { limit = 50 } = req.query;

      const activities = await dashboardService.getRealtimeActivity({
        limit: parseInt(limit, 10)
      });

      res.json({
        success: true,
        data: activities
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/admin/dashboard/stats
   * Quick stats endpoint for widgets
   */
  async getQuickStats(req, res, next) {
    try {
      const summary = await dashboardService.getSummary({});

      // Return simplified stats for widgets
      res.json({
        success: true,
        data: {
          totalUsers: summary.totalUsers,
          activeUsers: summary.activeUsers,
          premiumUsers: summary.premiumUsers,
          newThisWeek: summary.newThisWeek,
          pendingVerifications: summary.pendingVerifications,
          consultantsCount: summary.consultantsCount
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = dashboardController;
