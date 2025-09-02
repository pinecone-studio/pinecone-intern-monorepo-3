import { PostModel } from '../../models/postmodel';

export const getPosts = async () => {
  try {
    const posts = await PostModel.find()
      .populate('user')
      .populate('likes')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'id username fullname profilePicture',
        },
      })
      .sort({ createdAt: -1 })
      .limit(50);

    // Transform posts to ensure proper format
    const transformedPosts = posts.map((post) => ({
      ...post.toObject(),
      id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }));

    return transformedPosts;
  } catch (error) {
    console.error('Error getting posts:', error);
    throw new Error('Failed to get posts');
  }
};
