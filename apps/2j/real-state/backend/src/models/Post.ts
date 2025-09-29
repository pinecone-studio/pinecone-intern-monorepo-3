import mongoose, { Document, Schema } from 'mongoose';
import { IPost, CreatePostInput, PropertyStatus } from '../types';

export interface IPostDocument extends IPost, Document {}

const PostSchema = new Schema<IPostDocument>({
  propertyOwnerId: {
    type: String,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  propertyDetail: {
    type: String,
    required: true,
    ref: 'PropertyFeature',
  },
  status: {
    type: String,
    enum: Object.values(PropertyStatus),
    default: PropertyStatus.PENDING,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Update updatedAt before saving
PostSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Indexes for better query performance
PostSchema.index({ status: 1 });
PostSchema.index({ propertyOwnerId: 1 });
PostSchema.index({ price: 1 });
PostSchema.index({ createdAt: -1 });

export const Post = mongoose.model<IPostDocument>('Post', PostSchema);

// Static methods
export const createPost = async (input: CreatePostInput): Promise<IPostDocument> => {
  const post = new Post(input);
  return post.save();
};

export const findPostById = async (id: string): Promise<IPostDocument | null> => {
  return Post.findById(id).populate('propertyOwnerId', 'email name phone').populate('propertyDetail');
};

export const findPostsByOwner = async (propertyOwnerId: string): Promise<IPostDocument[]> => {
  return Post.find({ propertyOwnerId }).populate('propertyDetail');
};

export const findApprovedPosts = async (limit: number = 10, skip: number = 0): Promise<IPostDocument[]> => {
  return Post.find({ status: PropertyStatus.APPROVED })
    .populate('propertyOwnerId', 'email name phone')
    .populate('propertyDetail')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

export const findPendingPosts = async (): Promise<IPostDocument[]> => {
  return Post.find({ status: PropertyStatus.PENDING })
    .populate('propertyOwnerId', 'email name phone')
    .populate('propertyDetail');
};

export const updatePostStatus = async (id: string, status: PropertyStatus): Promise<IPostDocument | null> => {
  return Post.findByIdAndUpdate(id, { status }, { new: true })
    .populate('propertyOwnerId', 'email name phone')
    .populate('propertyDetail');
};
