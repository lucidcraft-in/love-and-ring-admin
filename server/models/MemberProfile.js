/**
 * Member Profile Model
 * Profiles created by consultants for matrimony members
 */
const mongoose = require('mongoose');

const memberProfileSchema = new mongoose.Schema({
  // Basic Info
  profileId: {
    type: String,
    unique: true,
    required: true
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other']
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  age: {
    type: Number
  },
  maritalStatus: {
    type: String,
    enum: ['Never Married', 'Divorced', 'Widowed', 'Separated'],
    default: 'Never Married'
  },
  
  // Contact Info
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  alternatePhone: {
    type: String
  },
  
  // Location
  country: {
    type: String,
    default: 'India'
  },
  state: {
    type: String
  },
  city: {
    type: String
  },
  address: {
    type: String
  },
  
  // Physical Details
  height: {
    type: String
  },
  weight: {
    type: String
  },
  bodyType: {
    type: String,
    enum: ['Slim', 'Average', 'Athletic', 'Heavy']
  },
  complexion: {
    type: String,
    enum: ['Very Fair', 'Fair', 'Wheatish', 'Dusky', 'Dark']
  },
  
  // Religion & Caste
  religion: {
    type: String
  },
  caste: {
    type: String
  },
  subCaste: {
    type: String
  },
  gothra: {
    type: String
  },
  manglik: {
    type: String,
    enum: ['Yes', 'No', 'Partial', 'Not Applicable']
  },
  
  // Education & Career
  education: {
    type: String
  },
  educationDetails: {
    type: String
  },
  occupation: {
    type: String
  },
  company: {
    type: String
  },
  annualIncome: {
    type: String
  },
  workLocation: {
    type: String
  },
  
  // Family Details
  fatherName: {
    type: String
  },
  fatherOccupation: {
    type: String
  },
  motherName: {
    type: String
  },
  motherOccupation: {
    type: String
  },
  siblings: {
    type: String
  },
  familyType: {
    type: String,
    enum: ['Joint', 'Nuclear']
  },
  familyStatus: {
    type: String,
    enum: ['Middle Class', 'Upper Middle Class', 'Rich', 'Affluent']
  },
  
  // Partner Preferences
  partnerPreferences: {
    ageRange: {
      min: Number,
      max: Number
    },
    heightRange: {
      min: String,
      max: String
    },
    maritalStatus: [String],
    religion: [String],
    caste: [String],
    education: [String],
    occupation: [String],
    location: [String],
    additionalPreferences: String
  },
  
  // Photos & Documents
  photos: [{
    url: String,
    isMain: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false }
  }],
  documents: [{
    type: { type: String },
    url: String,
    isVerified: { type: Boolean, default: false }
  }],
  
  // Profile Status
  status: {
    type: String,
    enum: ['Draft', 'Pending', 'Active', 'Inactive', 'Hidden', 'Blocked'],
    default: 'Draft'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  
  // Consultant/Admin tracking
  createdByConsultant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consultant',
    required: true
  },
  lastModifiedByConsultant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consultant'
  },
  assignedBranch: {
    type: String
  },
  
  // Notes
  internalNotes: {
    type: String
  },
  
  // Soft delete
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'deletedByModel'
  },
  deletedByModel: {
    type: String,
    enum: ['User', 'Consultant']
  }
}, {
  timestamps: true
});

// Indexes
memberProfileSchema.index({ profileId: 1 });
memberProfileSchema.index({ createdByConsultant: 1 });
memberProfileSchema.index({ status: 1 });
memberProfileSchema.index({ gender: 1, status: 1 });
memberProfileSchema.index({ religion: 1, caste: 1 });
memberProfileSchema.index({ city: 1, state: 1 });
memberProfileSchema.index({ isDeleted: 1 });

// Pre-save hook to calculate age
memberProfileSchema.pre('save', function(next) {
  if (this.dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    this.age = age;
  }
  next();
});

// Generate profile ID
memberProfileSchema.statics.generateProfileId = async function() {
  const prefix = 'MM';
  const year = new Date().getFullYear().toString().slice(-2);
  const count = await this.countDocuments();
  const sequence = (count + 1).toString().padStart(6, '0');
  return `${prefix}${year}${sequence}`;
};

// Soft delete method
memberProfileSchema.methods.softDelete = async function(deletedBy, deletedByModel) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedBy = deletedBy;
  this.deletedByModel = deletedByModel;
  return this.save();
};

module.exports = mongoose.model('MemberProfile', memberProfileSchema);
