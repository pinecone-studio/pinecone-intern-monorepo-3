import { verifyOtp } from "../../../src/resolvers/mutations/otp-verify";
import { OtpModel } from "../../../src/models/otpmodel";
import { UserModel } from "../../../src/models";
import jwt from "jsonwebtoken";

jest.mock("../../../src/models/otpmodel");
jest.mock("../../../src/models");
jest.mock("jsonwebtoken");

describe("verifyOtp function", () => {
  const mockOtp = "123456";
  const mockUserId = "user123";
  const mockEmail = "test@example.com";
  const fakeDateNow = new Date();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers().setSystemTime(fakeDateNow);
  });

   beforeAll(() => {
    process.env.JWT_SECRET = 'supersecret';
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should throw error if OTP not found", async () => {
    (OtpModel.findOne as jest.Mock).mockReturnValue({
      sort: jest.fn().mockResolvedValue(null),
    });

    await expect(verifyOtp(null, { verifyOtp: { otp: mockOtp } })).rejects.toThrow(
      "OTP код олдсонгүй"
    );
  });

  it("should throw error if OTP expired", async () => {
    (OtpModel.findOne as jest.Mock).mockReturnValue({
      sort: jest.fn().mockResolvedValue({
        code: mockOtp,
        expiresAt: new Date(fakeDateNow.getTime() - 1000), 
        userId: mockUserId,
      }),
    });

    await expect(verifyOtp(null, { verifyOtp: { otp: mockOtp } })).rejects.toThrow(
      "OTP кодын хугацаа дууссан байна"
    );
  });

  it("should throw error if user not found", async () => {
    (OtpModel.findOne as jest.Mock).mockReturnValue({
      sort: jest.fn().mockResolvedValue({
        code: mockOtp,
        expiresAt: new Date(fakeDateNow.getTime() + 10000),
        userId: mockUserId,
      }),
    });
    (UserModel.findById as jest.Mock).mockResolvedValue(null);

    await expect(verifyOtp(null, { verifyOtp: { otp: mockOtp } })).rejects.toThrow(
      "Хэрэглэгч олдсонгүй"
    );
  });

  it("should activate user, save and return token and user", async () => {
    const mockUser = {
      id: mockUserId,
      email: mockEmail,
      isActive: false,
      save: jest.fn().mockResolvedValue(true),
    };

    (OtpModel.findOne as jest.Mock).mockReturnValue({
      sort: jest.fn().mockResolvedValue({
        code: mockOtp,
        expiresAt: new Date(fakeDateNow.getTime() + 10000),
        userId: mockUserId,
      }),
    });
    (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);

    (jwt.sign as jest.Mock).mockReturnValue("mocked_jwt_token");

    const result = await verifyOtp(null, { verifyOtp: { otp: mockOtp } });

    expect(mockUser.isActive).toBe(true);
    expect(mockUser.save).toHaveBeenCalled();
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: mockUser.id, email: mockUser.email },
      expect.any(String),
      { expiresIn: "7d" }
    );

    expect(result).toEqual({
      message: "OTP баталгаажуулалт амжилттай",
      token: "mocked_jwt_token",
      user: mockUser,
    });
  });
});
