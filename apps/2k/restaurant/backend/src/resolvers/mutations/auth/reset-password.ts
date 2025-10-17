import bcrypt from 'bcryptjs';
import { UserModel } from '../../../models/user.model';
import { ResetPasswordInput } from '../../../generated';

export const resetPassword = async (_: unknown, { input }: { input: ResetPasswordInput }) => {
  const user = await UserModel.findOne({ email: input.email });
  if (!user) {
    throw new Error('User with this email does not exist');
  }

  const hashedPassword = await bcrypt.hash(input.newPassword, 10);
  user.password = hashedPassword;

  await user.save();

  return {
    success: true,
    message: 'Password has been successfully reset',
  };
};
