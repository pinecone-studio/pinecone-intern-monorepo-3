import { Types } from "mongoose";
import { UserModel } from "../../models";

const checkAuthentication = (context: { user?: { id?: string } }) => {
  if (!context.user || !context.user.id) {
    throw new Error("Authentication required");
  }
  return context.user.id;
};

const getUserById = async (id: string) => {
  const user = await UserModel.findById(id);
  if (!user) throw new Error("User not found");
  return user;
};

const addFollowRequest = async (targetUser: any, currentUserId: Types.ObjectId) => {
  if (targetUser.followRequests.includes(currentUserId)) {
    throw new Error("Follow request already sent");
  }
  targetUser.followRequests.push(currentUserId);
  await targetUser.save();
  return { message: "Follow request sent" };
};

const addFollower = async (targetUser: any, currentUser: any) => {
  if (!targetUser.followers.includes(currentUser._id)) {
    targetUser.followers.push(currentUser._id);
  }
  if (!currentUser.following.includes(targetUser._id)) {
    currentUser.following.push(targetUser._id);
  }
  await targetUser.save();
  await currentUser.save();
  return { message: "User followed successfully", user: targetUser };
};

export const sendFollowRequest = async (_: unknown, { userId }: { userId: string }, context: { user?: { id: string } }) => {
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


const removeFollowRequest = (user: any, userId: string) => {
  const index = user.followRequests.findIndex((id: Types.ObjectId) => id.toString() === userId);
  if (index === -1) {
    throw new Error("No follow request from this user");
  }
  user.followRequests.splice(index, 1);
};

const acceptFollowRequest = async (currentUser: any, requestingUserId: string) => {
  const requestingUser = await getUserById(requestingUserId);
  
  if (!currentUser.followers.includes(requestingUser._id)) {
    currentUser.followers.push(requestingUser._id);
  }
  if (!requestingUser.following.includes(currentUser._id)) {
    requestingUser.following.push(currentUser._id);
  }

  await requestingUser.save();
};

export const respondFollowRequest = async (_: unknown, { userId, accept }: { userId: string; accept: boolean }, context: { user?: { id: string } }) => {
  const currentUserId = checkAuthentication(context);
  const currentUser = await getUserById(currentUserId);

  removeFollowRequest(currentUser, userId);

  if (accept) {
    await acceptFollowRequest(currentUser, userId);
  }

  await currentUser.save();

  return { message: accept ? "Follow request accepted" : "Follow request declined", user: currentUser };
};


export const unfollowUser = async (_: unknown, { userId }: { userId: string }, context: { user?: { id: string } }) => {
  const currentUserId = checkAuthentication(context);

  if (userId === currentUserId) throw new Error("You cannot unfollow yourself");

  const currentUser = await getUserById(currentUserId);
  const targetUser = await getUserById(userId);

  currentUser.following = currentUser.following.filter((id: Types.ObjectId) => id.toString() !== userId);
  targetUser.followers = targetUser.followers.filter((id: Types.ObjectId) => id.toString() !== currentUserId);

  await currentUser.save();
  await targetUser.save();

  return { message: "User unfollowed successfully", user: targetUser };
};
