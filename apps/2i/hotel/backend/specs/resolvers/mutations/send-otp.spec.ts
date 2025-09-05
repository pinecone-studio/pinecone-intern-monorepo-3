import { sendOtp } from '../../../src/resolvers/mutations';
import { OptModel } from '../../../src/models/otp-model';
import { UserModel } from '../../../src/models/user-model';
import nodemailer from 'nodemailer';

jest.mock('../../../src/models/user-model');
jest.mock('../../../src/models/otp-model');
jest.mock('nodemailer');

const sendMailMock = jest.fn();

(nodemailer.createTransport as jest.Mock).mockReturnValue({
  sendMail: sendMailMock,
});

describe('sendOtp', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send one-time password if email is not registered', async () => {
    const testEmail = 'test@example.com';

    (UserModel.findOne as jest.Mock).mockResolvedValue(null);

    (OptModel.findOneAndUpdate as jest.Mock).mockResolvedValue({ email: testEmail, code: '123456' });

    sendMailMock.mockResolvedValue(true);

    const result = await sendOtp(null, { email: testEmail });

    expect(UserModel.findOne).toHaveBeenCalledWith({ email: testEmail });
    expect(OptModel.findOneAndUpdate).toHaveBeenCalled();
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: testEmail,
        subject: expect.any(String),
        text: expect.stringContaining('Your OTP code is'),
      })
    );
    expect(result).toEqual({ success: true, message: 'OTP sent successfully' });
  });

  it('should throw error if email is already registered', async () => {
    const testEmail = 'already@registered.com';

    (UserModel.findOne as jest.Mock).mockResolvedValue({ email: testEmail });

    await expect(sendOtp(null, { email: testEmail })).rejects.toThrow('Email already registered');

    expect(UserModel.findOne).toHaveBeenCalledWith({ email: testEmail });
    expect(OptModel.findOneAndUpdate).not.toHaveBeenCalled();
    expect(sendMailMock).not.toHaveBeenCalled();
  });

  it('should throw error if email sending fails', async () => {
    const testEmail = 'fail@email.com';

    (UserModel.findOne as jest.Mock).mockResolvedValue(null);
    (OptModel.findOneAndUpdate as jest.Mock).mockResolvedValue({ email: testEmail, code: '654321' });

    sendMailMock.mockRejectedValue(new Error('SMTP error'));

    await expect(sendOtp(null, { email: testEmail })).rejects.toThrow('Failed to send OTP email');

    expect(sendMailMock).toHaveBeenCalled();
  });
});
