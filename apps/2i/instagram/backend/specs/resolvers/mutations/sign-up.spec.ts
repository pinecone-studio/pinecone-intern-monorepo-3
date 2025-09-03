import { UserModel } from '../../../src/models';
import bcrypt from 'bcryptjs';
import { signup } from '../../../src/resolvers/mutations/sign-up';

jest.mock('.../../../src/models', () => ({
  UserModel: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('bcryptjs');

describe('Signup Mutation without token', () => {
  const input = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    fullname: 'Test User',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create and return a user without token', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);

    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

    (UserModel.create as jest.Mock).mockResolvedValue({
      id: 'userId123',
      username: input.username,
      email: input.email,
      fullname: input.fullname,
      password: 'hashedPassword',
    });

    const result = await signup(null, { signup: input });

    expect(UserModel.findOne).toHaveBeenCalledWith({ email: input.email });
    expect(bcrypt.hash).toHaveBeenCalledWith(input.password, 10);
    expect(UserModel.create).toHaveBeenCalledWith({
      username: input.username,
      email: input.email,
      fullname: input.fullname,
      password: 'hashedPassword',
    });

    expect(result).toHaveProperty('user');
    expect(result.user).toMatchObject({
      username: input.username,
      email: input.email,
      fullname: input.fullname,
    });
  });

  it('should throw error if user already exists', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue({ id: 'existingUserId' });

    await expect(signup(null, { signup: input })).rejects.toThrow('Phone or email already in use');
  });
});
