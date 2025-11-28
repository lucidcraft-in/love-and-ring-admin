/**
 * Consultant Service
 * Business logic for consultant management
 */
const crypto = require('crypto');
const Consultant = require('../models/Consultant');
const ActivityLog = require('../models/ActivityLog');
const emailService = require('./emailService');

/**
 * Create a new consultant (by admin)
 */
const createConsultant = async (consultantData, createdBy, reqInfo = {}) => {
  // Check for existing username or email
  const existing = await Consultant.findOne({
    $or: [
      { username: consultantData.username.toLowerCase() },
      { email: consultantData.email.toLowerCase() }
    ]
  });
  
  if (existing) {
    const field = existing.username === consultantData.username.toLowerCase() ? 'username' : 'email';
    throw new Error(`A consultant with this ${field} already exists`);
  }
  
  const consultant = new Consultant({
    ...consultantData,
    username: consultantData.username.toLowerCase(),
    email: consultantData.email.toLowerCase(),
    status: 'PENDING',
    createdBy,
    permissions: consultantData.permissions || {
      create_profile: false,
      edit_profile: false,
      view_profile: true,
      delete_profile: false
    }
  });
  
  await consultant.save();
  
  // Log activity
  await ActivityLog.log({
    actor: createdBy,
    actorModel: 'User',
    action: 'CONSULTANT_CREATED',
    targetType: 'Consultant',
    targetId: consultant._id,
    details: { username: consultant.username, email: consultant.email },
    ipAddress: reqInfo.ip,
    userAgent: reqInfo.userAgent
  });
  
  // Send notification email
  await emailService.sendConsultantCreatedEmail(consultant, true);
  
  return consultant;
};

/**
 * Self-register consultant
 */
const selfRegisterConsultant = async (consultantData, reqInfo = {}) => {
  // Check for existing username or email
  const existing = await Consultant.findOne({
    $or: [
      { username: consultantData.username.toLowerCase() },
      { email: consultantData.email.toLowerCase() }
    ]
  });
  
  if (existing) {
    const field = existing.username === consultantData.username.toLowerCase() ? 'username' : 'email';
    throw new Error(`A consultant with this ${field} already exists`);
  }
  
  const consultant = new Consultant({
    ...consultantData,
    username: consultantData.username.toLowerCase(),
    email: consultantData.email.toLowerCase(),
    status: 'PENDING',
    permissions: {
      create_profile: false,
      edit_profile: false,
      view_profile: true,
      delete_profile: false
    }
  });
  
  await consultant.save();
  
  // Log activity
  await ActivityLog.log({
    actor: consultant._id,
    actorModel: 'Consultant',
    action: 'CONSULTANT_SELF_REGISTERED',
    targetType: 'Consultant',
    targetId: consultant._id,
    details: { username: consultant.username, email: consultant.email },
    ipAddress: reqInfo.ip,
    userAgent: reqInfo.userAgent
  });
  
  // Send notification email
  await emailService.sendConsultantCreatedEmail(consultant, false);
  
  return consultant;
};

/**
 * Get consultants with filters
 */
