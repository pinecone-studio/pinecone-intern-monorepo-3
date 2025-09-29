import mongoose, { Document, Schema, Model } from 'mongoose';
import { 
  IPost, 
  CreatePostInput, 
  UpdatePostInput,
  UpdatePostStatusInput,
  PropertyStatus,
  Currency,
  LocalizedContent 
} from '../types';

// Interface for Post document methods
export interface IPostDocument extends Document {
  owner: string;
  title: LocalizedContent;
  description: LocalizedContent;
  price: number;
  currency: Currency;
  propertyFeature: string;
  status: PropertyStatus;
  featured: boolean;
  viewCount: number;
  favoriteCount: number;
  tags?: string[];
  availableFrom: Date;
  availableUntil?: Date;
  contactInfo?: {
    showPhone: boolean;
    showEmail: boolean;
    preferredContactTime?: string;
  };
  seoMetadata?: {
    metaTitle?: LocalizedContent;
    metaDescription?: LocalizedContent;
    keywords?: string[];
  };
  statusHistory: Array<{
    status: PropertyStatus;
    changedBy: string;
    changedAt: Date;
    note?: string;
  }>;
  adminNotes: Array<{
    admin: string;
    note: string;
    createdAt: Date;
  }>;
  analytics: {
    impressions: number;
    clicks: number;
    inquiries: number;
    shares: number;
  };
  slug?: string;
  socialImage?: string;
  publishedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Methods
  calculatePricePerSqM(): Promise<number>;
  incrementViewCount(): Promise<void>;
  incrementFavoriteCount(): Promise<void>;
  decrementFavoriteCount(): Promise<void>;
  isExpired(): boolean;
  isAvailable(): boolean;
  canBeEditedBy(userId: string): boolean;
  generateSEOMetadata(): void;
  toPublicJSON(): Partial<IPost>;
  approvePost(adminId: string, note?: string): Promise<void>;
  declinePost(adminId: string, note?: string): Promise<void>;
}

// Interface for Post static methods
export interface IPostModel extends Model<IPostDocument> {
  findByOwner(ownerId: string, status?: PropertyStatus): Promise<IPostDocument[]>;
  findByStatus(status: PropertyStatus): Promise<IPostDocument[]>;
  findFeaturedPosts(limit?: number): Promise<IPostDocument[]>;
  findRecentPosts(limit?: number): Promise<IPostDocument[]>;
  findExpiredPosts(): Promise<IPostDocument[]>;
  searchPosts(filters: any): Promise<IPostDocument[]>;
  getPostStats(): Promise<{
    total: number;
    byStatus: Record<PropertyStatus, number>;
    featured: number;
    expired: number;
    averagePrice: number;
    priceRange: { min: number; max: number };
  }>;
  createPost(input: CreatePostInput, ownerId: string): Promise<IPostDocument>;
  updatePost(id: string, input: UpdatePostInput): Promise<IPostDocument | null>;
  updatePostStatus(id: string, input: UpdatePostStatusInput, adminId?: string): Promise<IPostDocument | null>;
  deletePost(id: string): Promise<boolean>;
}

// Localized Content sub-schema
const LocalizedContentSchema = new Schema<LocalizedContent>({
  en: { 
    type: String, 
    required: [true, 'English content is required'],
    trim: true 
  },
  mn: { 
    type: String, 
    required: [true, 'Mongolian content is required'],
    trim: true 
  }
}, { _id: false });

