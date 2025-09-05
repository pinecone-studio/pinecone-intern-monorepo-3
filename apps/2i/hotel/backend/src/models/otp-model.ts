import { model, models, Schema } from 'mongoose';

type OtpType = {
  email: string;
  code: string;
  expiresAt: Date;
  verified: boolean;
};

const OtpSchema = new Schema<OtpType>(
  {
    email: { type: String, required: true, unique: true, ref: 'Users' },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const OptModel = models.Otp || model<OtpType>('Otp', OtpSchema);
