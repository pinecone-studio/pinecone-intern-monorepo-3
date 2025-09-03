import { UserModel } from '../../models/user-model';
import bcrypt from 'bcryptjs';

export const userSignUp = async (_: unknown, args: { email: string; password: string }) => {
  try {
    const userExisting = await UserModel.findOne({ email: args.email });
    if (userExisting) {
      throw new Error('User already registered please log in');
    }

    const hashedPassword = await bcrypt.hash(args.password, 10);

    await UserModel.create({
      email: args.email,
      password: hashedPassword,
    });

    return { message: 'User successfully created' };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { message: `Something went wrong ${err}` };
    }
  }
};
