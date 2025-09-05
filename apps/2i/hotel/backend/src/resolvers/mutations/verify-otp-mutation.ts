import { OptModel } from '../../models/otp-model';

export const verifyOtp = async (_: unknown, args: { code: string }) => {
  const existingOtp = await OptModel.findOne({ code: args.code });

  if (!existingOtp) {
    throw new Error('Invalid OTP code');
  }

  if (existingOtp.expiresAt < new Date()) {
    throw new Error('OTP code has expired');
  }

  await OptModel.deleteOne({ _id: existingOtp._id });

  return { success: true, message: 'OTP verified successfully' };
};