// Post Schema
const PostSchema = new Schema<IPostDocument>({
  owner: {
    type: String,
    ref: 'User',
    required: [true, 'Owner is required']
  },
  title: {
    type: LocalizedContentSchema,
    required: [true, 'Title is required'],
    validate: {
      validator: function(v: LocalizedContent) {
        return v.en.length <= 200 && v.mn.length <= 200;
      },
      message: 'Title cannot be longer than 200 characters'
    }
  },
  description: {
    type: LocalizedContentSchema,
    required: [true, 'Description is required'],
    validate: {
      validator: function(v: LocalizedContent) {
        return v.en.length <= 5000 && v.mn.length <= 5000;
      },
      message: 'Description cannot be longer than 5000 characters'
    }
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    max: [999999999, 'Price seems unrealistic']
  },
  currency: {
    type: String,
    enum: {
      values: Object.values(Currency),
      message: '{VALUE} is not a valid currency'
    },
    default: Currency.MNT
  },
  propertyFeature: {
    type: String,
    ref: 'PropertyFeature',
    required: [true, 'Property feature is required']
  },
  status: {
    type: String,
    enum: {
      values: Object.values(PropertyStatus),
      message: '{VALUE} is not a valid status'
    },
    default: PropertyStatus.PENDING
  },
  featured: {
    type: Boolean,
    default: false
  },
  viewCount: {
    type: Number,
    default: 0,
    min: [0, 'View count cannot be negative']
  },
  favoriteCount: {
    type: Number,
    default: 0,
    min: [0, 'Favorite count cannot be negative']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [30, 'Tag cannot be longer than 30 characters']
  }],
  availableFrom: {
    type: Date,
    default: Date.now,
    validate: {
      validator: function(v: Date) {
        return v >= new Date(Date.now() - 24 * 60 * 60 * 1000); // Not more than 1 day ago
      },
      message: 'Available from date cannot be too far in the past'
    }
  },
  availableUntil: {
    type: Date,
    validate: {
      validator: function(this: IPostDocument, v: Date) {
        return !v || v > this.availableFrom;
      },
      message: 'Available until date must be after available from date'
    }
  },
  contactInfo: {
    showPhone: { type: Boolean, default: true },
    showEmail: { type: Boolean, default: true },
    preferredContactTime: {
      type: String,
      enum: {
        values: ['morning', 'afternoon', 'evening', 'anytime'],
        message: '{VALUE} is not a valid contact time'
      },
      default: 'anytime'
    }
  },
  seoMetadata: {
    metaTitle: LocalizedContentSchema,
    metaDescription: LocalizedContentSchema,
    keywords: [{
      type: String,
      trim: true,
      lowercase: true
    }]
  },
  // Status management
  statusHistory: [{
    status: {
      type: String,
      enum: Object.values(PropertyStatus),
      required: true
    },
    changedBy: {
      type: String,
      ref: 'User',
      required: true
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    note: String
  }],
  adminNotes: [{
    admin: {
      type: String,
      ref: 'User',
      required: true
    },
    note: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Analytics
  analytics: {
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    inquiries: { type: Number, default: 0 },
    shares: { type: Number, default: 0 }
  },
  // SEO and social media
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  socialImage: String,
  // Dates
  publishedAt: Date,
  expiresAt: {
    type: Date,
    validate: {
      validator: function(this: IPostDocument, v: Date) {
        return !v || v > new Date();
      },
      message: 'Expiry date must be in the future'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for performance optimization
PostSchema.index({ owner: 1 });
PostSchema.index({ status: 1 });
PostSchema.index({ featured: 1 });
PostSchema.index({ price: 1 });
PostSchema.index({ currency: 1 });
PostSchema.index({ createdAt: -1 });
PostSchema.index({ publishedAt: -1 });
PostSchema.index({ expiresAt: 1 });
PostSchema.index({ viewCount: -1 });
PostSchema.index({ favoriteCount: -1 });
PostSchema.index({ tags: 1 });
PostSchema.index({ slug: 1 });
PostSchema.index({ availableFrom: 1, availableUntil: 1 });

// Compound indexes
PostSchema.index({ status: 1, featured: 1, createdAt: -1 });
PostSchema.index({ status: 1, price: 1 });
PostSchema.index({ owner: 1, status: 1 });

// Text search index
PostSchema.index({
  'title.en': 'text',
  'title.mn': 'text',
  'description.en': 'text',
  'description.mn': 'text',
  tags: 'text'
});

// Virtual for price per square meter (requires populated propertyFeature)
PostSchema.virtual('pricePerSqM').get(function() {
  const doc = this as IPostDocument;
  if (doc.populated('propertyFeature') && (doc.propertyFeature as any)?.size) {
    return doc.price / (doc.propertyFeature as any).size;
  }
  return null;
});

// Virtual for post age in days
PostSchema.virtual('ageInDays').get(function() {
  const doc = this as IPostDocument;
  return Math.floor((Date.now() - doc.createdAt.getTime()) / (24 * 60 * 60 * 1000));
});

// Virtual for days until expiry
PostSchema.virtual('daysUntilExpiry').get(function() {
  const doc = this as IPostDocument;
  if (!doc.expiresAt) return null;
  return Math.floor((doc.expiresAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
});

// Virtual for engagement rate
PostSchema.virtual('engagementRate').get(function() {
  const doc = this as IPostDocument;
  if (doc.viewCount === 0) return 0;
  return ((doc.favoriteCount + doc.analytics.inquiries) / doc.viewCount) * 100;
});

// Pre-save middleware: Update updatedAt
PostSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Pre-save middleware: Generate slug
PostSchema.pre('save', async function(next) {
  const doc = this as IPostDocument;
  if (doc.isNew || doc.isModified('title')) {
    const baseSlug = doc.title.en
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 50);
    
    let slug = baseSlug;
    let counter = 1;
    
    while (await (doc.constructor as IPostModel).findOne({ slug, _id: { $ne: doc._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    doc.slug = slug;
  }
  next();
});

// Pre-save middleware: Set published date
PostSchema.pre('save', function(next) {
  const doc = this as IPostDocument;
  if (doc.isModified('status') && doc.status === PropertyStatus.APPROVED && !doc.publishedAt) {
    doc.publishedAt = new Date();
  }
  next();
});

// Pre-save middleware: Add status history
PostSchema.pre('save', function(next) {
  const doc = this as IPostDocument;
  if (doc.isModified('status')) {
    doc.statusHistory.push({
      status: doc.status,
      changedBy: doc.owner, // This should be set by the controller
      changedAt: new Date()
    });
  }
  next();
});

// Pre-save middleware: Generate SEO metadata
PostSchema.pre('save', function(next) {
  const doc = this as IPostDocument;
  if (doc.isNew || doc.isModified('title') || doc.isModified('description')) {
    doc.generateSEOMetadata();
  }
  next();
});

// Instance Methods
PostSchema.methods.calculatePricePerSqM = async function(): Promise<number> {
  await this.populate('propertyFeature');
  if (this.propertyFeature && (this.propertyFeature as any).size) {
    return this.price / (this.propertyFeature as any).size;
  }
  throw new Error('Property feature not found or size not specified');
};

PostSchema.methods.incrementViewCount = async function(): Promise<void> {
  this.viewCount += 1;
  this.analytics.impressions += 1;
  await this.save();
};

PostSchema.methods.incrementFavoriteCount = async function(): Promise<void> {
  this.favoriteCount += 1;
  await this.save();
};

PostSchema.methods.decrementFavoriteCount = async function(): Promise<void> {
  if (this.favoriteCount > 0) {
    this.favoriteCount -= 1;
    await this.save();
  }
};

PostSchema.methods.isExpired = function(): boolean {
  return !!(this.expiresAt && this.expiresAt < new Date());
};

PostSchema.methods.isAvailable = function(): boolean {
  const now = new Date();
  const afterAvailableFrom = this.availableFrom <= now;
  const beforeAvailableUntil = !this.availableUntil || this.availableUntil >= now;
  const notExpired = !this.isExpired();
  const isApproved = this.status === PropertyStatus.APPROVED;
  
  return afterAvailableFrom && beforeAvailableUntil && notExpired && isApproved;
};

PostSchema.methods.canBeEditedBy = function(userId: string): boolean {
  return this.owner.toString() === userId && this.status === PropertyStatus.PENDING;
};

PostSchema.methods.generateSEOMetadata = function(): void {
  if (!this.seoMetadata) {
    this.seoMetadata = {
      metaTitle: { en: '', mn: '' },
      metaDescription: { en: '', mn: '' },
      keywords: []
    };
  }
  
  // Generate meta title (limit to 60 characters)
  this.seoMetadata.metaTitle = {
    en: this.title.en.slice(0, 60),
    mn: this.title.mn.slice(0, 60)
  };
  
  // Generate meta description (limit to 160 characters)
  this.seoMetadata.metaDescription = {
    en: this.description.en.slice(0, 160),
    mn: this.description.mn.slice(0, 160)
  };
  
  // Generate keywords from title and tags
  const titleWords = this.title.en.toLowerCase().split(/\s+/).filter((word: string) => word.length > 2);
  const keywords = [...new Set([...titleWords, ...this.tags])];
  this.seoMetadata.keywords = keywords.slice(0, 10);
};

PostSchema.methods.toPublicJSON = function(): Partial<IPost> {
  const postObject = this.toObject();
  delete (postObject as any).adminNotes;
  delete (postObject as any).statusHistory;
  return postObject;
};

PostSchema.methods.approvePost = async function(adminId: string, note?: string): Promise<void> {
  this.status = PropertyStatus.APPROVED;
  this.publishedAt = new Date();
  
  if (note) {
    this.adminNotes.push({
      admin: adminId,
      note,
      createdAt: new Date()
    });
  }
  
  this.statusHistory.push({
    status: PropertyStatus.APPROVED,
    changedBy: adminId,
    changedAt: new Date(),
    note
  });
  
  await this.save();
};

PostSchema.methods.declinePost = async function(adminId: string, note?: string): Promise<void> {
  this.status = PropertyStatus.DECLINED;
  
  if (note) {
    this.adminNotes.push({
      admin: adminId,
      note,
      createdAt: new Date()
    });
  }
  
  this.statusHistory.push({
    status: PropertyStatus.DECLINED,
    changedBy: adminId,
    changedAt: new Date(),
    note
  });
  
  await this.save();
};

// Static Methods
PostSchema.statics.findByOwner = async function(
  ownerId: string, 
  status?: PropertyStatus
): Promise<IPostDocument[]> {
  const query: any = { owner: ownerId };
  if (status) query.status = status;
  
  return this.find(query)
    .populate('propertyFeature')
    .sort({ createdAt: -1 });
};

PostSchema.statics.findByStatus = async function(status: PropertyStatus): Promise<IPostDocument[]> {
  return this.find({ status })
    .populate('owner', 'firstName lastName email phone')
    .populate('propertyFeature')
    .sort({ createdAt: -1 });
};

PostSchema.statics.findFeaturedPosts = async function(limit: number = 10): Promise<IPostDocument[]> {
  return this.find({ 
    status: PropertyStatus.APPROVED, 
    featured: true 
  })
    .populate('owner', 'firstName lastName avatar')
    .populate('propertyFeature')
    .sort({ createdAt: -1 })
    .limit(limit);
};

PostSchema.statics.findRecentPosts = async function(limit: number = 20): Promise<IPostDocument[]> {
  return this.find({ 
    status: PropertyStatus.APPROVED,
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } }
    ]
  })
    .populate('owner', 'firstName lastName avatar')
    .populate('propertyFeature')
    .sort({ publishedAt: -1 })
    .limit(limit);
};

PostSchema.statics.findExpiredPosts = async function(): Promise<IPostDocument[]> {
  return this.find({
    expiresAt: { $lt: new Date() },
    status: { $ne: PropertyStatus.EXPIRED }
  });
};

PostSchema.statics.searchPosts = async function(filters: any): Promise<IPostDocument[]> {
  const query: any = { status: PropertyStatus.APPROVED };
  
  // Text search
  if (filters.searchTerm) {
    query.$text = { $search: filters.searchTerm };
  }
  
  // Price range
  if (filters.priceMin || filters.priceMax) {
    query.price = {};
    if (filters.priceMin) query.price.$gte = filters.priceMin;
    if (filters.priceMax) query.price.$lte = filters.priceMax;
  }
  
  // Currency
  if (filters.currency) {
    query.currency = filters.currency;
  }
  
  // Tags
  if (filters.tags && filters.tags.length > 0) {
    query.tags = { $in: filters.tags };
  }
  
  // Date range
  if (filters.availableFrom) {
    query.availableFrom = { $lte: filters.availableFrom };
  }
  if (filters.availableUntil) {
    query.availableUntil = { $gte: filters.availableUntil };
  }
  
  // Featured only
  if (filters.featuredOnly) {
    query.featured = true;
  }
  
  // Sorting
  let sort: any = { publishedAt: -1 };
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'price_asc':
        sort = { price: 1 };
        break;
      case 'price_desc':
        sort = { price: -1 };
        break;
      case 'newest':
        sort = { publishedAt: -1 };
        break;
      case 'oldest':
        sort = { publishedAt: 1 };
        break;
      case 'most_viewed':
        sort = { viewCount: -1 };
        break;
      case 'most_liked':
        sort = { favoriteCount: -1 };
        break;
    }
  }
  
  return this.find(query)
    .populate('owner', 'firstName lastName avatar')
    .populate('propertyFeature')
    .sort(sort)
    .limit(filters.limit || 50);
};

PostSchema.statics.getPostStats = async function() {
  const [totalResult, statusResults, featuredResult, expiredResult, priceStats] = await Promise.all([
    this.countDocuments(),
    this.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]),
    this.countDocuments({ featured: true }),
    this.countDocuments({ expiresAt: { $lt: new Date() } }),
    this.aggregate([
      {
        $group: {
          _id: null,
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ])
  ]);

  const byStatus = statusResults.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {} as Record<PropertyStatus, number>);

  // Initialize missing statuses with 0
  Object.values(PropertyStatus).forEach(status => {
    if (!(status in byStatus)) {
      byStatus[status] = 0;
    }
  });

  const priceData = priceStats[0] || { avgPrice: 0, minPrice: 0, maxPrice: 0 };

  return {
    total: totalResult,
    byStatus,
    featured: featuredResult,
    expired: expiredResult,
    averagePrice: Math.round(priceData.avgPrice || 0),
    priceRange: {
      min: priceData.minPrice || 0,
      max: priceData.maxPrice || 0
    }
  };
};

PostSchema.statics.createPost = async function(
  input: CreatePostInput,
  ownerId: string
): Promise<IPostDocument> {
  const post = new this({
    ...input,
    owner: ownerId
  });
  return post.save();
};

PostSchema.statics.updatePost = async function(
  id: string,
  input: UpdatePostInput
): Promise<IPostDocument | null> {
  return this.findByIdAndUpdate(id, input, { 
    new: true, 
    runValidators: true 
  }).populate('propertyFeature');
};

PostSchema.statics.updatePostStatus = async function(
  id: string,
  input: UpdatePostStatusInput,
  adminId?: string
): Promise<IPostDocument | null> {
  const post = await this.findById(id);
  if (!post) return null;
  
  if (input.status === PropertyStatus.APPROVED && adminId) {
    await post.approvePost(adminId, input.adminNote);
  } else if (input.status === PropertyStatus.DECLINED && adminId) {
    await post.declinePost(adminId, input.adminNote);
  } else {
    post.status = input.status;
    await post.save();
  }
  
  return post.populate('propertyFeature');
};

PostSchema.statics.deletePost = async function(id: string): Promise<boolean> {
  const result = await this.findByIdAndDelete(id);
  return !!result;
};

// Create and export model
export const Post = mongoose.model<IPostDocument, IPostModel>('Post', PostSchema);

// Export convenience functions
export const createPost = (input: CreatePostInput, ownerId: string) => Post.createPost(input, ownerId);
export const findPostById = (id: string) => Post.findById(id).populate('owner propertyFeature');
export const findPostsByOwner = (ownerId: string, status?: PropertyStatus) => Post.findByOwner(ownerId, status);
export const findPostsByStatus = (status: PropertyStatus) => Post.findByStatus(status);
export const findApprovedPosts = (limit?: number) => Post.findRecentPosts(limit);
export const findFeaturedPosts = (limit?: number) => Post.findFeaturedPosts(limit);
export const findPendingPosts = () => Post.findByStatus(PropertyStatus.PENDING);
export const updatePost = (id: string, input: UpdatePostInput) => Post.updatePost(id, input);
export const updatePostStatus = (id: string, input: UpdatePostStatusInput, adminId?: string) => 
  Post.updatePostStatus(id, input, adminId);
export const deletePost = (id: string) => Post.deletePost(id);
export const searchPosts = (filters: any) => Post.searchPosts(filters);
export const getPostStats = () => Post.getPostStats();