import mongoose, { Schema, Types, Document } from "mongoose";


export interface User extends Document {
  email: string;
  username: string;
  fullname: string;
  password: string;
  bio?: string;         
  gender?: "male" | "female" | "Prefer not to say"
  profilePicture?: string;
  followers: Types.ObjectId[];  
  following: Types.ObjectId[];
  followRequests: Types.ObjectId[]
  isVerified: boolean;
  verificationToken?: string;
  isPrivate: boolean;
   otp?: string;     
  otpExpires?: Date;  
}

const UserSchema: Schema<User> = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  fullname: { type: String, required: true },
  password: { type: String, required: true },
otp: {
  type: String,
  required: false,
},
otpExpires: {
  type: Date,
  required: false,
},
  bio: { type: String, default: '' },
  gender: {
    type: String,
    enum: ["male", "female", "Prefer not to say"],
    default: "Prefer not to say",
  },
  profilePicture: { type: String, default: '' },
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  followRequests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  isPrivate: { type: Boolean, default: false }
});

UserSchema.index({ username: 1 }, { unique: true });

export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);

 