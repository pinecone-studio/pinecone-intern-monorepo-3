import { UserModel } from '../../models';
import { convertPopulatedUser, IPopulatedUser, IUser, IUserResponse } from './followers';

export const addFollower = async (targetUser: IUser, currentUser: IUser): Promise<IUserResponse> => {
  if (!targetUser.followers.some((id) => id.equals(currentUser._id))) {
    targetUser.followers.push(currentUser._id);
  }
  if (!currentUser.following.some((id) => id.equals(targetUser._id))) {
    currentUser.following.push(targetUser._id);
  }
  await targetUser.save();
  await currentUser.save();
  const populatedTargetUser = (await UserModel.findById(targetUser._id).populate('followers').populate('following').populate('followRequests').lean()) as unknown as IPopulatedUser;
  if (!populatedTargetUser) {
    throw new Error('Target user not found');
  }

  return {
    message: 'User followed successfully',
    user: convertPopulatedUser(populatedTargetUser),
    token: '',
  };
};
