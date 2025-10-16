import { PostModel, UserModel } from '../../models';

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

  const populatedPost = await PostModel.findById(post._id).populate('user').populate('likes').populate('comments');

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
