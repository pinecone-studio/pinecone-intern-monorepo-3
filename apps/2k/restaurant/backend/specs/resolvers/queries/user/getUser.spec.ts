// src/resolvers/queries/user/getUser.test.ts
/* eslint-disable @nx/enforce-module-boundaries, @typescript-eslint/ban-ts-comment */
import { getUser } from 'apps/2k/restaurant/backend/src/resolvers/queries';
import { UserModel } from '../../../../src/models/user.model';
import mongoose from 'mongoose';

jest.mock('../../../../src/models/user.model');

describe('getUser resolver', () => {
  const mockUserId = new mongoose.Types.ObjectId().toString();

  const mockUserDoc = {
    _id: mockUserId,
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedpassword',
    createdAt: new Date(),
    updatedAt: new Date(),
    toObject: jest.fn().mockReturnValue({
      _id: mockUserId,
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword',
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return user data without password when found', async () => {
    // @ts-ignore
    UserModel.findById.mockResolvedValue(mockUserDoc);

    const result = await getUser({}, { input: { userId: mockUserId } });

    expect(result).toHaveProperty('userId', mockUserId);
    expect(result).toHaveProperty('username', 'testuser');
    expect(result).toHaveProperty('email', 'test@example.com');
    expect(result).not.toHaveProperty('password');
    expect(result).toHaveProperty('createdAt');
    expect(result).toHaveProperty('updatedAt');
  });

  it('should throw error if user not found', async () => {
    // @ts-ignore
    UserModel.findById.mockResolvedValue(null);

    await expect(getUser({}, { input: { userId: mockUserId } })).rejects.toThrow(`User with id ${mockUserId} not found`);
  });

  it('should handle undefined createdAt and updatedAt', async () => {
    const mockDoc = {
      _id: mockUserId,
      username: 'noDates',
      email: 'nodates@example.com',
      password: 'secret',
      toObject: jest.fn().mockReturnValue({
        _id: mockUserId,
        username: 'noDates',
        email: 'nodates@example.com',
        password: 'secret',
        createdAt: undefined,
        updatedAt: undefined,
      }),
    };
    // @ts-ignore
    UserModel.findById.mockResolvedValue(mockDoc);

    const result = await getUser({}, { input: { userId: mockUserId } });

    expect(result).toHaveProperty('userId', mockUserId);
    expect(result.createdAt).toBeUndefined();
    expect(result.updatedAt).toBeUndefined();
    expect(result).not.toHaveProperty('password');
  });
});
