/* eslint-disable @nx/enforce-module-boundaries, @typescript-eslint/ban-ts-comment */

import { UserModel } from '../../../../src/models/user.model';
import { userLogin } from 'apps/2k/restaurant/backend/src/resolvers/mutations';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../../../../src/models/user.model');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('userLogin resolver', () => {
  const mockUser = {
    _id: 'mockid123',
    email: 'test@example.com',
    password: 'hashedpassword',
    username: 'koko',
    role: 'USER',
    bonusPoints: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    toObject: function () {
      return { ...this };
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ---------------------
  it('should throw error if user does not exist', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);

    await expect(userLogin(null, { input: { email: 'notfound@example.com', password: '123456' } })).rejects.toThrow('Email or password incorrect, please check again');

    expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'notfound@example.com' });
  });

  // ---------------------
  it('should throw error if password is incorrect', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(userLogin(null, { input: { email: 'test@example.com', password: 'wrongpassword' } })).rejects.toThrow('Email or password incorrect, please check again');

    expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedpassword');
  });

  // ---------------------
  it('should return token and user if login is successful', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('mocktoken');

    const result = await userLogin(null, { input: { email: 'test@example.com', password: '123456' } });

    expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(bcrypt.compare).toHaveBeenCalledWith('123456', 'hashedpassword');
    expect(jwt.sign).toHaveBeenCalledWith({ userId: mockUser._id.toString(), email: mockUser.email, role: mockUser.role }, expect.any(String), { expiresIn: '1d' });

    expect(result.user.password).toBeUndefined();

    expect(result.user.email).toBe('test@example.com');
    expect(result.user.userId).toBe(mockUser._id.toString());
    expect(result.user.createdAt).toBeDefined();
    expect(result.user.updatedAt).toBeDefined();

    expect(result.token).toBe('mocktoken');
  });

  it('should fallback to _id if userId is missing', async () => {
    const mockUserWithoutId = { ...mockUser, userId: undefined };
    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUserWithoutId);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('mocktoken');

    const result = await userLogin(null, { input: { email: 'test@example.com', password: '123456' } });

    expect(result.user.userId).toBe(mockUser._id.toString());
  });

  it('should cover delete password branch explicitly', async () => {
    const userCopy = { ...mockUser };
    (UserModel.findOne as jest.Mock).mockResolvedValue(userCopy);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('mocktoken');

    const result = await userLogin(null, { input: { email: 'test@example.com', password: '123456' } });

    expect(result.user.password).toBeUndefined();
  });
  it('should handle undefined createdAt and updatedAt', async () => {
    const mockUserNoDates = { ...mockUser, createdAt: undefined, updatedAt: undefined };
    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUserNoDates);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('mocktoken');

    const result = await userLogin(null, { input: { email: 'test@example.com', password: '123456' } });

    expect(result.user.createdAt).toBeUndefined();
    expect(result.user.updatedAt).toBeUndefined();
  });

  it('should throw if jwt.sign fails', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockImplementation(() => {
      throw new Error('JWT error');
    });

    await expect(userLogin(null, { input: { email: 'test@example.com', password: '123456' } })).rejects.toThrow('JWT error');
  });
});
