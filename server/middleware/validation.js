/**
 * Input Validation Middleware
 * Using express-validator for request validation
 */
const { body, param, query, validationResult } = require('express-validator');

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      }
    });
  }
  
  next();
};

/**
 * Password validation rules
 * Min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
 */
const passwordValidation = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/[a-z]/)
  .withMessage('Password must contain at least one lowercase letter')
  .matches(/[0-9]/)
  .withMessage('Password must contain at least one digit')
  .matches(/[!@#$%^&*(),.?":{}|<>]/)
  .withMessage('Password must contain at least one special character');

/**
 * Consultant creation validation
 */
const createConsultantValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage('Please provide a valid phone number'),
  
  body('agencyName')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Agency name cannot exceed 200 characters'),
  
  body('licenseNumber')
    .optional()
    .trim(),
  
  body('regions')
    .optional()
    .isArray()
    .withMessage('Regions must be an array'),
  
  body('regions.*')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Region name cannot be empty'),
  
  body('permissions')
    .optional()
    .isObject()
    .withMessage('Permissions must be an object'),
  
  body('permissions.create_profile')
    .optional()
    .isBoolean()
    .withMessage('create_profile must be a boolean'),
  
  body('permissions.edit_profile')
    .optional()
    .isBoolean()
    .withMessage('edit_profile must be a boolean'),
  
  body('permissions.view_profile')
    .optional()
    .isBoolean()
    .withMessage('view_profile must be a boolean'),
  
  body('permissions.delete_profile')
    .optional()
    .isBoolean()
    .withMessage('delete_profile must be a boolean'),
  
  handleValidationErrors
];

/**
 * Consultant self-registration validation
 */
const selfRegisterValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  
  body('phone')
    .trim()
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage('Please provide a valid phone number'),
  
  body('agencyName')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Agency name cannot exceed 200 characters'),
  
  body('regions')
    .optional()
    .isArray()
    .withMessage('Regions must be an array'),
  
  handleValidationErrors
];

/**
 * Login validation
 */
const loginValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username or email is required'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

/**
 * Set password validation
 */
const setPasswordValidation = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  
  passwordValidation,
  
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),
  
  handleValidationErrors
];

/**
 * Approve consultant validation
 */
const approveConsultantValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid consultant ID'),
  
  body('notify')
    .optional()
    .isBoolean()
    .withMessage('notify must be a boolean'),
  
  handleValidationErrors
];

/**
 * Reject consultant validation
 */
const rejectConsultantValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid consultant ID'),
  
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Rejection reason cannot exceed 500 characters'),
  
  body('notify')
    .optional()
    .isBoolean()
    .withMessage('notify must be a boolean'),
  
  handleValidationErrors
];

/**
 * Update permissions validation
 */
const updatePermissionsValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid consultant ID'),
  
  body('permissions')
    .isObject()
    .withMessage('Permissions must be an object'),
  
  body('permissions.create_profile')
    .optional()
    .isBoolean()
    .withMessage('create_profile must be a boolean'),
  
  body('permissions.edit_profile')
    .optional()
    .isBoolean()
    .withMessage('edit_profile must be a boolean'),
  
  body('permissions.view_profile')
    .optional()
    .isBoolean()
    .withMessage('view_profile must be a boolean'),
  
  body('permissions.delete_profile')
    .optional()
    .isBoolean()
    .withMessage('delete_profile must be a boolean'),
  
  handleValidationErrors
];

/**
 * List consultants query validation
 */
const listConsultantsValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('status')
    .optional()
    .isIn(['PENDING', 'ACTIVE', 'REJECTED', 'SUSPENDED'])
    .withMessage('Invalid status'),
  
  query('region')
    .optional()
    .trim(),
  
  query('search')
    .optional()
    .trim(),
  
  handleValidationErrors
];

/**
 * Member profile validation
 */
const createProfileValidation = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  
  body('gender')
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Gender must be Male, Female, or Other'),
  
  body('dateOfBirth')
    .isISO8601()
    .withMessage('Please provide a valid date of birth'),
  
  body('phone')
    .trim()
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage('Please provide a valid phone number'),
  
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email'),
  
  body('maritalStatus')
    .optional()
    .isIn(['Never Married', 'Divorced', 'Widowed', 'Separated'])
    .withMessage('Invalid marital status'),
  
  handleValidationErrors
];

/**
 * User create validation
 */
const validateCreateUser = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, underscores'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('fullName')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Full name cannot exceed 100 characters'),
  body('phone')
    .optional()
    .trim(),
  body('gender')
    .optional()
    .isIn(['Male', 'Female', 'Other', 'Prefer not to say']).withMessage('Invalid gender'),
  body('dob')
    .optional()
    .isISO8601().withMessage('Invalid date format'),
  body('roles')
    .optional()
    .isArray().withMessage('Roles must be an array'),
  body('membership')
    .optional()
    .isIn(['Free', 'Premium', 'VIP']).withMessage('Invalid membership type'),
  handleValidationErrors
];

/**
 * User update validation
 */
const validateUpdateUser = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters')
    .matches(/^[a-zA-Z0-9_]+$/),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('fullName')
    .optional()
    .trim()
    .isLength({ max: 100 }),
  body('gender')
    .optional()
    .isIn(['Male', 'Female', 'Other', 'Prefer not to say']),
  body('dob')
    .optional()
    .isISO8601(),
  body('roles')
    .optional()
    .isArray(),
  body('membership')
    .optional()
    .isIn(['Free', 'Premium', 'VIP']),
  handleValidationErrors
];

/**
 * Status change validation
 */
const validateStatusChange = [
  body('action')
    .notEmpty().withMessage('Action is required')
    .isIn(['activate', 'deactivate', 'suspend', 'unsuspend', 'verify', 'unverify'])
    .withMessage('Invalid action'),
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Reason cannot exceed 500 characters'),
  handleValidationErrors
];

/**
 * Bulk action validation
 */
const validateBulkAction = [
  body('action')
    .notEmpty().withMessage('Action is required')
    .isIn(['activate', 'deactivate', 'suspend', 'unsuspend', 'delete', 'verify'])
    .withMessage('Invalid action'),
  body('ids')
    .isArray({ min: 1 }).withMessage('At least one ID is required'),
  handleValidationErrors
];

/**
 * Validate MongoDB ObjectId parameter
 */
const validateObjectId = (paramName) => {
  const mongoose = require('mongoose');
  return [
    param(paramName).custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid ID format');
      }
      return true;
    }),
    handleValidationErrors
  ];
};

module.exports = {
  handleValidationErrors,
  createConsultantValidation,
  selfRegisterValidation,
  loginValidation,
  setPasswordValidation,
  approveConsultantValidation,
  rejectConsultantValidation,
  updatePermissionsValidation,
  listConsultantsValidation,
  createProfileValidation,
  passwordValidation,
  // User module validations
  validateCreateUser,
  validateUpdateUser,
  validateStatusChange,
  validateBulkAction,
  validateObjectId
};
