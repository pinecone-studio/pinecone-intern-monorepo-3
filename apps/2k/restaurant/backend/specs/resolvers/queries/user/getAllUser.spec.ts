/* eslint-disable @nx/enforce-module-boundaries, @typescript-eslint/ban-ts-comment */
import { getUsers } from 'apps/2k/restaurant/backend/src/resolvers/queries/user/get-all-users';
import { UserModel } from '../../../../src/models/user.model';
import mongoose from 'mongoose';

jest.mock('../../../../src/models/user.model');

describe('getUsers resolver', () => {
  const now = new Date();
  const mockUsers = [
    {
      _id: new mongoose.Types.ObjectId(),
      userId: 'user1',
      username: 'Alice',
      email: 'alice@example.com',
      password: 'secret1',
      createdAt: now,
      updatedAt: now,
      toObject: jest.fn().mockReturnValue({
        _id: 'user1id',
        userId: 'user1',
        username: 'Alice',
        email: 'alice@example.com',
        password: 'secret1',
        createdAt: now,
        updatedAt: now,
      }),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      userId: 'user2',
      username: 'Bob',
      email: 'bob@example.com',
      password: 'secret2',
      createdAt: now,
      updatedAt: now,
      toObject: jest.fn().mockReturnValue({
        _id: 'user2id',
        userId: 'user2',
        username: 'Bob',
        email: 'bob@example.com',
        password: 'secret2',
        createdAt: now,
        updatedAt: now,
      }),
    },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns all users', async () => {
    // @ts-ignore
    UserModel.find.mockResolvedValue(mockUsers);

    const result = await getUsers({});

    expect(result).toHaveLength(2);
    expect(result[0].userId).toBe('user1');
    expect(result[1].username).toBe('Bob');
  });

  it('throws error if no users found', async () => {
    // @ts-ignore
    UserModel.find.mockResolvedValue([]);

    await expect(getUsers({})).rejects.toThrow('Users not found');
  });
});
