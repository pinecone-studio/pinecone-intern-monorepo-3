import { OptModel } from '../../models/otp-model';
import { UserModel } from '../../models/user-model';
import nodemailer from 'nodemailer';

export const sendOtp = async (_: unknown, args: { email: string }) => {
  const existingEmail = await UserModel.findOne({ email: args.email });

  if (existingEmail) {
    throw new Error('Email already registered');
  }

  const otpCode = generateOtp();

  await OptModel.findOneAndUpdate({ email: args.email }, { code: otpCode, expiresAt: new Date(Date.now() + 5 * 60 * 1000) }, { upsert: true, new: true });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: args.email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otpCode}. It will expire in 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: 'OTP sent successfully' };
  } catch (err) {
    throw new Error('Failed to send OTP email');
  }
};

function generateOtp() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}
