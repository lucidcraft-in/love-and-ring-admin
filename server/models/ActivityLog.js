/**
 * Activity Log Model
 * Records all consultant and admin actions for audit purposes
 */
const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  actor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'actorModel'
  },
  actorModel: {
    type: String,
    required: true,
    enum: ['User', 'Consultant']
  },
  action: {
    type: String,
    required: true,
    enum: [
      // Consultant lifecycle
      'CONSULTANT_CREATED',
      'CONSULTANT_SELF_REGISTERED',
      'CONSULTANT_APPROVED',
      'CONSULTANT_REJECTED',
      'CONSULTANT_SUSPENDED',
      'CONSULTANT_REACTIVATED',
      'CONSULTANT_PASSWORD_SET',
      'CONSULTANT_PASSWORD_RESET',
      'CONSULTANT_PERMISSIONS_UPDATED',
      'CONSULTANT_PROFILE_UPDATED',
      'CONSULTANT_LOGIN',
      'CONSULTANT_LOGIN_FAILED',
      'CONSULTANT_LOGOUT',
      // Profile actions
      'PROFILE_CREATED',
      'PROFILE_UPDATED',
      'PROFILE_VIEWED',
      'PROFILE_DELETED'
    ]
  },
  targetType: {
    type: String,
    enum: ['Consultant', 'Profile', 'User']
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILURE'],
    default: 'SUCCESS'
  },
  errorMessage: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
activityLogSchema.index({ actor: 1, createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });
activityLogSchema.index({ targetType: 1, targetId: 1, createdAt: -1 });
activityLogSchema.index({ createdAt: -1 });

// Static method to log activity
activityLogSchema.statics.log = async function({
  actor,
  actorModel,
  action,
  targetType,
  targetId,
  details,
  ipAddress,
  userAgent,
  status = 'SUCCESS',
  errorMessage
}) {
  try {
    return await this.create({
      actor,
      actorModel,
      action,
      targetType,
      targetId,
      details,
      ipAddress,
      userAgent,
      status,
      errorMessage
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
    // Don't throw - logging failure shouldn't break the main operation
  }
};

// Static method to get consultant activity
activityLogSchema.statics.getConsultantActivity = async function(consultantId, options = {}) {
  const { page = 1, limit = 20, action, startDate, endDate } = options;
  
  const query = {
    $or: [
      { actor: consultantId, actorModel: 'Consultant' },
      { targetType: 'Consultant', targetId: consultantId }
    ]
  };
  
  if (action) {
    query.action = action;
  }
  
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }
  
  const [logs, total] = await Promise.all([
    this.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('actor', 'username email fullName')
      .lean(),
    this.countDocuments(query)
  ]);
  
  return {
    logs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

module.exports = mongoose.model('ActivityLog', activityLogSchema);
