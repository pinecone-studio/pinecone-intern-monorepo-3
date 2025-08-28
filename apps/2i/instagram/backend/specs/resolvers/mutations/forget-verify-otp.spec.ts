import { forgetverifyOtp } from "../../../src/resolvers/mutations/forget-verify-otp";
import { OtpModel } from "../../../src/models/otpmodel";
import { UserModel } from "../../../src/models";

jest.mock("../../../src/models");
jest.mock("../../../src/models/otpmodel");

describe("forgetverifyOtp", () => {
  const mockOtp = {
    code: "123456",
    userId: "user123",
    expiresAt: new Date(Date.now() + 60 * 1000), 
  };

  const mockUser = {
    _id: "user123",
    isActive: false,
    save: jest.fn().mockResolvedValue(true),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw OTP_NOT_FOUND if OTP is invalid", async () => {
    (OtpModel.findOne as jest.Mock).mockReturnValue({
      sort: jest.fn().mockResolvedValue(null),
    });

    const input = { verifyOtp: { otp: "wrongotp" } };

    await expect(forgetverifyOtp(undefined, input)).rejects.toThrow("OTP_NOT_FOUND");
  });

  it("should throw OTP_EXPIRED if OTP is expired", async () => {
    (OtpModel.findOne as jest.Mock).mockReturnValue({
      sort: jest.fn().mockResolvedValue({
        ...mockOtp,
        expiresAt: new Date(Date.now() - 1 * 60 * 1000), // Дууссан
      }),
    });

    const input = { verifyOtp: { otp: "123456" } };

    await expect(forgetverifyOtp(undefined, input)).rejects.toThrow("OTP_EXPIRED");
  });

  it("should throw USER_NOT_FOUND if user does not exist", async () => {
    (OtpModel.findOne as jest.Mock).mockReturnValue({
      sort: jest.fn().mockResolvedValue(mockOtp),
    });

    (UserModel.findById as jest.Mock).mockResolvedValue(null);

    const input = { verifyOtp: { otp: "123456" } };

    await expect(forgetverifyOtp(undefined, input)).rejects.toThrow("USER_NOT_FOUND");
  });

  it("should verify OTP and activate user", async () => {
    (OtpModel.findOne as jest.Mock).mockReturnValue({
      sort: jest.fn().mockResolvedValue(mockOtp),
    });

    (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);

    const input = { verifyOtp: { otp: "123456" } };

    const result = await forgetverifyOtp(undefined, input);

    expect(UserModel.findById).toHaveBeenCalledWith("user123");
    expect(mockUser.isActive).toBe(true);
    expect(mockUser.save).toHaveBeenCalled();
    expect(result).toEqual({
      message: "OTP баталгаажуулалт амжилттай",
      user: mockUser,
    });
  });
});
