import { userLogin } from '../../../src/resolvers/mutations/user-login';
import { UserModel } from '../../../src/models/user-model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('../../../src/models/user-model', () => ({
  UserModel: {
    findOne: jest.fn(),
  },
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

describe('userLogin', () => {
  const mockUser = {
    _id: '12345',
    email: 'test@example.com',
    password: 'hashedPassword',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_PASSWORD = 'test-secret';
  });

  it('should throw an error if user does not exist', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);

    const result = await userLogin(null, { email: 'no@user.com', password: 'password123' });

    expect(result).toEqual({
      message: 'Something went wrong Email or password incorrect, please check again',
    });
    expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'no@user.com' });
  });

  it('should throw an error if password is invalid', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const result = await userLogin(null, { email: mockUser.email, password: 'wrongPass' });

    expect(result).toEqual({
      message: 'Something went wrong Email or password incorrect, please check again',
    });
    expect(bcrypt.compare).toHaveBeenCalledWith('wrongPass', mockUser.password);
  });

  it('should return a token if login is successful', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('mockedToken');

    const result = await userLogin(null, { email: mockUser.email, password: 'validPass' });

    expect(result).toEqual({
      message: 'Login successful',
      token: 'mockedToken',
    });
    expect(jwt.sign).toHaveBeenCalledWith({ userId: mockUser._id }, process.env.JWT_PASSWORD);
  });

  it('should handle unexpected errors', async () => {
    (UserModel.findOne as jest.Mock).mockRejectedValue(new Error('DB error'));

    const result = await userLogin(null, { email: mockUser.email, password: 'anyPass' });

    expect(result).toEqual({
      message: 'Something went wrong DB error',
    });
  });
});
