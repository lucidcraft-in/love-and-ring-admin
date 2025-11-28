const userService = require('../services/userService');
const { validationResult } = require('express-validator');

/**
 * User Controller
 * Handles HTTP requests for user management endpoints
 */
const userController = {
  /**
   * GET /api/admin/users
   * List users with pagination and filters
   */
  async listUsers(req, res, next) {
    try {
      const {
        page = 1,
        limit = 20,
        search,
        status,
        role,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        region,
        createdFrom,
        createdTo,
        tags,
        membership
      } = req.query;

      const result = await userService.listUsers({
        page: parseInt(page, 10),
        limit: Math.min(parseInt(limit, 10), 100), // Max 100 per page
        search,
        status,
        role,
        sortBy,
        sortOrder,
        region,
        createdFrom,
        createdTo,
        tags: tags ? (Array.isArray(tags) ? tags : tags.split(',')) : undefined,
        membership
      });

      res.json({
        success: true,
        data: result.data,
        meta: result.meta
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/admin/users/:id
   * Get single user details
   */
  async getUser(req, res, next) {
    try {
      const { id } = req.params;

      const user = await userService.getUserById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/admin/users
   * Create new user
   */
  async createUser(req, res, next) {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const createdBy = req.user?.id; // From auth middleware

      const user = await userService.createUser(req.body, createdBy);

      res.status(201).json({
        success: true,
        data: user,
        message: 'User created successfully'
      });
    } catch (error) {
      if (error.message.includes('already')) {
        return res.status(409).json({
          success: false,
          error: error.message
        });
      }
      next(error);
    }
  },

  /**
   * PATCH /api/admin/users/:id
   * Update user
   */
  async updateUser(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { id } = req.params;
      const updatedBy = req.user?.id;

      const user = await userService.updateUser(id, req.body, updatedBy);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        data: user,
        message: 'User updated successfully'
      });
    } catch (error) {
      if (error.message.includes('already')) {
        return res.status(409).json({
          success: false,
          error: error.message
        });
      }
      next(error);
    }
  },

  /**
   * DELETE /api/admin/users/:id
   * Delete user (soft or hard)
   */
  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const { hard } = req.query;
      const deletedBy = req.user?.id;

      const result = await userService.deleteUser(id, {
        hard: hard === 'true',
        deletedBy
      });

      if (!result) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        data: result,
        message: result.hard ? 'User permanently deleted' : 'User deactivated'
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/admin/users/:id/status
   * Change user status
   */
  async changeStatus(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { id } = req.params;
      const { action, reason } = req.body;
      const performedBy = req.user?.id;

      const validActions = ['activate', 'deactivate', 'suspend', 'unsuspend', 'verify', 'unverify'];
      if (!validActions.includes(action)) {
        return res.status(400).json({
          success: false,
          error: `Invalid action. Must be one of: ${validActions.join(', ')}`
        });
      }

      const user = await userService.changeStatus(id, { action, reason, performedBy });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        data: user,
        message: `User ${action}d successfully`
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/admin/users/bulk
   * Bulk actions on multiple users
   */
  async bulkAction(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { action, ids } = req.body;
      const performedBy = req.user?.id;

      const validActions = ['activate', 'deactivate', 'suspend', 'unsuspend', 'delete', 'verify'];
      if (!validActions.includes(action)) {
        return res.status(400).json({
          success: false,
          error: `Invalid action. Must be one of: ${validActions.join(', ')}`
        });
      }

      const result = await userService.bulkAction({ action, ids, performedBy });

      res.json({
        success: true,
        data: result,
        message: `Bulk ${action} completed. Success: ${result.success.length}, Failed: ${result.failed.length}`
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/admin/users/export
   * Export users to CSV
   */
  async exportUsers(req, res, next) {
    try {
      const { status, role, region, membership } = req.query;

      const result = await userService.exportUsers({ status, role, region, membership });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
      res.send(result.csv);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/admin/users/:id/activity
   * Get user activity logs
   */
  async getUserActivity(req, res, next) {
    try {
      const { id } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const result = await userService.getUserActivity(id, {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
      });

      res.json({
        success: true,
        data: result.data,
        meta: result.meta
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = userController;
