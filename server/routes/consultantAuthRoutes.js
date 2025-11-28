/**
 * Consultant Authentication Routes
 * Routes for consultant registration, login, and password management
 */
const express = require('express');
const router = express.Router();
const consultantController = require('../controllers/consultantController');
const { authLimiter, registrationLimiter, passwordResetLimiter } = require('../middleware/rateLimiter');
const {
  selfRegisterValidation,
  loginValidation,
  setPasswordValidation
} = require('../middleware/validation');

/**
 * @route   POST /api/consultants/register
 * @desc    Self-register as consultant (status will be PENDING)
 * @access  Public
 */
router.post(
  '/register',
  registrationLimiter,
  selfRegisterValidation,
  consultantController.selfRegister
);

/**
 * @route   POST /api/auth/consultant/login
 * @desc    Consultant login (only ACTIVE consultants can login)
 * @access  Public
 */
router.post(
  '/login',
  authLimiter,
  loginValidation,
  consultantController.login
);

/**
 * @route   POST /api/auth/consultant/set-password
 * @desc    Set password after approval (using token from email)
 * @access  Public (with valid token)
 */
router.post(
  '/set-password',
  passwordResetLimiter,
  setPasswordValidation,
  consultantController.setPassword
);

module.exports = router;
