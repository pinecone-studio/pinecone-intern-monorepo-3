import { PostModel } from '../../models/postmodel';

export const likePost = async (_: unknown, { postId }: { postId: string }, { user }: { user: any }) => {
  if (!user) {
    throw new Error('Authentication required');
  }

  const post = await PostModel.findById(postId);
  if (!post) {
    throw new Error('Post not found');
  }

  if (!post.likes.includes(user.id)) {
    post.likes.push(user.id);
    await post.save();
  }

  const populatedPost = await PostModel.findById(postId)
    .populate('user')
    .populate('likes')
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        model: 'User',
      },
    });

  return {
    id: populatedPost._id.toString(),
    user: {
      id: populatedPost.user._id.toString(),
      username: populatedPost.user.username,
      fullname: populatedPost.user.fullname,
      profilePicture: populatedPost.user.profilePicture,
    },
    images: populatedPost.images,
    caption: populatedPost.caption,
    likes: populatedPost.likes.map((like: any) => ({
      id: like._id.toString(),
      username: like.username,
    })),
    comments: populatedPost.comments.map((comment: any) => ({
      id: comment._id.toString(),
      user: {
        id: comment.user._id.toString(),
        username: comment.user.username,
      },
      text: comment.text,
      createdAt: comment.createdAt.toISOString(),
    })),
    createdAt: populatedPost.createdAt.toISOString(),
  };
};
