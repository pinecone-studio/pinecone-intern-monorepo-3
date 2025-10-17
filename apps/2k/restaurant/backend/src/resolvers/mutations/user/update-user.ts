import { User, UserModel } from '../../../models/user.model';
import { UpdateUserInput } from '../../../generated';

export const updateUser = async (_: unknown, { userId, input }: { userId: string; input: UpdateUserInput }): Promise<User> => {
  const user = await UserModel.findById(userId);
  if (!user) throw new Error('User not found');

  Object.assign(user, input);
  await user.save();

  return {
    ...user.toObject(),
    userId: user._id.toString(),
  };
};
