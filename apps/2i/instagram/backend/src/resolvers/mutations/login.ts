import { UserModel } from '../../models';
import bcrypt from 'bcryptjs';

type LoginInput = {
  email: string;
  password: string;
};

export const login = async (_: unknown, { login }: { login: LoginInput }) => {
  const { email, password } = login;

  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  return {
    user,
  };
};
