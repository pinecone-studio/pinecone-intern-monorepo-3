import { Document, Model } from 'mongoose';
import { 
  IPost, 
  CreatePostInput, 
  UpdatePostInput,
  UpdatePostStatusInput,
  PropertyStatus,
  Currency,
  LocalizedContent 
} from '../../types';

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
  canBeEditedBy(_userId: string): boolean;
  generateSEOMetadata(): void;
  toPublicJSON(): Partial<IPost>;
  approvePost(_adminId: string, _note?: string): Promise<void>;
  declinePost(_adminId: string, _note?: string): Promise<void>;
}

// Interface for Post static methods
export interface IPostModel extends Model<IPostDocument> {
  findByOwner(_ownerId: string, _status?: PropertyStatus): Promise<IPostDocument[]>;
  findByStatus(_status: PropertyStatus): Promise<IPostDocument[]>;
  findFeaturedPosts(_limit?: number): Promise<IPostDocument[]>;
  findRecentPosts(_limit?: number): Promise<IPostDocument[]>;
  findExpiredPosts(): Promise<IPostDocument[]>;
  searchPosts(_filters: PostSearchFilters): Promise<IPostDocument[]>;
  getPostStats(): Promise<PostStats>;
  createPost(_input: CreatePostInput, _ownerId: string): Promise<IPostDocument>;
  updatePost(_id: string, _input: UpdatePostInput): Promise<IPostDocument | null>;
  updatePostStatus(_id: string, _input: UpdatePostStatusInput, _adminId?: string): Promise<IPostDocument | null>;
  deletePost(_id: string): Promise<boolean>;
}

// Type definitions for better type safety
export interface PostSearchFilters {
  status?: PropertyStatus;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: {
    city?: string;
    district?: string;
  };
  features?: string[];
  tags?: string[];
  featured?: boolean;
  availableFrom?: Date;
  availableUntil?: Date;
}

export interface PostStats {
  total: number;
  byStatus: Record<PropertyStatus, number>;
  featured: number;
  expired: number;
  averagePrice: number;
  priceRange: { min: number; max: number };
}

export interface PostAnalytics {
  impressions: number;
  clicks: number;
  inquiries: number;
  shares: number;
}

export interface PostContactInfo {
  showPhone: boolean;
  showEmail: boolean;
  preferredContactTime?: string;
}

export interface PostSEOMetadata {
  metaTitle?: LocalizedContent;
  metaDescription?: LocalizedContent;
  keywords?: string[];
}

export interface PostStatusHistoryItem {
  status: PropertyStatus;
  changedBy: string;
  changedAt: Date;
  note?: string;
}

export interface PostAdminNote {
  admin: string;
  note: string;
  createdAt: Date;
}
