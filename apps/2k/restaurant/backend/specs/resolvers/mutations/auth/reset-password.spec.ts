import bcrypt from 'bcryptjs';
import { UserModel } from '../../../../src/models/user.model';
import { resetPassword } from '../../../../src/resolvers/mutations/auth/reset-password';

// Mock MongoDB болон bcrypt
jest.mock('../../../../src/models/user.model');
jest.mock('bcryptjs');

describe('resetPassword resolver', () => {
  const mockSave = jest.fn();

  const mockUser = {
    _id: '123',
    email: 'test@example.com',
    password: 'oldpassword',
    save: mockSave,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should reset password successfully', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);

    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');

    const input = { email: 'test@example.com', newPassword: 'newpass123' };

    const result = await resetPassword(null, { input });

    expect(UserModel.findOne).toHaveBeenCalledWith({ email: input.email });
    expect(bcrypt.hash).toHaveBeenCalledWith(input.newPassword, 10);
    expect(mockSave).toHaveBeenCalled();
    expect(mockUser.password).toBe('hashedpassword');

    expect(result).toEqual({
      success: true,
      message: 'Password has been successfully reset',
    });
  });

  it('should throw error if user does not exist', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);

    const input = { email: 'nonexistent@example.com', newPassword: 'pass123' };

    await expect(resetPassword(null, { input })).rejects.toThrow('User with this email does not exist');

    expect(UserModel.findOne).toHaveBeenCalledWith({ email: input.email });
  });
});
