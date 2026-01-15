import { PostModel } from '../../models';

export const getPosts = async () => {
  const posts = await PostModel.find().populate('user').populate('likes').populate('comments').sort({ createdAt: -1 });

  return posts.map((post) => ({
    id: post._id.toString(),
    user: post.user,
    images: post.images,
    caption: post.caption,
    likes: post.likes,
    comments: post.comments,
    createdAt: post.createdAt.toISOString(),
  }));
};

export const getPost = async (_: unknown, { postId }: { postId: string }) => {
  const post = await PostModel.findById(postId).populate('user').populate('likes').populate('comments');

  if (!post) {
    throw new Error('Post not found');
  }

  return {
    id: post._id.toString(),
    user: post.user,
    images: post.images,
    caption: post.caption,
    likes: post.likes,
    comments: post.comments,
    createdAt: post.createdAt.toISOString(),
  };
};
