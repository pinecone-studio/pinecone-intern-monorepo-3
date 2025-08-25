import { Types } from "mongoose";
import { UserModel } from "../../models";
export  interface IUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  isPrivate: boolean;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  followRequests: Types.ObjectId[];
  save: () => Promise<IUser>;
}
export  interface IPopulatedUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  isPrivate: boolean;
  followers: IUser[];
  following: IUser[];
  followRequests: IUser[];
}
export interface IUserResponse {
  message: string;
  user?: Omit<IPopulatedUser, '_id'> & { id: string };
  token: string;
}
export const checkAuthentication = (context: { user?: { id?: string } }): string => {
  if (!context.user || !context.user.id) {
    throw new Error("Authentication required");
  }
  return context.user.id;
};
export const getUserById = async (id: string): Promise<IUser> => {
  const user = await UserModel.findById(id);
  if (!user) throw new Error("User not found");
  return user;
};
export const convertPopulatedUser = (user: IPopulatedUser) => ({
   ...user, id: user._id.toString(),
  followers: user.followers?.map((f) => ({ ...f, id: f._id.toString() })) || [],
  following: user.following?.map((f) => ({ ...f, id: f._id.toString() })) || [],
  followRequests: user.followRequests?.map((f) => ({ ...f, id: f._id.toString() })) || [],
});
export const addFollowRequest = async (targetUser: IUser, currentUserId: Types.ObjectId): Promise<IUserResponse> => {
  if (targetUser.followRequests.some((id) => id.equals(currentUserId))) {
    throw new Error("Follow request already sent");
  }
  targetUser.followRequests.push(currentUserId);
  await targetUser.save();
  const populatedTargetUser = await UserModel.findById(targetUser._id)
    .populate("followers")
    .populate("following")
    .populate("followRequests")
    .lean() as unknown as IPopulatedUser;
  if (!populatedTargetUser) throw new Error("Target user not found");
  return {
    message: "Follow request sent",
    user: convertPopulatedUser(populatedTargetUser),
    token: "",
  };
};
export const addFollower = async (targetUser: IUser, currentUser: IUser): Promise<IUserResponse> => {
  if (!targetUser.followers.some((id) => id.equals(currentUser._id))) {
    targetUser.followers.push(currentUser._id);
  }
  if (!currentUser.following.some((id) => id.equals(targetUser._id))) {
    currentUser.following.push(targetUser._id);
  } await targetUser.save();
  await currentUser.save();
  const populatedTargetUser = await UserModel.findById(targetUser._id)
    .populate("followers")
    .populate("following")
    .populate("followRequests")
    .lean() as unknown as IPopulatedUser;
  if (!populatedTargetUser) {
    throw new Error("Target user not found");
  }
  return {
    message: "User followed successfully",
    user: convertPopulatedUser(populatedTargetUser),
    token: "",
  };
};
export const sendFollowRequest = async (
  _: unknown,
  { userId }: { userId: string },
  context: { user?: { id: string } }
): Promise<IUserResponse> => {
  const currentUserId = checkAuthentication(context);
  if (userId === currentUserId) throw new Error("You cannot follow yourself");
  const targetUser = await getUserById(userId);
  const currentUser = await getUserById(currentUserId);
  if (targetUser.isPrivate) {
    return await addFollowRequest(targetUser, currentUser._id);
  } else {
    return await addFollower(targetUser, currentUser);
  }
};
export const removeFollowRequest = (user: IUser, userId: string): void => {
  const index = user.followRequests.findIndex((id) => id.toString() === userId);
  if (index === -1) {
    throw new Error("No follow request from this user");
  }  user.followRequests.splice(index, 1);
};
export const acceptFollowRequest = async (currentUser: IUser, requestingUserId: string): Promise<void> => {
  const requestingUser = await getUserById(requestingUserId);
  if (!currentUser.followers.some((id) => id.equals(requestingUser._id))) {
    currentUser.followers.push(requestingUser._id);
  }
  if (!requestingUser.following.some((id) => id.equals(currentUser._id))) {
    requestingUser.following.push(currentUser._id);
  }  await requestingUser.save();
};
export const respondFollowRequest = async (
  _: unknown,{ userId, accept }: { userId: string; accept: boolean },context: { user?: { id: string } }
): Promise<IUserResponse> => {
  const currentUserId = checkAuthentication(context);
  const currentUser = await getUserById(currentUserId);
  removeFollowRequest(currentUser, userId);
  if (accept) {
    await acceptFollowRequest(currentUser, userId);
  }
  await currentUser.save();
  return {
    message: accept ? "Follow request accepted" : "Follow request declined",
    user: convertPopulatedUser(await UserModel.findById(currentUser._id)
      .populate("followers")
      .populate("following")
      .populate("followRequests")
      .lean() as unknown as IPopulatedUser),
    token: "",
  };
};
export const unfollowUser = async (
  _: unknown,
  { userId }: { userId: string },
  context: { user?: { id: string } }
): Promise<IUserResponse> => {
  const currentUserId = checkAuthentication(context);
  if (userId === currentUserId) throw new Error("You cannot unfollow yourself");
  await Promise.all([
    UserModel.findByIdAndUpdate(currentUserId, { $pull: { following: userId } }),
    UserModel.findByIdAndUpdate(userId, { $pull: { followers: currentUserId } }),
  ]);
  const populatedTargetUser = await UserModel.findById(userId)
    .populate("followers")
    .populate("following")
    .populate("followRequests")
    .lean() as unknown as IPopulatedUser;
  if (!populatedTargetUser) throw new Error("Target user not found");
  return {
    message: "User unfollowed successfully",
    user: {
      ...convertPopulatedUser(populatedTargetUser),
    },
    token: "",
  };
};


