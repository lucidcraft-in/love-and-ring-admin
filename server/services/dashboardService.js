const User = require('../models/User');
const Consultant = require('../models/Consultant');
const MemberProfile = require('../models/MemberProfile');
const ActivityLog = require('../models/ActivityLog');

/**
 * Dashboard Service
 * Handles all dashboard-related aggregations and metrics
 */
class DashboardService {
  /**
   * Get dashboard summary metrics
   */
  async getSummary({ from, to, region } = {}) {
    const dateFilter = this.buildDateFilter(from, to);
    const regionFilter = region ? { 'location.city': new RegExp(region, 'i') } : {};

    const baseMatch = {
      deletedAt: null,
      ...dateFilter,
      ...regionFilter
    };

    // Use $facet for efficient multi-aggregation
    const [result] = await User.aggregate([
      { $match: baseMatch },
      {
        $facet: {
          totalUsers: [{ $count: 'count' }],
          activeUsers: [
            { $match: { isActive: true, isSuspended: false } },
            { $count: 'count' }
          ],
          newThisWeek: [
            {
              $match: {
                createdAt: {
                  $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                }
              }
            },
            { $count: 'count' }
          ],
          pendingVerifications: [
            { $match: { isVerified: false, isActive: true } },
            { $count: 'count' }
          ],
          suspendedUsers: [
            { $match: { isSuspended: true } },
            { $count: 'count' }
          ],
          premiumUsers: [
            { $match: { membership: 'Premium' } },
            { $count: 'count' }
          ],
          freeUsers: [
            { $match: { membership: 'Free' } },
            { $count: 'count' }
          ],
          byGender: [
            { $group: { _id: '$gender', count: { $sum: 1 } } }
          ],
          byRole: [
            { $unwind: '$roles' },
            { $group: { _id: '$roles', count: { $sum: 1 } } }
          ],
          recentSignups: [
            { $sort: { createdAt: -1 } },
            { $limit: 5 },
            { $project: { fullName: 1, email: 1, createdAt: 1, profilePhoto: 1 } }
          ]
        }
      }
    ]);

    // Get consultant count
    const consultantsCount = await Consultant.countDocuments({ 
      status: 'ACTIVE',
      ...regionFilter 
    }).catch(() => 0);

    // Get profiles count
    const profilesCount = await MemberProfile.countDocuments({
      ...regionFilter
    }).catch(() => 0);

    // Extract counts with defaults
    const extract = (arr) => arr[0]?.count || 0;

    return {
      totalUsers: extract(result.totalUsers),
      activeUsers: extract(result.activeUsers),
      newThisWeek: extract(result.newThisWeek),
      pendingVerifications: extract(result.pendingVerifications),
      suspendedUsers: extract(result.suspendedUsers),
      premiumUsers: extract(result.premiumUsers),
      freeUsers: extract(result.freeUsers),
      consultantsCount,
      profilesCount,
      byGender: this.arrayToObject(result.byGender),
      byRole: this.arrayToObject(result.byRole),
      recentSignups: result.recentSignups,
      generatedAt: new Date()
    };
  }

  /**
   * Get trend data for charts
   */
  async getTrends({ metric = 'users', from, to, groupBy = 'day' } = {}) {
    const dateFilter = this.buildDateFilter(from, to, 'createdAt');
    
    const groupByFormat = {
      day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
      week: { $dateToString: { format: '%Y-W%V', date: '$createdAt' } },
      month: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }
    };

    const pipeline = [
      { $match: { deletedAt: null, ...dateFilter } },
      {
        $group: {
          _id: groupByFormat[groupBy] || groupByFormat.day,
          count: { $sum: 1 },
          activeCount: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          },
          premiumCount: {
            $sum: { $cond: [{ $eq: ['$membership', 'Premium'] }, 1, 0] }
          }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: '$_id',
          [metric === 'users' ? 'value' : metric]: '$count',
          active: '$activeCount',
          premium: '$premiumCount',
          _id: 0
        }
      }
    ];

    const trends = await User.aggregate(pipeline);

    return {
      metric,
      groupBy,
      data: trends,
      from: from || 'all-time',
      to: to || new Date()
    };
  }

  /**
   * Get top lists (cities, consultants, etc.)
   */
  async getTopLists({ limit = 10, region } = {}) {
    const regionFilter = region ? { 'location.city': new RegExp(region, 'i') } : {};

    // Top cities
    const topCities = await User.aggregate([
      { $match: { deletedAt: null, isActive: true, 'location.city': { $exists: true, $ne: '' }, ...regionFilter } },
      { $group: { _id: '$location.city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
      { $project: { city: '$_id', count: 1, _id: 0 } }
    ]);

    // Top consultants by profiles created
    const topConsultants = await Consultant.aggregate([
      { $match: { status: 'ACTIVE' } },
      { $sort: { profilesCreated: -1 } },
      { $limit: limit },
      { $project: { fullName: 1, agencyName: 1, profilesCreated: 1, regions: 1 } }
    ]).catch(() => []);

    // Top membership types
    const membershipDistribution = await User.aggregate([
      { $match: { deletedAt: null, isActive: true } },
      { $group: { _id: '$membership', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Age distribution
    const ageDistribution = await User.aggregate([
      { $match: { deletedAt: null, isActive: true, dob: { $exists: true } } },
      {
        $project: {
          ageGroup: {
            $switch: {
              branches: [
                { case: { $lt: [{ $subtract: [new Date().getFullYear(), { $year: '$dob' }] }, 25] }, then: '18-24' },
                { case: { $lt: [{ $subtract: [new Date().getFullYear(), { $year: '$dob' }] }, 31] }, then: '25-30' },
                { case: { $lt: [{ $subtract: [new Date().getFullYear(), { $year: '$dob' }] }, 36] }, then: '31-35' },
                { case: { $lt: [{ $subtract: [new Date().getFullYear(), { $year: '$dob' }] }, 41] }, then: '36-40' }
              ],
              default: '40+'
            }
          }
        }
      },
      { $group: { _id: '$ageGroup', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    return {
      topCities,
      topConsultants,
      membershipDistribution: this.arrayToObject(membershipDistribution),
      ageDistribution: this.arrayToObject(ageDistribution)
    };
  }

  /**
   * Get real-time activity feed
   */
  async getRealtimeActivity({ limit = 50 } = {}) {
    const activities = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('performedBy', 'fullName profilePhoto')
      .populate('targetUser', 'fullName email')
      .lean()
      .catch(() => []);

    return activities.map(a => ({
      id: a._id,
      action: a.action,
      description: a.description,
      performedBy: a.performedBy?.fullName || 'System',
      performedByPhoto: a.performedBy?.profilePhoto,
      targetUser: a.targetUser?.fullName,
      timestamp: a.createdAt,
      metadata: a.metadata
    }));
  }

  /**
   * Helper: Build date filter
   */
  buildDateFilter(from, to, field = 'createdAt') {
    const filter = {};
    if (from || to) {
      filter[field] = {};
      if (from) filter[field].$gte = new Date(from);
      if (to) filter[field].$lte = new Date(to);
    }
    return filter;
  }

  /**
   * Helper: Convert aggregation array to object
   */
  arrayToObject(arr) {
    return arr.reduce((acc, item) => {
      acc[item._id || 'unknown'] = item.count;
      return acc;
    }, {});
  }
}

module.exports = new DashboardService();
