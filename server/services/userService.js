const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const { Parser } = require('json2csv');

/**
 * User Service
 * Handles all user-related business logic
 */
class UserService {
  /**
   * List users with pagination, filtering, and sorting
   */
  async listUsers({
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
    membership,
    includeDeleted = false
  } = {}) {
    const query = {};

    // Base filter - exclude soft-deleted unless requested
    if (!includeDeleted) {
      query.deletedAt = null;
    }

    // Search (text search on multiple fields)
    if (search) {
      const searchRegex = new RegExp(this.escapeRegex(search), 'i');
      query.$or = [
        { fullName: searchRegex },
        { email: searchRegex },
        { username: searchRegex },
        { phone: searchRegex }
      ];
    }

    // Status filter
    if (status) {
      switch (status.toLowerCase()) {
        case 'active':
          query.isActive = true;
          query.isSuspended = false;
          break;
        case 'inactive':
          query.isActive = false;
          break;
        case 'suspended':
          query.isSuspended = true;
          break;
        case 'pending':
          query.isVerified = false;
          query.isActive = true;
          break;
        case 'verified':
          query.isVerified = true;
          break;
      }
    }

    // Role filter
    if (role) {
      query.roles = role;
    }

    // Membership filter
    if (membership) {
      query.membership = membership;
    }

    // Region filter
    if (region) {
      query['location.city'] = new RegExp(this.escapeRegex(region), 'i');
    }

    // Date range filter
    if (createdFrom || createdTo) {
      query.createdAt = {};
      if (createdFrom) query.createdAt.$gte = new Date(createdFrom);
      if (createdTo) query.createdAt.$lte = new Date(createdTo);
    }

    // Tags filter
    if (tags && tags.length > 0) {
      query.tags = { $in: Array.isArray(tags) ? tags : [tags] };
    }

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Pagination
    const skip = (page - 1) * limit;
    const limitNum = parseInt(limit, 10);

    // Execute queries
    const [users, total] = await Promise.all([
      User.find(query)
        .select(User.getCardProjection())
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      User.countDocuments(query)
    ]);

    // Transform to card-friendly format
    const data = users.map(user => this.toCardFormat(user));

    return {
      data,
      meta: {
        total,
        page: parseInt(page, 10),
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
        hasNext: page * limitNum < total,
        hasPrev: page > 1
      }
    };
  }

  /**
   * Get single user by ID
   */
  async getUserById(id) {
    const user = await User.findOne({ _id: id, deletedAt: null })
      .populate('createdBy', 'fullName email')
      .populate('updatedBy', 'fullName email')
      .lean();

    if (!user) {
      return null;
    }

    return this.toDetailFormat(user);
  }

  /**
   * Create new user
   */
  async createUser(payload, createdBy) {
    // Check for existing user
    const existing = await User.findOne({
      $or: [
        { email: payload.email?.toLowerCase() },
        { username: payload.username }
      ]
    });

    if (existing) {
      throw new Error(
        existing.email === payload.email?.toLowerCase()
          ? 'Email already registered'
          : 'Username already taken'
      );
    }

    const userData = {
      ...payload,
      email: payload.email?.toLowerCase(),
      createdBy,
      isActive: payload.isActive ?? true,
      isVerified: payload.isVerified ?? false
    };

    // If password provided, it will be hashed by pre-save hook
    if (payload.password) {
      userData.passwordHash = payload.password;
    }

    const user = new User(userData);
    await user.save();

    // Log activity
    await this.logActivity('USER_CREATED', createdBy, user._id, {
      username: user.username,
      email: user.email
    });

    return this.toDetailFormat(user.toObject());
  }

