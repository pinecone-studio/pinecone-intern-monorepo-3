import mongoose from 'mongoose';
import { PostModel } from '../../models/postmodel';
import { UserModel } from '../../models';
import { Context } from '../../types';

type CreatePostInput = {
  images: string[];
  caption?: string;
};

export const createPost = async (_: unknown, { input }: { input: CreatePostInput }, context: Context) => {
  try {
    const { images, caption } = input;

    if (!images || images.length === 0) {
      throw new Error('At least one image is required');
    }

    // For demo purposes, create a mock user if no authentication
    if (!context.user?.id) {
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        username: 'demo_user',
        fullname: 'Demo User',
        profilePicture: '',
        email: 'demo@test.com',
        bio: 'Demo user for testing',
        isActive: true,
        isPrivate: false,
        followers: [],
        following: [],
        followRequests: [],
      };

      // Create post with mock user data
      const post = await PostModel.create({
        user: mockUser._id,
        images,
        caption: caption || '',
        likes: [],
        comments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Return post with mock user data
      return {
        ...post.toObject(),
        id: post._id.toString(),
        user: mockUser,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
      };
    }

    // If user is authenticated, use their ID
    const post = await PostModel.create({
      user: new mongoose.Types.ObjectId(context.user.id),
      images,
      caption: caption || '',
      likes: [],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Populate user data
    const populatedPost = await PostModel.findById(post._id).populate('user');

    return populatedPost;
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error('Failed to create post');
  }
};
