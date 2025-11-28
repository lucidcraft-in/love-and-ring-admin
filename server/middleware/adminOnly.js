/**
 * Admin Only Middleware
 * Restricts access to admin users only
 */
const adminOnly = (req, res, next) => {
  // Check if user exists (should be set by auth middleware)
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }

  // Check for admin role
  const isAdmin = req.user.roles?.includes('admin') || req.user.role === 'admin';

  if (!isAdmin) {
    return res.status(403).json({
      success: false,
      error: 'Access denied. Admin privileges required.'
    });
  }

  next();
};

/**
 * Role-based access middleware
 * @param {string[]} allowedRoles - Array of allowed roles
 */
const requireRoles = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const userRoles = req.user.roles || [req.user.role];
    const hasRole = allowedRoles.some(role => userRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Required roles: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
};

/**
 * Permission-based access middleware
 * @param {string} permission - Required permission key
 */
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    // Admins bypass permission checks
    if (req.user.roles?.includes('admin')) {
      return next();
    }

    const hasPermission = req.user.permissions?.[permission] === true;

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Required permission: ${permission}`
      });
    }

    next();
  };
};

module.exports = {
  adminOnly,
  requireRoles,
  requirePermission
};
