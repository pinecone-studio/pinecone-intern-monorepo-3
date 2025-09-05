
import { UserModel } from "../../models"
import bcrypt from 'bcryptjs';  
import { OtpModel } from "../../models/otpmodel";
import nodemailer from "nodemailer";



type SignupInput = {
  username: string;
  email: string;
  password: string;
  fullname: string;
};

 export const signup =  async (_: unknown, { signup }: { signup: SignupInput }) => {
      const { username, email, password, fullname } = signup

      const existingUser = await UserModel.findOne({
        email
      })

      if (existingUser) {
        throw new Error('Phone or email already in use')
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      const user = await UserModel.create({
          fullname,
          username,
          email,
          password: hashedPassword,   
      })

     const code = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 2 * 60 * 1000); 

  
  await OtpModel.create({
    code: code,
    userId: user._id,
    expiresAt: otpExpiry,
  });


    const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "jochuekimmich@gmail.com",
      pass: "xcyqnkwxrykxstna",
    },
  });

    const options = {
    from: "jochuekimmich@gmail.com",
    to: email,
    subject: "Hello",
    html: `<div style="font-family: Arial, sans-serif; font-size: 16px;">
        <p>Сайн байна уу,</p>
        <p>Таны нэвтрэх код:</p>
        <h2 style="color: #2E86C1;">${code}</h2>
        <p>Энэхүү код 2 минутын хугацаанд хүчинтэй.</p>
      </div> `,
  };



    try {
      await transport.sendMail(options);
  } catch (error) {
    throw new Error("Имэйл илгээхэд алдаа гарлаа");
  }
      

      return {
         user,
         message: "OTP таны имэйл хаягаар илгээгдлээ"
      }
    }
  
  