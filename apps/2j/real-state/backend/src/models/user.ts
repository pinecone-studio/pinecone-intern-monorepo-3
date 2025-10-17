import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// User interface matching your database model
export interface IUser {
  email: string;
  password: string;
  isAdmin: boolean;
  phone: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {}

// User schema matching your database model
const UserSchema = new Schema<IUserDocument>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  phone: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save middleware for password hashing
UserSchema.pre('save', async function() {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  this.updatedAt = new Date();
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);