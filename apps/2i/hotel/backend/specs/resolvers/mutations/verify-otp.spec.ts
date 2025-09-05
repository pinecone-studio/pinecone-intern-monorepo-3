import { verifyOtp } from '../../../src/resolvers/mutations';
import { OptModel } from '../../../src/models/otp-model';

jest.mock('../../../src/models/otp-model');

describe('verifyOtp', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should verify OTP if code exists and not expired', async () => {
    const validOtp = {
      _id: 'mock-id',
      code: '1234',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    };

    (OptModel.findOne as jest.Mock).mockResolvedValue(validOtp);
    (OptModel.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 1 });

    const result = await verifyOtp(null, { code: '1234' });

    expect(OptModel.findOne).toHaveBeenCalledWith({ code: '1234' });
    expect(OptModel.deleteOne).toHaveBeenCalledWith({ _id: validOtp._id });
    expect(result).toEqual({ success: true, message: 'OTP verified successfully' });
  });

  it('should throw error if OTP code is not found', async () => {
    (OptModel.findOne as jest.Mock).mockResolvedValue(null);

    await expect(verifyOtp(null, { code: 'invalid' })).rejects.toThrow('Invalid OTP code');

    expect(OptModel.findOne).toHaveBeenCalledWith({ code: 'invalid' });
    expect(OptModel.deleteOne).not.toHaveBeenCalled();
  });

  it('should throw error if OTP is expired', async () => {
    const expiredOtp = {
      _id: 'mock-id',
      code: 'expired123',
      expiresAt: new Date(Date.now() - 1000),
    };

    (OptModel.findOne as jest.Mock).mockResolvedValue(expiredOtp);

    await expect(verifyOtp(null, { code: 'expired123' })).rejects.toThrow('OTP code has expired');

    expect(OptModel.findOne).toHaveBeenCalledWith({ code: 'expired123' });
    expect(OptModel.deleteOne).not.toHaveBeenCalled();
  });
});
