import { UserModel } from '../../../models/user.model';
import { VerifyResetCodeInput } from '../../../generated';

export const verifyResetCode = async (_: unknown, { input }: { input: VerifyResetCodeInput }) => {
  const { email, code } = input;

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new Error('User with this email does not exist');
  }

  if (user.resetCode !== code) {
    throw new Error('Invalid or expired reset code');
  }

  user.resetCode = null;
  await user.save();

  return {
    success: true,
    message: 'Reset code verified successfully',
  };
};
