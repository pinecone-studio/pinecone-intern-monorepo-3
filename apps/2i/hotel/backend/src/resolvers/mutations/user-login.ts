import { UserModel } from '../../models/user-model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const userLogin = async (_: unknown, args: { email: string; password: string }) => {
  try {
    const userExisting = await UserModel.findOne({ email: args.email });
    if (!userExisting) {
      throw new Error('Email or password incorrect, please check again');
    }
    const isPasswordValid = await bcrypt.compare(args.password, userExisting.password);
    if (!isPasswordValid) {
      throw new Error('Email or password incorrect, please check again');
    }
    const tokenPassword = process.env.JWT_PASSWORD;
    const token = await jwt.sign({ userId: userExisting._id }, tokenPassword as string);

    return { message: 'Login successful', token };
  } catch (err) {
    throw new Error(`Server error ${err}`);
  }
};