  /**
   * Update user
   */
  async updateUser(id, payload, updatedBy) {
    const user = await User.findOne({ _id: id, deletedAt: null });

    if (!user) {
      return null;
    }

    // Check for email/username conflicts
    if (payload.email || payload.username) {
      const conflict = await User.findOne({
        _id: { $ne: id },
        $or: [
          payload.email ? { email: payload.email.toLowerCase() } : null,
          payload.username ? { username: payload.username } : null
        ].filter(Boolean)
      });

      if (conflict) {
        throw new Error(
          conflict.email === payload.email?.toLowerCase()
            ? 'Email already in use'
            : 'Username already taken'
        );
      }
    }

    // Update fields
    const updateData = { ...payload, updatedBy };
    if (payload.email) {
      updateData.email = payload.email.toLowerCase();
    }

    // Don't update sensitive fields directly
    delete updateData.passwordHash;
    delete updateData.deletedAt;

    Object.assign(user, updateData);
    await user.save();

    // Log activity
    await this.logActivity('USER_UPDATED', updatedBy, user._id, {
      updatedFields: Object.keys(payload)
    });

    return this.toDetailFormat(user.toObject());
  }

  /**
   * Delete user (soft or hard)
   */
  async deleteUser(id, { hard = false, deletedBy } = {}) {
    const user = await User.findOne({ _id: id, deletedAt: null });

    if (!user) {
      return null;
    }

    if (hard) {
      // Hard delete - permanent
      await User.deleteOne({ _id: id });
      await this.logActivity('USER_HARD_DELETED', deletedBy, id, {
        username: user.username
      });
    } else {
      // Soft delete
      user.deletedAt = new Date();
      user.deletedBy = deletedBy;
      user.isActive = false;
      await user.save();
      await this.logActivity('USER_SOFT_DELETED', deletedBy, id, {
        username: user.username
      });
    }

    return { success: true, id, hard };
  }

  /**
   * Change user status
   */
  async changeStatus(id, { action, reason, performedBy }) {
    const user = await User.findOne({ _id: id, deletedAt: null });

    if (!user) {
      return null;
    }

    const statusActions = {
      activate: () => {
        user.isActive = true;
        user.isSuspended = false;
      },
      deactivate: () => {
        user.isActive = false;
      },
      suspend: () => {
        user.isSuspended = true;
        user.suspendedReason = reason;
        user.suspendedAt = new Date();
        user.suspendedBy = performedBy;
      },
      unsuspend: () => {
        user.isSuspended = false;
        user.suspendedReason = null;
        user.suspendedAt = null;
        user.suspendedBy = null;
      },
      verify: () => {
        user.isVerified = true;
      },
      unverify: () => {
        user.isVerified = false;
      }
    };

    const actionFn = statusActions[action];
    if (!actionFn) {
      throw new Error(`Invalid action: ${action}`);
    }

    actionFn();
    user.updatedBy = performedBy;
    await user.save();

    await this.logActivity(`USER_${action.toUpperCase()}`, performedBy, id, { reason });

    return this.toDetailFormat(user.toObject());
  }

  /**
   * Bulk actions on users
   */
  async bulkAction({ action, ids, performedBy }) {
    if (!ids || ids.length === 0) {
      throw new Error('No user IDs provided');
    }

    const results = { success: [], failed: [] };

    for (const id of ids) {
      try {
        switch (action) {
          case 'activate':
          case 'deactivate':
          case 'suspend':
          case 'unsuspend':
            await this.changeStatus(id, { action, performedBy });
            break;
          case 'delete':
            await this.deleteUser(id, { deletedBy: performedBy });
            break;
          case 'verify':
            await this.changeStatus(id, { action: 'verify', performedBy });
            break;
          default:
            throw new Error(`Unknown action: ${action}`);
        }
        results.success.push(id);
      } catch (error) {
        results.failed.push({ id, error: error.message });
      }
    }

    await this.logActivity(`BULK_${action.toUpperCase()}`, performedBy, null, {
      totalIds: ids.length,
      successCount: results.success.length,
      failedCount: results.failed.length
    });

    return results;
  }

