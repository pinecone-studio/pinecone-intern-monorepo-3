import { PostModel } from '../../models/postmodel';
import { UserModel } from '../../models';

type CreatePostInput = {
  images: string[];
  caption?: string;
};

export const createPost = async (_: unknown, { input }: { input: CreatePostInput }, { user }: { user: any }) => {
  if (!user) {
    throw new Error('Authentication required');
  }

  const { images, caption = '' } = input;

  const post = await PostModel.create({
    user: user.id,
    images,
    caption,
  });

  const populatedPost = await PostModel.findById(post._id)
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
