import { troublelogin } from "../../../src/resolvers/mutations/trouble-login";
import { UserModel } from "../../../src/models";
import { OtpModel } from "../../../src/models/otpmodel";
import nodemailer from "nodemailer";

jest.mock("../../../src/models");
jest.mock("../../../src/models/otpmodel");

jest.mock('nodemailer', () => {
  return {
    createTransport: jest.fn().mockReturnValue({
      sendMail: jest.fn().mockResolvedValue(true),
    }),
  };
});

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {"ene shuu"});
});

describe("troublelogin function", () => {
  const mockEmail = "mnhtulgaa550@gmail.com";

  const mockUser = {
    _id: "user123",
    email: mockEmail,
  };

  let sendMailMock: jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  sendMailMock = jest.fn().mockResolvedValue(true);
  (nodemailer.createTransport as jest.Mock).mockReturnValue({
    sendMail: sendMailMock,
  });
});

  it("should throw error if user not found", async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);

    await expect(troublelogin(null, { trouble: { email: mockEmail } })).rejects.toThrow(
      "Имэйл хаяг бүртгэлтэй биш байна"
    );
  });

  it("should create OTP and send email successfully", async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    (OtpModel.create as jest.Mock).mockResolvedValue(true);

    const result = await troublelogin(null, { trouble: { email: mockEmail } });

    expect(UserModel.findOne).toHaveBeenCalledWith({ email: mockEmail });
    expect(OtpModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: mockUser._id,
        code: expect.any(String),
        expiresAt: expect.any(Date),
      })
    );
    expect(nodemailer.createTransport).toHaveBeenCalled();
    expect(sendMailMock).toHaveBeenCalled();
    expect(result).toEqual({ message: "OTP таны имэйл хаягаар илгээгдлээ" });
  });

  it("should throw error if sendMail fails", async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    (OtpModel.create as jest.Mock).mockResolvedValue(true);
    sendMailMock.mockRejectedValue(new Error("SMTP error"));

    await expect(troublelogin(null, { trouble: { email: mockEmail } })).rejects.toThrow(
      "Имэйл илгээхэд алдаа гарлаа"
    );
  });
});
