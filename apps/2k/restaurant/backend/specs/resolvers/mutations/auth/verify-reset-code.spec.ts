import { verifyResetCode } from '../../../../src/resolvers/mutations/auth/verify-reset-code';
import { UserModel } from '../../../../src/models/user.model';

jest.mock('../../../../src/models/user.model');

describe('verifyResetCode resolver', () => {
  const mockSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if user with email does not exist', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);

    await expect(verifyResetCode(null, { input: { email: 'notfound@example.com', code: '123456' } })).rejects.toThrow('User with this email does not exist');
  });

  it('should throw an error if reset code is invalid', async () => {
    const mockUser = {
      email: 'test@example.com',
      resetCode: '999999',
      save: mockSave,
    };

    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);

    await expect(verifyResetCode(null, { input: { email: 'test@example.com', code: '123456' } })).rejects.toThrow('Invalid or expired reset code');
  });

  it('should verify code successfully, clear resetCode, and save user', async () => {
    const mockUser = {
      email: 'test@example.com',
      resetCode: '123456',
      save: mockSave,
    };

    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);

    const result = await verifyResetCode(null, {
      input: { email: 'test@example.com', code: '123456' },
    });

    expect(mockUser.resetCode).toBeNull();

    expect(mockSave).toHaveBeenCalled();

    expect(result).toEqual({
      success: true,
      message: 'Reset code verified successfully',
    });
  });
});
