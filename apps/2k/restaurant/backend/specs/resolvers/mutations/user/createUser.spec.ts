/* eslint-disable @nx/enforce-module-boundaries, @typescript-eslint/ban-ts-comment */
import { createUser } from 'apps/2k/restaurant/backend/src/resolvers/mutations/user/create-user';
import { UserModel } from '../../../../src/models/user.model';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// Mocks
jest.mock('../../../../src/models/user.model');
jest.mock('bcryptjs');

describe('createUser resolver', () => {
  const mockInput = {
    email: 'test@example.com',
    password: 'password123',
    username: 'testuser',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if user already exists', async () => {
    // mock existing user
    (UserModel.findOne as jest.Mock).mockResolvedValue({ email: mockInput.email });

    await expect(createUser({}, { input: mockInput })).rejects.toThrow('User already registered please log in');

    expect(UserModel.findOne).toHaveBeenCalledWith({ email: mockInput.email });
  });

  it('should create a new user if email does not exist', async () => {
    // mock when no user exists
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);

    // mock bcrypt hashing
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword123');

    // mock timestamps
    const mockCreatedAt = new Date();
    const mockUpdatedAt = new Date();

    // mock new user returned from Mongoose create()
    const mockNewUser = {
      _id: new mongoose.Types.ObjectId(),
      email: mockInput.email,
      password: 'hashedPassword123',
      username: mockInput.username,
      role: 'USER',
      bonusPoints: 0,
      profile: undefined,
      phoneNumber: undefined,
      createdAt: mockCreatedAt,
      updatedAt: mockUpdatedAt,
      toObject() {
        return this;
      },
    };

    (UserModel.create as jest.Mock).mockResolvedValue(mockNewUser);

    const result = await createUser({}, { input: mockInput });

    // Assertions
    expect(UserModel.findOne).toHaveBeenCalledWith({ email: mockInput.email });
    expect(bcrypt.hash).toHaveBeenCalledWith(mockInput.password, 10);
    expect(UserModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: mockInput.email,
        password: 'hashedPassword123',
        username: mockInput.username,
        role: 'USER',
        bonusPoints: 0,
      })
    );

    expect(result).toEqual({
      userId: mockNewUser._id.toString(),
      email: mockInput.email,
      username: mockInput.username,
      profile: undefined,
      bonusPoints: 0,
      role: 'USER',
      phoneNumber: undefined,
      createdAt: mockCreatedAt.toISOString(),
      updatedAt: mockUpdatedAt.toISOString(),
    });
  });
});