const getConsultants = async (filters = {}) => {
  const { page = 1, limit = 20, status, region, search, sortBy = 'createdAt', sortOrder = 'desc' } = filters;
  
  const query = {};
  
  if (status) {
    query.status = status;
  }
  
  if (region) {
    query.regions = { $in: [region] };
  }
  
  if (search) {
    query.$or = [
      { username: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { fullName: { $regex: search, $options: 'i' } },
      { agencyName: { $regex: search, $options: 'i' } }
    ];
  }
  
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
  
  const [consultants, total] = await Promise.all([
    Consultant.find(query)
      .select('-passwordHash -passwordResetToken -passwordResetExpires')
      .populate('createdBy', 'name email')
      .populate('approvedBy', 'name email')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Consultant.countDocuments(query)
  ]);
  
  return {
    consultants,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Get consultant by ID
 */
const getConsultantById = async (id) => {
  const consultant = await Consultant.findById(id)
    .select('-passwordHash -passwordResetToken -passwordResetExpires')
    .populate('createdBy', 'name email')
    .populate('approvedBy', 'name email')
    .lean();
  
  if (!consultant) {
    throw new Error('Consultant not found');
  }
  
  return consultant;
};

/**
 * Approve consultant
 */
const approveConsultant = async (consultantId, approvedBy, notify = true, reqInfo = {}) => {
  const consultant = await Consultant.findById(consultantId);
  
  if (!consultant) {
    throw new Error('Consultant not found');
  }
  
  if (consultant.status === 'ACTIVE') {
    throw new Error('Consultant is already approved');
  }
  
  // Generate password reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  
  consultant.status = 'ACTIVE';
  consultant.approvedBy = approvedBy;
  consultant.approvedAt = new Date();
  consultant.passwordResetToken = hashedToken;
  consultant.passwordResetExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  consultant.rejectedReason = undefined;
  
  await consultant.save();
  
  // Log activity
  await ActivityLog.log({
    actor: approvedBy,
    actorModel: 'User',
    action: 'CONSULTANT_APPROVED',
    targetType: 'Consultant',
    targetId: consultant._id,
    details: { username: consultant.username },
    ipAddress: reqInfo.ip,
    userAgent: reqInfo.userAgent
  });
  
  // Send approval email with password setup link
  if (notify) {
    await emailService.sendConsultantApprovedEmail(consultant, resetToken);
  }
  
  return consultant;
};

/**
 * Reject consultant
 */
const rejectConsultant = async (consultantId, rejectedBy, reason, notify = true, reqInfo = {}) => {
  const consultant = await Consultant.findById(consultantId);
  
  if (!consultant) {
    throw new Error('Consultant not found');
  }
  
  if (consultant.status === 'REJECTED') {
    throw new Error('Consultant is already rejected');
  }
  
  consultant.status = 'REJECTED';
  consultant.rejectedReason = reason;
  consultant.rejectedAt = new Date();
  
  await consultant.save();
  
  // Log activity
  await ActivityLog.log({
    actor: rejectedBy,
    actorModel: 'User',
    action: 'CONSULTANT_REJECTED',
    targetType: 'Consultant',
    targetId: consultant._id,
    details: { username: consultant.username, reason },
    ipAddress: reqInfo.ip,
    userAgent: reqInfo.userAgent
  });
  
  // Send rejection email
  if (notify) {
    await emailService.sendConsultantRejectedEmail(consultant, reason);
  }
  
  return consultant;
};

/**
 * Update consultant permissions
 */
const updatePermissions = async (consultantId, permissions, updatedBy, reqInfo = {}) => {
  const consultant = await Consultant.findById(consultantId);
  
  if (!consultant) {
    throw new Error('Consultant not found');
  }
  
  const oldPermissions = { ...consultant.permissions.toObject() };
  consultant.permissions = { ...consultant.permissions.toObject(), ...permissions };
  await consultant.save();
  
  // Log activity
  await ActivityLog.log({
    actor: updatedBy,
    actorModel: 'User',
    action: 'CONSULTANT_PERMISSIONS_UPDATED',
    targetType: 'Consultant',
    targetId: consultant._id,
    details: { 
      oldPermissions, 
      newPermissions: consultant.permissions.toObject(),
      username: consultant.username 
    },
    ipAddress: reqInfo.ip,
    userAgent: reqInfo.userAgent
  });
  
  return consultant;
};

/**
 * Set consultant password (after approval)
 */
const setPassword = async (token, password, reqInfo = {}) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
  const consultant = await Consultant.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
    status: 'ACTIVE'
  });
  
  if (!consultant) {
    throw new Error('Invalid or expired token. Please contact support for a new password setup link.');
  }
  
  consultant.passwordHash = password; // Will be hashed by pre-save hook
  consultant.passwordResetToken = undefined;
  consultant.passwordResetExpires = undefined;
  
  await consultant.save();
  
  // Log activity
  await ActivityLog.log({
    actor: consultant._id,
    actorModel: 'Consultant',
    action: 'CONSULTANT_PASSWORD_SET',
    targetType: 'Consultant',
    targetId: consultant._id,
    ipAddress: reqInfo.ip,
    userAgent: reqInfo.userAgent
  });
  
  // Send confirmation email
  await emailService.sendPasswordSetConfirmationEmail(consultant);
  
  return consultant;
};

/**
 * Suspend consultant
 */
const suspendConsultant = async (consultantId, suspendedBy, reason, reqInfo = {}) => {
  const consultant = await Consultant.findById(consultantId);
  
  if (!consultant) {
    throw new Error('Consultant not found');
  }
  
  consultant.status = 'SUSPENDED';
  await consultant.save();
  
  // Log activity
  await ActivityLog.log({
    actor: suspendedBy,
    actorModel: 'User',
    action: 'CONSULTANT_SUSPENDED',
    targetType: 'Consultant',
    targetId: consultant._id,
    details: { username: consultant.username, reason },
    ipAddress: reqInfo.ip,
    userAgent: reqInfo.userAgent
  });
  
  return consultant;
};

module.exports = {
  createConsultant,
  selfRegisterConsultant,
  getConsultants,
  getConsultantById,
  approveConsultant,
  rejectConsultant,
  updatePermissions,
  setPassword,
  suspendConsultant
};
