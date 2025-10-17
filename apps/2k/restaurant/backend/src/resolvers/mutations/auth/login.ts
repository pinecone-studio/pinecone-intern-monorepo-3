import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../../../models/user.model';
import { LoginInput } from '../../../generated';

const JWT_SECRET = process.env.JWT_TOKEN || 'secret_key';

export const userLogin = async (_: unknown, { input }: { input: LoginInput }) => {
  const user = await UserModel.findOne({ email: input.email });
  if (!user) {
    throw new Error('Email or password incorrect, please check again');
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.password);
  if (!isPasswordValid) {
    throw new Error('Email or password incorrect, please check again');
  }

  const token = jwt.sign({ userId: user._id.toString(), email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

  const userObj = user.toObject();
  delete userObj.password;

  return {
    token,
    user: {
      ...userObj,
      userId: userObj._id.toString(),
      createdAt: userObj.createdAt?.toISOString(),
      updatedAt: userObj.updatedAt?.toISOString(),
    },
  };
};
