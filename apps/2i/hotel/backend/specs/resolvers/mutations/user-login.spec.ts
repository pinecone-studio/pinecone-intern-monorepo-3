import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../../../src/models/user-model';
import { userLogin } from '../../../src/resolvers/mutations/user-login';

// Mock dependencies
jest.mock('../../../src/models/user-model');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('userLogin resolver', () => {
  const mockUser = {
    _id: '123',
    email: 'test@example.com',
    password: 'hashedPassword',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_TOKEN = 'testsecret';
  });

  it('should throw error if user does not exist', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);

    await expect(userLogin({}, { email: 'notfound@example.com', password: '123456' })).rejects.toThrow('Email or password incorrect, please check again');
  });

  it('should throw error if password is invalid', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(userLogin({}, { email: mockUser.email, password: 'wrongpass' })).rejects.toThrow('Email or password incorrect, please check again');
  });

  it('should return token if login is successful', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('fakeToken');

    const result = await userLogin({}, { email: mockUser.email, password: 'correctpass' });

    expect(result).toEqual({
      message: 'Login successful',
      token: 'fakeToken',
    });
    expect(UserModel.findOne).toHaveBeenCalledWith({ email: mockUser.email });
    expect(bcrypt.compare).toHaveBeenCalledWith('correctpass', mockUser.password);
    expect(jwt.sign).toHaveBeenCalledWith({ userId: mockUser._id }, 'testsecret');
  });
});
