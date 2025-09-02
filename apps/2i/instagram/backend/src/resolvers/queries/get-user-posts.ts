import mongoose from 'mongoose';
import { PostModel } from '../../models/postmodel';

export const getUserPosts = async (_: unknown, { userId }: { userId: string }) => {
  try {
    const posts = await PostModel.find({ user: new mongoose.Types.ObjectId(userId) })
      .populate('user')
      .populate('likes')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'id username fullname profilePicture',
        },
      })
      .sort({ createdAt: -1 });

    return posts;
  } catch (error) {
    console.error('Error getting user posts:', error);
    throw new Error('Failed to get user posts');
  }
};
