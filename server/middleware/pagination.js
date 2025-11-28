/**
 * Pagination Middleware
 * Standardizes pagination parameters across endpoints
 */
const pagination = (options = {}) => {
  const {
    defaultLimit = 20,
    maxLimit = 100,
    defaultPage = 1,
    defaultSortBy = 'createdAt',
    defaultSortOrder = 'desc'
  } = options;

  return (req, res, next) => {
    // Parse and validate page
    let page = parseInt(req.query.page, 10);
    if (isNaN(page) || page < 1) {
      page = defaultPage;
    }

    // Parse and validate limit
    let limit = parseInt(req.query.limit, 10);
    if (isNaN(limit) || limit < 1) {
      limit = defaultLimit;
    }
    if (limit > maxLimit) {
      limit = maxLimit;
    }

    // Parse and validate sortBy
    let sortBy = req.query.sortBy || defaultSortBy;
    // Sanitize sortBy to prevent NoSQL injection
    sortBy = sortBy.replace(/[^a-zA-Z0-9_.]/g, '');

    // Parse and validate sortOrder
    let sortOrder = req.query.sortOrder?.toLowerCase();
    if (sortOrder !== 'asc' && sortOrder !== 'desc') {
      sortOrder = defaultSortOrder;
    }

    // Calculate skip
    const skip = (page - 1) * limit;

    // Attach pagination info to request
    req.pagination = {
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
      sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 }
    };

    next();
  };
};

/**
 * Helper to build pagination response meta
 */
const buildPaginationMeta = (total, page, limit) => {
  const pages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    pages,
    hasNext: page < pages,
    hasPrev: page > 1
  };
};

/**
 * Helper to apply pagination to Mongoose query
 */
const applyPagination = (query, pagination) => {
  return query
    .sort(pagination.sort)
    .skip(pagination.skip)
    .limit(pagination.limit);
};

module.exports = {
  pagination,
  buildPaginationMeta,
  applyPagination
};
