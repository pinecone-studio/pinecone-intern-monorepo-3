// __tests__/user-login.test.ts

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../../../src/models/user-model';
import { userLogin } from '../../../src/resolvers/mutations/user-login';

// Mock dependencies
jest.mock('../../../src/models/user-model', () => ({
  UserModel: {
    findOne: jest.fn(),
  },
}));

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

describe('userLogin resolver', () => {
  const mockUser = {
    _id: 'user123',
    email: 'test@example.com',
    password: 'hashedPassword',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_PASSWORD = 'test_secret';
  });

  it('should login successfully with correct credentials', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('fake_jwt_token');

    const result = await userLogin(null, { email: mockUser.email, password: 'plainPassword' });

    expect(UserModel.findOne).toHaveBeenCalledWith({ email: mockUser.email });
    expect(bcrypt.compare).toHaveBeenCalledWith('plainPassword', mockUser.password);
    expect(jwt.sign).toHaveBeenCalledWith({ userId: mockUser._id }, 'test_secret');
    expect(result).toEqual({
      message: 'Login successful',
      token: 'fake_jwt_token',
    });
  });

  it('should throw an error if user is not found', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);

    await expect(userLogin(null, { email: 'wrong@example.com', password: 'any' })).rejects.toThrow('Email or password incorrect, please check again');
  });

  it('should throw an error if password is invalid', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(userLogin(null, { email: mockUser.email, password: 'wrongPassword' })).rejects.toThrow('Email or password incorrect, please check again');
  });

  it('should throw an error if jwt.sign fails', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockImplementation(() => {
      throw new Error('JWT failed');
    });

    await expect(userLogin(null, { email: mockUser.email, password: 'plainPassword' })).rejects.toThrow(/Server error/);
  });
});
