/**
 * Consultant Model
 * Stores broker/consultant information with approval workflow
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const consultantSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  passwordHash: {
    type: String,
    default: null
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number']
  },
  agencyName: {
    type: String,
    trim: true,
    maxlength: [200, 'Agency name cannot exceed 200 characters']
  },
  licenseNumber: {
    type: String,
    trim: true
  },
  regions: [{
    type: String,
    trim: true
  }],
  permissions: {
    create_profile: { type: Boolean, default: false },
    edit_profile: { type: Boolean, default: false },
    view_profile: { type: Boolean, default: true },
    delete_profile: { type: Boolean, default: false }
  },
  status: {
    type: String,
    enum: ['PENDING', 'ACTIVE', 'REJECTED', 'SUSPENDED'],
    default: 'PENDING'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  rejectedReason: {
    type: String,
    maxlength: [500, 'Rejection reason cannot exceed 500 characters']
  },
  rejectedAt: {
    type: Date
  },
  passwordResetToken: {
    type: String
  },
  passwordResetExpires: {
    type: Date
  },
  lastLogin: {
    type: Date
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for performance
consultantSchema.index({ email: 1 });
consultantSchema.index({ username: 1 });
consultantSchema.index({ status: 1 });
consultantSchema.index({ regions: 1 });
consultantSchema.index({ createdAt: -1 });

// Virtual for checking if account is locked
consultantSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password
consultantSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash') || !this.passwordHash) {
    return next();
  }
  
  // Only hash if it's a plain password (not already hashed)
  if (this.passwordHash.length < 50) {
    const salt = await bcrypt.genSalt(12);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  }
  next();
});

// Method to compare password
consultantSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Method to increment login attempts
consultantSchema.methods.incLoginAttempts = async function() {
  // Reset if lock has expired
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 };
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
consultantSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $set: { loginAttempts: 0, lastLogin: new Date() },
    $unset: { lockUntil: 1 }
  });
};

// Static method to find by credentials
consultantSchema.statics.findByCredentials = async function(username, password) {
  const consultant = await this.findOne({
    $or: [{ username: username.toLowerCase() }, { email: username.toLowerCase() }]
  });
  
  if (!consultant) {
    throw new Error('Invalid credentials');
  }
  
  if (consultant.isLocked) {
    throw new Error('Account is temporarily locked. Please try again later.');
  }
  
  if (consultant.status !== 'ACTIVE') {
    const statusMessages = {
      'PENDING': 'Your account is pending approval. Please wait for admin verification.',
      'REJECTED': 'Your account has been rejected. Please contact support.',
      'SUSPENDED': 'Your account has been suspended. Please contact support.'
    };
    throw new Error(statusMessages[consultant.status] || 'Account is not active');
  }
  
  const isMatch = await consultant.comparePassword(password);
  
  if (!isMatch) {
    await consultant.incLoginAttempts();
    throw new Error('Invalid credentials');
  }
  
  await consultant.resetLoginAttempts();
  return consultant;
};

module.exports = mongoose.model('Consultant', consultantSchema);
