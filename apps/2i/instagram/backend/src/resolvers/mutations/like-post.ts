import { PostModel, UserModel } from '../../models';

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

  const populatedPost = await PostModel.findById(postId).populate('user').populate('likes').populate('comments');

  return {
    id: populatedPost!._id.toString(),
    user: populatedPost!.user,
    images: populatedPost!.images,
    caption: populatedPost!.caption,
    likes: populatedPost!.likes,
    comments: populatedPost!.comments,
    createdAt: populatedPost!.createdAt.toISOString(),
  };
};

export const unlikePost = async (_: unknown, { postId }: { postId: string }, { user }: { user: any }) => {
  if (!user) {
    throw new Error('Authentication required');
  }

  const post = await PostModel.findById(postId);
  if (!post) {
    throw new Error('Post not found');
  }

  post.likes = post.likes.filter((likeId: any) => !likeId.equals(user.id));
  await post.save();

  const populatedPost = await PostModel.findById(postId).populate('user').populate('likes').populate('comments');

  return {
    id: populatedPost!._id.toString(),
    user: populatedPost!.user,
    images: populatedPost!.images,
    caption: populatedPost!.caption,
    likes: populatedPost!.likes,
    comments: populatedPost!.comments,
    createdAt: populatedPost!.createdAt.toISOString(),
  };
};
