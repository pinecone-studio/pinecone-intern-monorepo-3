import { GetUserInput } from '../../../generated';
import { UserModel } from '../../../models/user.model';

export const getUser = async (_: unknown, { input }: { input: GetUserInput }) => {
  const user = await UserModel.findById(input.userId);

  if (!user) {
    throw new Error(`User with id ${input.userId} not found`);
  }

  const { password, ...userObj } = user.toObject();

  return {
    ...userObj,
    userId: userObj.userId || userObj._id.toString(),
    createdAt: userObj.createdAt?.toISOString?.(),
    updatedAt: userObj.updatedAt?.toISOString?.(),
  };
};
