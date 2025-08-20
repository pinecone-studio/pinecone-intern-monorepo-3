import mongoose, { Schema, Document, Types } from "mongoose";

export interface Otp extends Document {
  userId: Types.ObjectId;
  code: string;
  
  createdAt: Date;
}

const OtpSchema = new Schema<Otp>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 100 }, 
});

export const OtpModel = mongoose.models.Otp || mongoose.model<Otp>("Otp", OtpSchema);