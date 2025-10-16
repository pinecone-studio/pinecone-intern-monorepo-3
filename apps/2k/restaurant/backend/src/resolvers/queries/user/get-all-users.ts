import { UserModel } from '../../../models/user.model';

export const getUsers = async (_: unknown) => {
  const users = await UserModel.find();

  if (!users.length) {
    throw new Error(`Users not found`);
  }

  return users;
};
