import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import { 
  IUser, 
  CreateUserInput, 
  UpdateUserInput,
  UserRole, 
  Language,
  Address,
  LocalizedContent 
} from '../types';

// Interface for User document methods
export interface IUserDocument extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  preferredLanguage: Language;
  address?: Address;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  bio?: LocalizedContent;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  preferences?: {
    notifications: boolean;
    newsletter: boolean;
    smsAlerts: boolean;
  };
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  passwordResetToken?: string;
  passwordResetTokenExpiry?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  loginCount: number;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateVerificationToken(): string;
  generatePasswordResetToken(): string;
  toPublicJSON(): Partial<IUser>;
  updateLastLogin(): Promise<void>;
  incrementLoginCount(): Promise<void>;
  hasRole(role: UserRole): boolean;
  isProfileComplete(): boolean;
}

// Interface for User static methods
export interface IUserModel extends Model<IUserDocument> {
  findByEmail(email: string): Promise<IUserDocument | null>;
  findByEmailAndPassword(email: string, password: string): Promise<IUserDocument | null>;
  findActiveUsers(): Promise<IUserDocument[]>;
  findByRole(role: UserRole): Promise<IUserDocument[]>;
  createUser(input: CreateUserInput): Promise<IUserDocument>;
  updateUser(id: string, input: UpdateUserInput): Promise<IUserDocument | null>;
  deleteUser(id: string): Promise<boolean>;
  searchUsers(query: string, limit?: number): Promise<IUserDocument[]>;
  getUserStats(): Promise<{
    total: number;
    active: number;
    verified: number;
    byRole: Record<UserRole, number>;
  }>;
}

// Address sub-schema
const AddressSchema = new Schema<Address>({
  street: { 
    type: String, 
    required: [true, 'Street is required'],
    trim: true,
    maxlength: [200, 'Street cannot be longer than 200 characters']
  },
  city: { 
    type: String, 
    required: [true, 'City is required'],
    trim: true,
    maxlength: [100, 'City cannot be longer than 100 characters']
  },
  district: { 
    type: String, 
    required: [true, 'District is required'],
    trim: true,
    maxlength: [100, 'District cannot be longer than 100 characters']
  },
  khoroo: { 
    type: String, 
    trim: true,
    maxlength: [50, 'Khoroo cannot be longer than 50 characters']
  },
  building: { 
    type: String, 
    trim: true,
    maxlength: [50, 'Building cannot be longer than 50 characters']
  },
  apartment: { 
    type: String, 
    trim: true,
    maxlength: [20, 'Apartment cannot be longer than 20 characters']
  },
  zipCode: { 
    type: String, 
    trim: true,
    validate: {
      validator: function(v: string) {
        return !v || /^\d{5}$/.test(v);
      },
      message: 'Zip code must be 5 digits'
    }
  },
  coordinates: {
    latitude: { 
      type: Number
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90']
    },
    longitude: { 
      type: Number
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180']
    }
  },
  description: {
    en: { type: String, trim: true },
    mn: { type: String, trim: true }
  }
}, { _id: false });

// Localized Content sub-schema
const LocalizedContentSchema = new Schema<LocalizedContent>({
  en: { 
    type: String, 
    required: [true, 'English content is required'],
    trim: true 
  },
  mn: { 
    type: String, 
    required: [true, 'Mongolian content is required'],
    trim: true 
  }
}, { _id: false });

// User Schema
const UserSchema = new Schema<IUserDocument>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot be longer than 50 characters'],
    validate: {
      validator: function(v: string) {
        return /^[a-zA-ZаџЮЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮ\s]+$/.test(v);
      },
      message: 'First name can only contain letters and spaces'
    }
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot be longer than 50 characters'],
    validate: {
      validator: function(v: string) {
        return /^[a-zA-ZаџЮЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮ\s]+$/.test(v);
      },
      message: 'Last name can only contain letters and spaces'
    }
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    validate: {
      validator: function(v: string) {
        return /^(\+976|976)?\d{8}$/.test(v.replace(/[\s-]/g, ''));
      },
      message: 'Please provide a valid Mongolian phone number'
    }
  },
  avatar: {
    type: String,
    validate: [validator.isURL, 'Please provide a valid avatar URL']
  },
  role: {
    type: String,
    enum: {
      values: Object.values(UserRole),
      message: '{VALUE} is not a valid user role'
    },
    default: UserRole.BUYER
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  preferredLanguage: {
    type: String,
    enum: {
      values: Object.values(Language),
      message: '{VALUE} is not a valid language'
    },
    default: Language.MN
  },
  address: AddressSchema,
  dateOfBirth: {
    type: Date,
    validate: {
      validator: function(v: Date) {
        if (!v) return true;
        const now = new Date();
        const age = now.getFullYear() - v.getFullYear();
        return age >= 18 && age <= 120;
      },
      message: 'User must be between 18 and 120 years old'
    }
  },
  gender: {
    type: String,
    enum: {
      values: ['male', 'female', 'other'],
      message: '{VALUE} is not a valid gender'
    }
  },
  bio: LocalizedContentSchema,
  socialMedia: {
    facebook: {
      type: String,
      validate: {
        validator: function(v: string) {
          return !v || /^https?:\/\/(www\.)?facebook\.com\//.test(v);
        },
        message: 'Please provide a valid Facebook URL'
      }
    },
    instagram: {
      type: String,
      validate: {
        validator: function(v: string) {
          return !v || /^https?:\/\/(www\.)?instagram\.com\//.test(v);
        },
        message: 'Please provide a valid Instagram URL'
      }
    },
    linkedin: {
      type: String,
      validate: {
        validator: function(v: string) {
          return !v || /^https?:\/\/(www\.)?linkedin\.com\//.test(v);
        },
        message: 'Please provide a valid LinkedIn URL'
      }
    }
  },
  preferences: {
    notifications: { type: Boolean, default: true },
    newsletter: { type: Boolean, default: false },
    smsAlerts: { type: Boolean, default: false }
  },
  // Security fields
  verificationToken: String,
  verificationTokenExpiry: Date,
  passwordResetToken: String,
  passwordResetTokenExpiry: Date,
  loginAttempts: { type: Number default: 0 },
  lockUntil: Date,
  loginCount: { type: Number default: 0 },
  lastLoginAt: Date,
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for performance optimization
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ isVerified: 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ 'address.city': 1 });
UserSchema.index({ 'address.district': 1 });

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for age
UserSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  return Math.floor((Date.now() - this.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
});

