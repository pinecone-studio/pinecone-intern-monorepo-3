import { UserModel } from "../../models";
import { OtpModel } from "../../models/otpmodel";

type LoginVerifyInput = {
  otp: string;
};

export const forgetverifyOtp = async (
  _: unknown,
  { verifyOtp }: { verifyOtp: LoginVerifyInput }
) => {
  const { otp } = verifyOtp;

  const otpRecord = await OtpModel.findOne({ code: otp }).sort({ createdAt: -1 });

  if (!otpRecord) {
    throw new Error("OTP_NOT_FOUND");
  }

  const currentTime = new Date();

  if (currentTime > otpRecord.expiresAt) {
    throw new Error("OTP_EXPIRED");
  }

  const user = await UserModel.findById(otpRecord.userId);

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  user.isActive = true;
  await user.save();

  return {
    message: "OTP баталгаажуулалт амжилттай",
    user
  };
};
