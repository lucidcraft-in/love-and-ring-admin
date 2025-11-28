const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'Username is required'],
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  passwordHash: {
    type: String,
    select: false // Don't include in queries by default
  },
  fullName: {
    type: String,
    trim: true,
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say']
  },
  dob: {
    type: Date
  },
  location: {
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true, default: 'India' }
  },
  profilePhoto: {
    type: String,
    default: null
  },
  shortBio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isSuspended: {
    type: Boolean,
    default: false
  },
  suspendedReason: String,
  suspendedAt: Date,
  suspendedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  roles: {
    type: [String],
    default: ['user'],
    enum: ['user', 'admin', 'consultant', 'moderator', 'support'],
    index: true
  },
  permissions: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  tags: {
    type: [String],
    default: []
  },
  membership: {
    type: String,
    enum: ['Free', 'Premium', 'VIP'],
    default: 'Free'
  },
  lastLogin: {
    type: Date
  },
  loginCount: {
    type: Number,
    default: 0
  },
  deletedAt: {
    type: Date,
    default: null
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  meta: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for age calculation
userSchema.virtual('age').get(function() {
  if (!this.dob) return null;
  const today = new Date();
  const birthDate = new Date(this.dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ 'location.city': 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ isActive: 1, roles: 1 });
userSchema.index({ fullName: 'text', email: 'text', username: 'text' });

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash') || !this.passwordHash) {
    return next();
  }
  // Only hash if it's not already hashed
  if (this.passwordHash && !this.passwordHash.startsWith('$2')) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  }
  next();
});

// Instance method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Static method to find active users
userSchema.statics.findActive = function(query = {}) {
  return this.find({ ...query, isActive: true, deletedAt: null });
};

// Transform for JSON output (remove sensitive fields)
userSchema.methods.toSafeObject = function() {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.__v;
  return obj;
};

// Card-friendly projection for list views
userSchema.statics.getCardProjection = function() {
  return {
    _id: 1,
    username: 1,
    fullName: 1,
    email: 1,
    profilePhoto: 1,
    phone: 1,
    gender: 1,
    dob: 1,
    location: 1,
    roles: 1,
    isActive: 1,
    isVerified: 1,
    isSuspended: 1,
    membership: 1,
    createdAt: 1,
    lastLogin: 1,
    shortBio: 1,
    tags: 1
  };
};

const User = mongoose.model('User', userSchema);

module.exports = User;