// Virtual for account locked status
UserSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware: Hash password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Pre-save middleware: Update updatedAt
UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Pre-save middleware: Validate unique email
UserSchema.pre('save', async function(next) {
  if (!this.isModified('email')) return next();
  
  const existingUser = await (this.constructor as IUserModel).findOne({ 
    email: this.email,
    _id: { $ne: this._id }
  });
  
  if (existingUser) {
    const error = new Error('Email already exists');
    return next(error);
  }
  
  next();
});

// Instance Methods
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.generateVerificationToken = function(): string {
  const token = Math.random().toString(36).substr(2, 15) + Math.random().toString(36).substr(2, 15);
  this.verificationToken = token;
  this.verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  return token;
};

UserSchema.methods.generatePasswordResetToken = function(): string {
  const token = Math.random().toString(36).substr(2, 15) + Math.random().toString(36).substr(2, 15);
  this.passwordResetToken = token;
  this.passwordResetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  return token;
};

UserSchema.methods.toPublicJSON = function(): Partial<IUser> {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.verificationToken;
  delete userObject.verificationTokenExpiry;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetTokenExpiry;
  delete userObject.loginAttempts;
  delete userObject.lockUntil;
  return userObject;
};

UserSchema.methods.updateLastLogin = async function(): Promise<void> {
  this.lastLoginAt = new Date();
  this.loginAttempts = 0;
  this.lockUntil = undefined;
  await this.save();
};

UserSchema.methods.incrementLoginCount = async function(): Promise<void> {
  this.loginCount += 1;
  await this.save();
};

UserSchema.methods.hasRole = function(role: UserRole): boolean {
  return this.role === role;
};

UserSchema.methods.isProfileComplete = function(): boolean {
  return !!(
    this.firstName &&
    this.lastName &&
    this.phone &&
    this.email &&
    this.isVerified
  );
};

// Static Methods
UserSchema.statics.findByEmail = async function(email: string): Promise<IUserDocument | null> {
  return this.findOne({ email: email.toLowerCase() }).select('+password');
};

UserSchema.statics.findByEmailAndPassword = async function(
  email: string, 
  password: string
): Promise<IUserDocument | null> {
  const user = await this.findByEmail(email);
  if (!user) return null;
  
  const isMatch = await user.comparePassword(password);
  return isMatch ? user : null;
};

UserSchema.statics.findActiveUsers = async function(): Promise<IUserDocument[]> {
  return this.find({ isActive: true }).sort({ createdAt: -1 });
};

UserSchema.statics.findByRole = async function(role: UserRole): Promise<IUserDocument[]> {
  return this.find({ role, isActive: true }).sort({ createdAt: -1 });
};

UserSchema.statics.createUser = async function(input: CreateUserInput): Promise<IUserDocument> {
  const user = new this(input);
  return user.save();
};

UserSchema.statics.updateUser = async function(
  id: string, 
  input: UpdateUserInput
): Promise<IUserDocument | null> {
  return this.findByIdAndUpdate(id, input, { 
    new: true, 
    runValidators: true 
  });
};

UserSchema.statics.deleteUser = async function(id: string): Promise<boolean> {
  const result = await this.findByIdAndUpdate(id, { isActive: false });
  return !!result;
};

UserSchema.statics.searchUsers = async function(
  query: string, 
  limit: number = 10
): Promise<IUserDocument[]> {
  return this.find({
    $and: [
      { isActive: true },
      {
        $or: [
          { firstName: { $regex: query, $options: 'i' } },
          { lastName: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } }
        ]
      }
    ]
  }).limit(limit);
};

UserSchema.statics.getUserStats = async function() {
  const [totalResult, activeResult, verifiedResult, roleResults] = await Promise.all([
    this.countDocuments(),
    this.countDocuments({ isActive: true }),
    this.countDocuments({ isVerified: true }),
    this.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ])
  ]);

  const byRole = roleResults.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {} as Record<UserRole, number>);

  // Initialize missing roles with 0
  Object.values(UserRole).forEach(role => {
    if (!(role in byRole)) {
      byRole[role] = 0;
    }
  });

  return {
    total: totalResult,
    active: activeResult,
    verified: verifiedResult,
    byRole
  };
};

// Create and export model
export const User = mongoose.model<IUserDocument, IUserModel>('User', UserSchema);

// Export convenience functions
export const createUser = (input: CreateUserInput) => User.createUser(input);
export const findUserByEmail = (email: string) => User.findByEmail(email);
export const findUserById = (id: string) => User.findById(id);
export const updateUser = (id: string, input: UpdateUserInput) => User.updateUser(id, input);
export const deleteUser = (id: string) => User.deleteUser(id);
export const searchUsers = (query: string, limit?: number) => User.searchUsers(query, limit);
export const getUserStats = () => User.getUserStats();