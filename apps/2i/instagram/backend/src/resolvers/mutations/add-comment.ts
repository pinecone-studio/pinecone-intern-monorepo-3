import mongoose from 'mongoose';
import { CommentModel } from '../../models/commentmodel';
import { PostModel } from '../../models/postmodel';
import { UserModel } from '../../models';
import { Context } from '../../types';

type AddCommentInput = {
  postId: string;
  content: string;
};

export const addComment = async (_: unknown, { input }: { input: AddCommentInput }, context: Context) => {
  try {
    if (!context.user?.id) {
      throw new Error('Authentication required');
    }

    const { postId, content } = input;

    if (!content || content.trim() === '') {
      throw new Error('Comment content is required');
    }

    const post = await PostModel.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    const comment = await CommentModel.create({
      user: new mongoose.Types.ObjectId(context.user.id),
      post: new mongoose.Types.ObjectId(postId),
      content: content.trim(),
      createdAt: new Date(),
    });

    // Add comment to post
    post.comments.push(comment._id);
    post.updatedAt = new Date();
    await post.save();

    // Populate user data
    const populatedComment = await CommentModel.findById(comment._id).populate('user').populate('post');

    return populatedComment;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw new Error('Failed to add comment');
  }
};
