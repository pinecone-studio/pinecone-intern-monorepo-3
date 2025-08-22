import { UserModel } from "../../models";
import { OtpModel } from "../../models/otpmodel";
import jwt from "jsonwebtoken";


type LoginVerify = {
  otp:string
};



  
  export const verifyOtp =  async (_: unknown, { verifyOtp}: {verifyOtp:LoginVerify}) => {
    const JWT_SECRET = process.env.JWT_SECRET as string;
    
const { otp }= verifyOtp

    
      const otpRecord = await OtpModel.findOne({code:otp }).sort({ createdAt: -1 });
      if (!otpRecord) {
        throw new Error("OTP код олдсонгүй");
      }

     
      const currentTime = new Date();
      if (currentTime > otpRecord.expiresAt) {
        throw new Error("OTP кодын хугацаа дууссан байна");
      }

       const user = await UserModel.findById(otpRecord.userId);
  if (!user) {
    throw new Error("Хэрэглэгч олдсонгүй");
  }
  
  
      user.isActive = true;
      await user.save();

      const token = jwt.sign({ userId: user.id, email: user.email, }, JWT_SECRET, {
    expiresIn: "7d",
  });

      return { message: "OTP баталгаажуулалт амжилттай",
        token,
    user
       };
       
    }


