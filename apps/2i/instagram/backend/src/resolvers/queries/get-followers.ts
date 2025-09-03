import { UserModel } from '../../models';

export const followers = async (_: unknown, { id }: { id: string }) => {
  const user = await UserModel.findById(id);
  if (!user) {
    throw new Error('User not found');
  }

  const followerUsers = await UserModel.find({
    _id: { $in: user.followers },
  });

  return followerUsers;
};
