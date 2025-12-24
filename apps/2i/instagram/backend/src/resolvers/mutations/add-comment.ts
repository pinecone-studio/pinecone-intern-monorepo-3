import { PostModel } from '../../models/postmodel';
import { CommentModel } from '../../models/commentmodel';
import { UserModel } from '../../models';

export const addComment = async (_: unknown, { postId, text }: { postId: string; text: string }, { user }: { user: any }) => {
  if (!user) {
    throw new Error('Authentication required');
  }

  const post = await PostModel.findById(postId);
  if (!post) {
    throw new Error('Post not found');
  }

  const comment = await CommentModel.create({
    user: user.id,
    post: postId,
    text,
  });

  post.comments.push(comment._id);
  await post.save();

  const populatedComment = await CommentModel.findById(comment._id).populate('user');

  return {
    id: populatedComment._id.toString(),
    user: populatedComment.user,
    text: populatedComment.text,
    createdAt: populatedComment.createdAt.toISOString(),
  };
};
