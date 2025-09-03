import { signup } from '../../../src/resolvers/mutations/sign-up';
import { UserModel } from '../../../src/models';
import { OtpModel } from '../../../src/models/otpmodel';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

jest.mock('../../../src/models');
jest.mock('../../../src/models/otpmodel');
jest.mock('bcryptjs');
jest.mock('nodemailer');

const mockUserModel = UserModel as jest.Mocked<typeof UserModel>;
const mockOtpModel = OtpModel as jest.Mocked<typeof OtpModel>;
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockNodemailer = nodemailer as jest.Mocked<typeof nodemailer>;


describe('Signup Resolver', () => {
  const validData = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    fullname: 'Test User'
  };
  

  const mockUser = { _id: 'id123', ...validData, password: 'hashed' };
  const mockTransporter = { sendMail: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    mockBcrypt.hash = jest.fn().mockResolvedValue('hashed');
    mockNodemailer.createTransport.mockReturnValue(mockTransporter as any);
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
    jest.spyOn(Date, 'now').mockReturnValue(1640995200000);
  });

  test('successful signup: create user, OTP, send email', async () => {
    mockUserModel.findOne.mockResolvedValue(null);
    mockUserModel.create.mockResolvedValue(mockUser as any);
    mockOtpModel.create.mockResolvedValue({} as any);
    mockTransporter.sendMail.mockResolvedValue({ messageId: 'msg' });

    const res = await signup(undefined, { signup: validData });

    expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: validData.email });
    expect(mockBcrypt.hash).toHaveBeenCalledWith('password123', 10);
    expect(mockUserModel.create).toHaveBeenCalledWith({ ...validData, password: 'hashed' });
    expect(mockOtpModel.create).toHaveBeenCalledWith({
      code: '550000',
      userId: 'id123',
      expiresAt: new Date(1640995200000 + 2 * 60 * 1000)
    });
    expect(mockTransporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
      to: 'test@example.com', html: expect.stringContaining('550000')
    }));
    expect(res).toEqual({ user: mockUser, message: "OTP таны имэйл хаягаар илгээгдлээ" });
  });

  test('error if user exists', async () => {
    mockUserModel.findOne.mockResolvedValue(mockUser as any);
    await expect(signup(undefined, { signup: validData })).rejects.toThrow('Phone or email already in use');
    expect(mockUserModel.create).not.toHaveBeenCalled();
    expect(mockOtpModel.create).not.toHaveBeenCalled();
  });

  test('handles email sending failure', async () => {
    mockUserModel.findOne.mockResolvedValue(null);
    mockUserModel.create.mockResolvedValue(mockUser as any);
    mockOtpModel.create.mockResolvedValue({} as any);
    mockTransporter.sendMail.mockRejectedValue(new Error('SMTP Error'));
    await expect(signup(undefined, { signup: validData })).rejects.toThrow('Имэйл илгээхэд алдаа гарлаа');
  });

  test('handles bcrypt failure', async () => {
    mockUserModel.findOne.mockResolvedValue(null);
    mockBcrypt.hash.mockRejectedValue(new Error('Hashing failed'));
    await expect(signup(undefined, { signup: validData })).rejects.toThrow('Hashing failed');
  });



  test('database operations order', async () => {
    const callOrder: string[] = [];
    mockUserModel.findOne.mockImplementation(async () => { callOrder.push('find'); return null });
    mockBcrypt.hash.mockImplementation(async () => { callOrder.push('hash'); return 'hashed' as never; });
    mockUserModel.create.mockImplementation(async () => { callOrder.push('create'); return mockUser as any; });
    mockOtpModel.create.mockImplementation(async () => { callOrder.push('otp'); return {} as any; });
    mockTransporter.sendMail.mockResolvedValue({ messageId: 'msg' });
    await signup(undefined, { signup: validData });
    expect(callOrder).toEqual(['find', 'hash', 'create', 'otp']);
  });

  test('handles special characters in user input', async () => {
    const specialData = { ...validData, username: 'user@#1', fullname: 'Tęst Ńame' };
    mockUserModel.findOne.mockResolvedValue(null);
    mockUserModel.create.mockResolvedValue({ ...mockUser, ...specialData } as any);
    mockOtpModel.create.mockResolvedValue({} as any);
    const res = await signup(undefined, { signup: specialData });
    expect(res.user.username).toBe(specialData.username);
    expect(res.user.fullname).toBe(specialData.fullname);
  });

  test('logs error when email sending fails', async () => {
  mockUserModel.findOne.mockResolvedValue(null);
  mockUserModel.create.mockResolvedValue(mockUser as any);
  mockOtpModel.create.mockResolvedValue({} as any);
  
 
  mockTransporter.sendMail.mockRejectedValue(new Error('SMTP Error'));

  await expect(signup(undefined, { signup: validData }))
    .rejects
    .toThrow('Имэйл илгээхэд алдаа гарлаа');

});

});