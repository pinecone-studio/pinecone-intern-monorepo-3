import bcrypt from 'bcryptjs';
import { UserModel } from '../../../models/user.model';
import { CreateUserInput } from '../../../generated';
import mongoose from 'mongoose';

export const createUser = async (_: unknown, { input }: { input: CreateUserInput }) => {
  const userExisting = await UserModel.findOne({ email: input.email });
  if (userExisting) {
    throw new Error('User already registered please log in');
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);

  const newUser = await UserModel.create({
    userId: new mongoose.Types.ObjectId().toString(),
    email: input.email,
    password: hashedPassword,
    username: input.username,
    role: 'USER',
    bonusPoints: 0,
  });

  const user = newUser.toObject();

  return {
    userId: newUser._id.toString(),
    email: newUser.email,
    username: newUser.username,
    profile: newUser.profile,
    bonusPoints: newUser.bonusPoints,
    role: newUser.role,
    phoneNumber: newUser.phoneNumber,
    createdAt: newUser.createdAt.toISOString(),
    updatedAt: newUser.updatedAt.toISOString(),
  };
};
