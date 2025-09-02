import mongoose from 'mongoose';
import { PostModel } from '../../models/postmodel';
import { UserModel } from '../../models';
import { Context } from '../../types';

export const likePost = async (_: unknown, { postId }: { postId: string }, context: Context) => {
  try {
    if (!context.user?.id) {
      throw new Error('Authentication required');
    }

    const post = await PostModel.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    const userId = new mongoose.Types.ObjectId(context.user.id);
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      // Unlike
      post.likes = post.likes.filter((id: mongoose.Types.ObjectId) => !id.equals(userId));
    } else {
      // Like
      post.likes.push(userId);
    }

    post.updatedAt = new Date();
    await post.save();

    // Populate user data
    const populatedPost = await PostModel.findById(post._id).populate('user').populate('likes');

    return populatedPost;
  } catch (error) {
    console.error('Error liking post:', error);
    throw new Error('Failed to like post');
  }
};
