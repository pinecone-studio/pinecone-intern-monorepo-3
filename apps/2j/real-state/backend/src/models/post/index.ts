import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { PropertyStatus, Currency } from '../../types';
import { IPostDocument, IPostModel } from './interfaces';
import { 
  LocalizedContentSchema, 
  ContactInfoSchema, 
  SEOMetadataSchema, 
  StatusHistorySchema, 
  AdminNotesSchema, 
  AnalyticsSchema 
} from './schemas';
import { postMethods } from './methods';
import { postStatics } from './statics';

// Main Post schema
const PostSchema = new Schema<IPostDocument>({
  owner: {
    type: String,
    ref: 'User',
    required: [true, 'Post owner is required']
  },
  title: {
    type: LocalizedContentSchema,
    required: [true, 'Post title is required']
  },
  description: {
    type: LocalizedContentSchema,
    required: [true, 'Post description is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive']
  },
  currency: {
    type: String,
    enum: Object.values(Currency),
    default: Currency.MNT
  },
  propertyFeature: {
    type: String,
    ref: 'PropertyFeature',
    required: [true, 'Property feature is required']
  },
  status: {
    type: String,
    enum: Object.values(PropertyStatus),
    default: PropertyStatus.PENDING
  },
  featured: {
    type: Boolean,
    default: false
  },
  viewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  favoriteCount: {
    type: Number,
    default: 0,
    min: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  availableFrom: {
    type: Date,
    default: Date.now
  },
  availableUntil: {
    type: Date
  },
  contactInfo: ContactInfoSchema,
  seoMetadata: SEOMetadataSchema,
  statusHistory: [StatusHistorySchema],
  adminNotes: [AdminNotesSchema],
  analytics: {
    type: AnalyticsSchema,
    default: () => ({
      impressions: 0,
      clicks: 0,
      inquiries: 0,
      shares: 0
    })
  },
  slug: {
    type: String,
    unique: true,
    sparse: true
  },
  socialImage: {
    type: String
  },
  publishedAt: {
    type: Date
  },
  expiresAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add indexes
PostSchema.index({ owner: 1, status: 1 });
PostSchema.index({ status: 1, createdAt: -1 });
PostSchema.index({ featured: 1, status: 1 });
PostSchema.index({ price: 1 });
PostSchema.index({ 'propertyFeature.address.city': 1 });
PostSchema.index({ 'propertyFeature.address.district': 1 });
PostSchema.index({ tags: 1 });
PostSchema.index({ availableFrom: 1, availableUntil: 1 });
PostSchema.index({ slug: 1 });

// Add virtuals
PostSchema.virtual('isExpired').get(function(this: IPostDocument) {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
});

PostSchema.virtual('isAvailable').get(function(this: IPostDocument) {
  const now = new Date();
  return (
    this.status === 'approved' &&
    !this.isExpired &&
    (!this.availableFrom || now >= this.availableFrom) &&
    (!this.availableUntil || now <= this.availableUntil)
  );
});

// Add methods
PostSchema.methods = postMethods;

// Add statics
PostSchema.statics = postStatics;

// Pre-save middleware
PostSchema.pre('save', function(this: IPostDocument) {
  if (this.isModified('title') || this.isModified('description')) {
    this.generateSEOMetadata();
  }
  
  if (this.isModified('title')) {
    this.slug = this.title.en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
});

// Create and export model
export const Post = mongoose.model<IPostDocument, IPostModel>('Post', PostSchema);

// Export convenience functions
export const createPost = postStatics.createPost.bind(Post);
export const findPostById = (id: string) => Post.findById(id);
export const findPostsByOwner = postStatics.findByOwner.bind(Post);
export const findPostsByStatus = postStatics.findByStatus.bind(Post);
export const findApprovedPosts = () => Post.find({ status: 'approved' });
export const findFeaturedPosts = postStatics.findFeaturedPosts.bind(Post);
export const findPendingPosts = () => Post.find({ status: 'pending' });
export const updatePost = postStatics.updatePost.bind(Post);
export const updatePostStatus = postStatics.updatePostStatus.bind(Post);
export const deletePost = postStatics.deletePost.bind(Post);
export const searchPosts = postStatics.searchPosts.bind(Post);
export const getPostStats = postStatics.getPostStats.bind(Post);

// Export types
export * from './interfaces';
