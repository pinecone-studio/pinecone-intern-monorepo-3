import { UserModel } from '../../models';

export const getuser = async (_: unknown, { id }: { id: string }) => {
  const user = await UserModel.findById(id);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};
