import { Schema } from 'mongoose';
import { LocalizedContent, Currency, PropertyStatus } from '../../types';
import { 
  PostContactInfo, 
  PostSEOMetadata, 
  PostStatusHistoryItem, 
  PostAdminNote, 
  PostAnalytics 
} from './interfaces';

// Localized Content sub-schema
export const LocalizedContentSchema = new Schema<LocalizedContent>({
  en: { 
    type: String, 
    trim: true,
    required: [true, 'English content is required']
  },
  mn: { 
    type: String, 
    trim: true,
    required: [true, 'Mongolian content is required']
  }
}, { _id: false });

// Contact Info sub-schema
export const ContactInfoSchema = new Schema<PostContactInfo>({
  showPhone: { 
    type: Boolean, 
    default: true 
  },
  showEmail: { 
    type: Boolean, 
    default: true 
  },
  preferredContactTime: { 
    type: String, 
    trim: true 
  }
}, { _id: false });

// SEO Metadata sub-schema
export const SEOMetadataSchema = new Schema<PostSEOMetadata>({
  metaTitle: LocalizedContentSchema,
  metaDescription: LocalizedContentSchema,
  keywords: [{ 
    type: String, 
    trim: true 
  }]
}, { _id: false });

// Status History sub-schema
export const StatusHistorySchema = new Schema<PostStatusHistoryItem>({
  status: { 
    type: String, 
    enum: Object.values(PropertyStatus),
    required: true 
  },
  changedBy: { 
    type: String, 
    required: true 
  },
  changedAt: { 
    type: Date, 
    default: Date.now 
  },
  note: { 
    type: String, 
    trim: true 
  }
}, { _id: false });

// Admin Notes sub-schema
export const AdminNotesSchema = new Schema<PostAdminNote>({
  admin: { 
    type: String, 
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
}, { _id: false });

// Analytics sub-schema
export const AnalyticsSchema = new Schema<PostAnalytics>({
  impressions: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  clicks: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  inquiries: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  shares: { 
    type: Number, 
    default: 0,
    min: 0 
  }
}, { _id: false });
