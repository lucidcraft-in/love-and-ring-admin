/**
 * Rate Limiting Middleware
 * Prevents brute force attacks and API abuse
 */
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis'); // Optional: for distributed systems

/**
 * Default rate limiter for general API endpoints
 */
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // 100 requests per window
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests. Please try again later.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.ip || req.headers['x-forwarded-for'] || 'unknown';
  }
});

/**
 * Strict rate limiter for authentication endpoints
 * More restrictive to prevent brute force attacks
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 login attempts per 15 minutes
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_LOGIN_ATTEMPTS',
      message: 'Too many login attempts. Please try again after 15 minutes.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful logins
  keyGenerator: (req) => {
    // Use both IP and username for more granular limiting
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const username = req.body?.username || 'unknown';
    return `${ip}-${username}`;
  }
});

/**
 * Password reset rate limiter
 */
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 password reset requests per hour
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_RESET_REQUESTS',
      message: 'Too many password reset requests. Please try again after an hour.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Registration rate limiter
 */
const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 registration attempts per hour
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REGISTRATIONS',
      message: 'Too many registration attempts. Please try again later.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Create a custom rate limiter with Redis store (for production)
 * Uncomment and configure if using Redis
 */
// const createRedisLimiter = (options) => {
//   return rateLimit({
//     ...options,
//     store: new RedisStore({
//       sendCommand: (...args) => redisClient.sendCommand(args),
//     }),
//   });
// };

module.exports = {
  generalLimiter,
  authLimiter,
  passwordResetLimiter,
  registrationLimiter
};
