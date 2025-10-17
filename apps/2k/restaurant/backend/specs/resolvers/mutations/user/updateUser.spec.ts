/* eslint-disable @nx/enforce-module-boundaries, @typescript-eslint/ban-ts-comment */
import { UserModel } from '../../../../src/models/user.model';
import { updateUser } from 'apps/2k/restaurant/backend/src/resolvers/mutations';
import { UpdateUserInput } from 'apps/2k/restaurant/backend/src/generated';

jest.mock('../../../../src/models/user.model');

describe('updateUser resolver', () => {
  const mockSave = jest.fn();

  const mockUser = {
    _id: '123',
    email: 'old@example.com',
    password: 'oldpassword',
    username: 'olduser',
    profile: 'old profile',
    phoneNumber: '1234567890',
    save: mockSave,
    toObject: function () {
      return this;
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update a user successfully', async () => {
    (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);

    const args: { userId: string; input: UpdateUserInput } = {
      userId: '123',
      input: {
        email: 'new@example.com',
        password: 'newpassword',
        username: 'newuser',
        profile: 'new profile',
        phoneNumber: '0987654321',
      },
    };

    const result = await updateUser(null, args);

    expect(UserModel.findById).toHaveBeenCalledWith('123');
    expect(mockSave).toHaveBeenCalled();
    expect(result.email).toBe('new@example.com');
    expect(result.password).toBe('newpassword');
    expect(result.username).toBe('newuser');
    expect(result.profile).toBe('new profile');
    expect(result.phoneNumber).toBe('0987654321');
    expect(result._id).toBe('123');
  });

  it('should throw an error if user is not found', async () => {
    (UserModel.findById as jest.Mock).mockResolvedValue(null);

    const args: { userId: string; input: UpdateUserInput } = {
      userId: '999',
      input: {
        email: 'doesnotmatter@example.com',
        password: 'doesnotmatter',
        username: 'doesnotmatter',
        profile: '',
        phoneNumber: '0000000000',
      },
    };

    await expect(updateUser(null, args)).rejects.toThrow('User not found');
    expect(UserModel.findById).toHaveBeenCalledWith('999');
  });
});
