
import { resolvers } from '../../../src/resolvers';
import { UserModel } from '../../../src/models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../../../src/models', () => ({
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

describe('Login Mutation', () => {
  const input = {
    email: 'test@example.com',
    password: 'password123',
  };

  const fakeUser = {
    id: 'user123',
    email: input.email,
    username: 'tester',
    fullname: 'Test User',
    password: 'hashedpassword',
  };

  it('should return token and user on valid login', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(fakeUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('valid.token.here');

    const result = await resolvers.Mutation.login(null, { login: input });

    expect(result.user).toMatchObject({
      email: input.email,
      username: fakeUser.username,
      fullname: fakeUser.fullname,
    });
  });

  it('should throw error if email not found', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      resolvers.Mutation.login(null, { login: input })
    ).rejects.toThrow('Invalid email or password');
  });

  it('should throw error if password is incorrect', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(fakeUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      resolvers.Mutation.login(null, { login: input })
    ).rejects.toThrow('Invalid email or password');
  });
});
