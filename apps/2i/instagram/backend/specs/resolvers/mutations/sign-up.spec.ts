
import { resolvers } from '../../../src/resolvers';
import { UserModel } from '../../../src/models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../../../src/models', () => ({
  UserModel: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

describe('Signup Mutation', () => {
  const input = {
    email: 'mnhtulgaa550@gmail.com',
    username: 'tulgaa',
    fullname: 'munkh',
    password: 'qwerty23',
  };

  beforeEach(() => {
  jest.clearAllMocks();
  process.env.JWT_SECRET = 'supersecret'; 
});

  it('should return user and token on successful signup', async () => {
  
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);

    
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');

   
    (UserModel.create as jest.Mock).mockResolvedValue({
      id: '123456',
      email: input.email,
      username: input.username,
      fullname: input.fullname,
      password: 'hashedpassword',
    });


    (jwt.sign as jest.Mock).mockReturnValue('dummy.token.value');

    const result = await resolvers.Mutation.signup(null, { signup: input });

    expect(UserModel.findOne).toHaveBeenCalledWith({ email: input.email });
    expect(bcrypt.hash).toHaveBeenCalledWith(input.password, 10);
    expect(UserModel.create).toHaveBeenCalledWith({
      fullname: input.fullname,
      username: input.username,
      email: input.email,
      password: 'hashedpassword',
    });
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: '123456' },
      'supersecret',
      { expiresIn: '7d' }
    );

    expect(result).toHaveProperty('token', 'dummy.token.value');
    expect(result).toHaveProperty('user');
    expect(result.user).toMatchObject({
      id: '123456',
      email: input.email,
      username: input.username,
      fullname: input.fullname,
    });
  });

  it('should throw error if user already exists', async () => {

    (UserModel.findOne as jest.Mock).mockResolvedValue({ id: 'existingUser' });

    await expect(
      resolvers.Mutation.signup(null, { signup: input })
    ).rejects.toThrow('Phone or email already in use');
  });
});
