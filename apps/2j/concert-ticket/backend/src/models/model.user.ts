import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  username?: string;
  phoneNumber?: string;
  address?: string;
  password: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(_candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    trim: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['USER', 'ADMIN'],
    default: 'USER'
  }
}, {
  timestamps: true
});

// Password hash хийх middleware - зөвхөн password өөрчлөгдсөн үед hash хийх
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Password шалгах method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  const stored: string = this.password;
  // Хэрэв хадгалсан нууц үг bcrypt hash биш бол plaintext fallback-р шалгах
  const looksHashed = typeof stored === 'string' && stored.startsWith('$2');
  if (!looksHashed) {
    return candidatePassword === stored;
  }
  return bcrypt.compare(candidatePassword, stored);
};

export const User = mongoose.model<IUser>('User', UserSchema);