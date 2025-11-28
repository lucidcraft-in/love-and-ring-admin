/**
 * Profile Controller
 * Handles HTTP requests for member profile management by consultants
 */
const MemberProfile = require('../models/MemberProfile');
const ActivityLog = require('../models/ActivityLog');

/**
 * Helper to get request info for logging
 */
const getReqInfo = (req) => ({
  ip: req.ip || req.headers['x-forwarded-for'],
  userAgent: req.headers['user-agent']
});

/**
 * Create member profile
 * POST /api/consultant/profiles
 */
exports.createProfile = async (req, res) => {
  try {
    // Generate profile ID
    const profileId = await MemberProfile.generateProfileId();
    
    const profile = new MemberProfile({
      ...req.body,
      profileId,
      createdByConsultant: req.consultant._id,
      lastModifiedByConsultant: req.consultant._id
    });
    
    await profile.save();
    
    // Log activity
    await ActivityLog.log({
      actor: req.consultant._id,
      actorModel: 'Consultant',
      action: 'PROFILE_CREATED',
      targetType: 'Profile',
      targetId: profile._id,
      details: { profileId: profile.profileId, fullName: profile.fullName },
      ipAddress: getReqInfo(req).ip,
      userAgent: getReqInfo(req).userAgent
    });
    
    res.status(201).json({
      success: true,
      data: { profile },
      message: 'Profile created successfully.'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: {
        code: 'CREATE_FAILED',
        message: error.message
      }
    });
  }
};

/**
 * Get profiles (created by consultant or all based on permissions)
 * GET /api/consultant/profiles
 */
exports.getProfiles = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, gender, search, myProfiles } = req.query;
    
    const query = { isDeleted: false };
    
    // If myProfiles flag is set, only show consultant's own profiles
    if (myProfiles === 'true') {
      query.createdByConsultant = req.consultant._id;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (gender) {
      query.gender = gender;
    }
    
    if (search) {
      query.$or = [
        { profileId: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    const [profiles, total] = await Promise.all([
      MemberProfile.find(query)
        .populate('createdByConsultant', 'username fullName')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .lean(),
      MemberProfile.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: {
        profiles,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: error.message
      }
    });
  }
};

/**
 * Get profile by ID
 * GET /api/consultant/profiles/:id
 */
exports.getProfileById = async (req, res) => {
  try {
    const profile = await MemberProfile.findOne({
      _id: req.params.id,
      isDeleted: false
    })
      .populate('createdByConsultant', 'username fullName')
      .populate('lastModifiedByConsultant', 'username fullName')
      .lean();
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Profile not found.'
        }
      });
    }
    
    // Log view activity
    await ActivityLog.log({
      actor: req.consultant._id,
      actorModel: 'Consultant',
      action: 'PROFILE_VIEWED',
      targetType: 'Profile',
      targetId: profile._id,
      details: { profileId: profile.profileId },
      ipAddress: getReqInfo(req).ip,
      userAgent: getReqInfo(req).userAgent
    });
    
    res.json({
      success: true,
      data: { profile }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: error.message
      }
    });
  }
};

/**
 * Update profile
 * PATCH /api/consultant/profiles/:id
 */
exports.updateProfile = async (req, res) => {
  try {
    const profile = await MemberProfile.findOne({
      _id: req.params.id,
      isDeleted: false
    });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Profile not found.'
        }
      });
    }
    
    // Update fields
    const allowedUpdates = [
      'fullName', 'gender', 'dateOfBirth', 'maritalStatus',
      'email', 'phone', 'alternatePhone', 'country', 'state', 'city', 'address',
      'height', 'weight', 'bodyType', 'complexion',
      'religion', 'caste', 'subCaste', 'gothra', 'manglik',
      'education', 'educationDetails', 'occupation', 'company', 'annualIncome', 'workLocation',
      'fatherName', 'fatherOccupation', 'motherName', 'motherOccupation', 'siblings', 'familyType', 'familyStatus',
      'partnerPreferences', 'photos', 'documents', 'status', 'internalNotes'
    ];
    
    const updates = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }
    
    updates.lastModifiedByConsultant = req.consultant._id;
    
    const updatedProfile = await MemberProfile.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('createdByConsultant', 'username fullName');
    
    // Log activity
    await ActivityLog.log({
      actor: req.consultant._id,
      actorModel: 'Consultant',
      action: 'PROFILE_UPDATED',
      targetType: 'Profile',
      targetId: profile._id,
      details: { profileId: profile.profileId, updatedFields: Object.keys(updates) },
      ipAddress: getReqInfo(req).ip,
      userAgent: getReqInfo(req).userAgent
    });
    
    res.json({
      success: true,
      data: { profile: updatedProfile },
      message: 'Profile updated successfully.'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: {
        code: 'UPDATE_FAILED',
        message: error.message
      }
    });
  }
};

/**
 * Delete profile (soft delete)
 * DELETE /api/consultant/profiles/:id
 */
exports.deleteProfile = async (req, res) => {
  try {
    const profile = await MemberProfile.findOne({
      _id: req.params.id,
      isDeleted: false
    });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Profile not found.'
        }
      });
    }
    
    // Soft delete
    await profile.softDelete(req.consultant._id, 'Consultant');
    
    // Log activity
    await ActivityLog.log({
      actor: req.consultant._id,
      actorModel: 'Consultant',
      action: 'PROFILE_DELETED',
      targetType: 'Profile',
      targetId: profile._id,
      details: { profileId: profile.profileId, fullName: profile.fullName },
      ipAddress: getReqInfo(req).ip,
      userAgent: getReqInfo(req).userAgent
    });
    
    res.json({
      success: true,
      message: 'Profile deleted successfully.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'DELETE_FAILED',
        message: error.message
      }
    });
  }
};
