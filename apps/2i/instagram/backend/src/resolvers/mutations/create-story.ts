import mongoose from "mongoose";
import { StoryModel } from "../../models/storymodel";
import { UserModel } from "../../models";

const findUserById = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};


const createNewStory = async (userId: string, mediaUrl: string) => {
  const now = new Date();
  const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const story = await StoryModel.create({
    user: new mongoose.Types.ObjectId(userId),
    mediaUrl,
    createdAt: now,
    expiresAt: expires,
    viewers: [],
  });
  return story;
};


export const createStory = async (
  _: unknown,
  { input }: { input: { mediaUrl: string } },
  context: { user: { id: string } }
) => {
  try {
   
    if (!context?.user?.id) {
      throw new Error("User not authenticated");
    }

    const user = await findUserById(context.user.id);

    const story = await createNewStory(context.user.id, input.mediaUrl); 

   
    return {
      ...story.toObject(),
      id: story._id.toString(),
      user: {
        ...user.toObject(),
        id: user._id.toString(),
      },
      viewers: [],
    };
  } catch (err: unknown) { 
    throw new Error("Failed to create story");
  }
};
