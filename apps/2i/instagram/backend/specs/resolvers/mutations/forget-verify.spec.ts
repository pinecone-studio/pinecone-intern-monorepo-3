import { forgetverify } from "../../../src/resolvers/mutations/forget-verify";
import { OtpModel } from "../../../src/models/otpmodel";
import { UserModel } from "../../../src/models";
import nodemailer from "nodemailer";

jest.mock("../../../src/models");
jest.mock("../../../src/models/otpmodel");
jest.mock("nodemailer");

describe("forgetverify", () => {
  const mockUser = {
    _id: "user123",
    email: "test@example.com"
  };

  const sendMailMock = jest.fn().mockResolvedValue(true);

  beforeEach(() => {
    jest.clearAllMocks();

    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    (OtpModel.create as jest.Mock).mockResolvedValue({});
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: sendMailMock
    });
  });

  it("should throw an error if user is not found", async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);

    const input = {
      forget: {
        email: "notfound@example.com"
      }
    };

    await expect(forgetverify(undefined, input)).rejects.toThrow("Имэйл хаяг бүртгэлтэй биш байна");
  });

  it("should generate OTP and send email", async () => {
    const input = {
      forget: {
        email: "test@example.com"
      }
    };

    const response = await forgetverify(undefined, input);

    expect(UserModel.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(OtpModel.create).toHaveBeenCalledWith(expect.objectContaining({
      userId: "user123",
      code: expect.any(String),
      expiresAt: expect.any(Date),
    }));
    expect(sendMailMock).toHaveBeenCalled();
    expect(response).toEqual({ message: "OTP таны имэйл хаягаар илгээгдлээ" });
  });

  it("should throw error if email sending fails", async () => {
    sendMailMock.mockRejectedValue(new Error("SMTP Error"));

    const input = {
      forget: {
        email: "test@example.com"
      }
    };

    await expect(forgetverify(undefined, input)).rejects.toThrow("Имэйл илгээхэд алдаа гарлаа");
  });
});
