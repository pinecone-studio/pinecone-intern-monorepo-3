import mongoose from "mongoose";
import { StoryModel } from "../../models/storymodel";


export const createStory = async (
  _:unknown,
  { input }: { input: { mediaUrl: string } },
  context: { user: { id: string } }
) => {
  const now = new Date();
  const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000); 

  const story = await StoryModel.create({
    user: new mongoose.Types.ObjectId(context.user.id),
    mediaUrl: input.mediaUrl,
    createdAt: now,
    expiresAt: expires,
    viewers: [],
  });

  return story;
};


export const markStorySeen = async (
  _: unknown,
  { storyId }: { storyId: string },
  context: { user: { id: string } }
) => {
  const story = await StoryModel.findById(storyId);
  if (!story) throw new Error("Story not found");

  const viewerId = new mongoose.Types.ObjectId(context.user.id);
  const alreadySeen = story.viewers.some(
    (viewer) => viewer.toString() === viewerId.toString()
  );

  if (!alreadySeen) {
    story.viewers.push(viewerId);
    await story.save();
  }

  return story;
};

