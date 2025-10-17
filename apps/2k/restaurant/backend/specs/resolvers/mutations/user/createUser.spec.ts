/* eslint-disable @nx/enforce-module-boundaries, @typescript-eslint/ban-ts-comment */
import { UserModel } from '../../../../src/models/user.model';
import { createUser } from 'apps/2k/restaurant/backend/src/resolvers/mutations/user/create-user';
import bcrypt from 'bcryptjs';

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
    (UserModel.findOne as jest.Mock).mockResolvedValue({ email: 'test@example.com' });

    await expect(createUser({}, { input: mockInput })).rejects.toThrow('User already registered please log in');
    expect(UserModel.findOne).toHaveBeenCalledWith({ email: mockInput.email });
  });

  it('should create a new user if email does not exist', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword123');
    const mockCreatedAt = new Date();
    const mockUpdatedAt = new Date();
    const mockUserObject = {
      userId: 'mocked-id',
      email: mockInput.email,
      password: 'hashedPassword123',
      username: mockInput.username,
      role: 'USER',
      bonusPoints: 0,
      createdAt: mockCreatedAt,
      updatedAt: mockUpdatedAt,
      toObject: function () {
        return this;
      },
    };

    (UserModel.create as jest.Mock).mockResolvedValue(mockUserObject);

    const result = await createUser({}, { input: mockInput });

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
      ...mockUserObject,
      userId: mockUserObject.userId,
      createdAt: mockCreatedAt.toISOString(),
      updatedAt: mockUpdatedAt.toISOString(),
    });
  });
});