  /**
   * Export users to CSV
   */
  async exportUsers(filters = {}) {
    // Get all matching users (no pagination)
    const query = this.buildExportQuery(filters);
    
    const users = await User.find(query)
      .select('-passwordHash -__v')
      .sort({ createdAt: -1 })
      .lean();

    const fields = [
      { label: 'ID', value: '_id' },
      { label: 'Username', value: 'username' },
      { label: 'Email', value: 'email' },
      { label: 'Full Name', value: 'fullName' },
      { label: 'Phone', value: 'phone' },
      { label: 'Gender', value: 'gender' },
      { label: 'City', value: 'location.city' },
      { label: 'State', value: 'location.state' },
      { label: 'Country', value: 'location.country' },
      { label: 'Membership', value: 'membership' },
      { label: 'Roles', value: (row) => row.roles?.join(', ') },
      { label: 'Status', value: (row) => row.isSuspended ? 'Suspended' : (row.isActive ? 'Active' : 'Inactive') },
      { label: 'Verified', value: (row) => row.isVerified ? 'Yes' : 'No' },
      { label: 'Created At', value: (row) => new Date(row.createdAt).toISOString() },
      { label: 'Last Login', value: (row) => row.lastLogin ? new Date(row.lastLogin).toISOString() : '' }
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(users);

    return {
      csv,
      count: users.length,
      filename: `users_export_${new Date().toISOString().split('T')[0]}.csv`
    };
  }

  /**
   * Get user activity logs
   */
  async getUserActivity(userId, { page = 1, limit = 20 } = {}) {
    const skip = (page - 1) * limit;

    const [activities, total] = await Promise.all([
      ActivityLog.find({ targetUser: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('performedBy', 'fullName')
        .lean(),
      ActivityLog.countDocuments({ targetUser: userId })
    ]);

    return {
      data: activities,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Helper: Transform user to card format
   */
  toCardFormat(user, adminRole = true) {
    return {
      id: user._id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      profilePhoto: user.profilePhoto,
      phone: user.phone,
      age: this.calculateAge(user.dob),
      gender: user.gender,
      location: user.location,
      roles: user.roles,
      membership: user.membership,
      isActive: user.isActive,
      isVerified: user.isVerified,
      isSuspended: user.isSuspended,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      shortBio: user.shortBio,
      tags: user.tags,
      quickActions: adminRole ? {
        canEdit: true,
        canDelete: true,
        canSuspend: !user.isSuspended,
        canActivate: !user.isActive
      } : {}
    };
  }

  /**
   * Helper: Transform user to detail format
   */
  toDetailFormat(user) {
    const card = this.toCardFormat(user);
    return {
      ...card,
      dob: user.dob,
      permissions: user.permissions,
      meta: user.meta,
      loginCount: user.loginCount,
      suspendedReason: user.suspendedReason,
      suspendedAt: user.suspendedAt,
      createdBy: user.createdBy,
      updatedBy: user.updatedBy,
      updatedAt: user.updatedAt
    };
  }

  /**
   * Helper: Calculate age from DOB
   */
  calculateAge(dob) {
    if (!dob) return null;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  /**
   * Helper: Escape regex special characters
   */
  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Helper: Build export query
   */
  buildExportQuery(filters) {
    const query = { deletedAt: null };
    if (filters.status === 'active') query.isActive = true;
    if (filters.status === 'suspended') query.isSuspended = true;
    if (filters.role) query.roles = filters.role;
    if (filters.membership) query.membership = filters.membership;
    if (filters.region) query['location.city'] = new RegExp(this.escapeRegex(filters.region), 'i');
    return query;
  }

  /**
   * Helper: Log activity
   */
  async logActivity(action, performedBy, targetUser, metadata = {}) {
    try {
      await ActivityLog.create({
        action,
        performedBy,
        targetUser,
        metadata,
        description: `${action} performed on user`
      });
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  }
}

module.exports = new UserService();
