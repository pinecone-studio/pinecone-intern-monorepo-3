import { PostModel } from '../../models/postmodel';

export const getPosts = async () => {
  const posts = await PostModel.find()
    .populate('user')
    .populate('likes')
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        model: 'User',
      },
    })
    .sort({ createdAt: -1 });

  return posts.map((post) => ({
    id: post._id.toString(),
    user: post.user
      ? {
          id: post.user._id.toString(),
          username: post.user.username,
          fullname: post.user.fullname,
          profilePicture: post.user.profilePicture,
        }
      : {
          id: 'unknown',
          username: 'unknown',
          fullname: 'Unknown User',
          profilePicture: null,
        },
    images: post.images,
    caption: post.caption,
    likes: post.likes
      ? post.likes.map((like: any) => ({
          id: like._id.toString(),
          username: like.username,
        }))
      : [],
    comments: post.comments
      ? post.comments.map((comment: any) => ({
          id: comment._id.toString(),
          user: comment.user
            ? {
                id: comment.user._id.toString(),
                username: comment.user.username,
              }
            : {
                id: 'unknown',
                username: 'unknown',
              },
          text: comment.text,
          createdAt: comment.createdAt.toISOString(),
        }))
      : [],
    createdAt: post.createdAt.toISOString(),
  }));
};

export const getPost = async (_: unknown, { postId }: { postId: string }) => {
  const post = await PostModel.findById(postId)
    .populate('user')
    .populate('likes')
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        model: 'User',
      },
    });

  if (!post) {
    throw new Error('Post not found');
  }

  return {
    id: post._id.toString(),
    user: post.user
      ? {
          id: post.user._id.toString(),
          username: post.user.username,
          fullname: post.user.fullname,
          profilePicture: post.user.profilePicture,
        }
      : {
          id: 'unknown',
          username: 'unknown',
          fullname: 'Unknown User',
          profilePicture: null,
        },
    images: post.images,
    caption: post.caption,
    likes: post.likes
      ? post.likes.map((like: any) => ({
          id: like._id.toString(),
          username: like.username,
        }))
      : [],
    comments: post.comments
      ? post.comments.map((comment: any) => ({
          id: comment._id.toString(),
          user: comment.user
            ? {
                id: comment.user._id.toString(),
                username: comment.user.username,
              }
            : {
                id: 'unknown',
                username: 'unknown',
              },
          text: comment.text,
          createdAt: comment.createdAt.toISOString(),
        }))
      : [],
    createdAt: post.createdAt.toISOString(),
  };
};
