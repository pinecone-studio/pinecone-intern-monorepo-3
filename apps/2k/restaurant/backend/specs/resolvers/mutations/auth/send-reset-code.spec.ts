import { sendResetCode } from '../../../../src/resolvers/mutations/auth/send-reset-code';
import { UserModel } from '../../../../src/models/user.model';

// Mongoose mock
jest.mock('../../../../src/models/user.model');

describe('sendResetCode resolver', () => {
  const mockSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if email not found', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);

    await expect(sendResetCode(null, { input: { email: 'notfound@example.com' } })).rejects.toThrow('Email not found');
  });

  it('should generate a 6-digit code, save user, and return success message', async () => {
    const mockUser = {
      email: 'test@example.com',
      resetCode: undefined as string | undefined,
      save: mockSave,
    };

    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);

    jest.spyOn(global.Math, 'random').mockReturnValue(0.23456);

    const result = await sendResetCode(null, { input: { email: 'test@example.com' } });

    expect(mockUser.resetCode).toBeDefined();
    if (mockUser.resetCode) {
      expect(mockUser.resetCode.length).toBe(6);
    }

    expect(mockSave).toHaveBeenCalled();

    expect(result).toEqual({
      success: true,
      message: expect.stringContaining('Reset code sent (DEV):'),
    });

    jest.spyOn(global.Math, 'random').mockRestore();
  });
});
