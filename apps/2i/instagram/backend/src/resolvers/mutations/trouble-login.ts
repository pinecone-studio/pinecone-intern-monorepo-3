import { UserModel } from "../../models";
import { OtpModel } from "../../models/otpmodel";
import nodemailer from "nodemailer";



type Trounlelogin =  {
    email:string
}

export const troublelogin = async (_: unknown ,{ trouble}: {trouble:Trounlelogin}) => {
 const { email, } = trouble;

 const user = await UserModel.findOne({ email });
  if (!user) {
    throw new Error("Имэйл хаяг бүртгэлтэй биш байна");
  }


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
    return { message: "OTP таны имэйл хаягаар илгээгдлээ" };
  } catch (error) {
    console.error("Имэйл илгээх алдаа:", error);
    throw new Error("Имэйл илгээхэд алдаа гарлаа");
  }
}