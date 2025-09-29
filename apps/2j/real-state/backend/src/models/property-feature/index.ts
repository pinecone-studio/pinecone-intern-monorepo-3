import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { PropertyType } from '../../types';
import { IPropertyFeatureDocument, IPropertyFeatureModel } from './interfaces';
import { 
  AddressSchema, 
  PropertyDetailsSchema, 
  PetPolicySchema, 
  UtilitiesSchema, 
  NearbyFacilitiesSchema, 
  LocalizedContentSchema 
} from './schemas';
import { propertyFeatureMethods } from './methods';
import { propertyFeatureStatics } from './statics';

// Main PropertyFeature schema
const PropertyFeatureSchema = new Schema<IPropertyFeatureDocument>({
  owner: {
    type: String,
    ref: 'User',
    required: [true, 'Property owner is required']
  },
  images: [{
    type: String,
    required: [true, 'At least one image is required'],
    validate: {
      validator: function(images: string[]) {
        return images.length > 0;
      },
      message: 'At least one image is required'
    }
  }],
  virtualTour: {
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Virtual tour must be a valid URL'
    }
  },
  videos: [{
    type: String,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+\.(mp4|webm|ogg)$/i.test(v);
      },
      message: 'Video must be a valid URL with mp4, webm, or ogg extension'
    }
  }],
  type: {
    type: String,
    enum: Object.values(PropertyType),
    required: [true, 'Property type is required']
  },
  size: {
    type: Number,
    required: [true, 'Property size is required'],
    min: [1, 'Property size must be positive']
  },
  totalRooms: {
    type: Number,
    required: [true, 'Total rooms is required'],
    min: [1, 'Total rooms must be at least 1']
  },
  bedrooms: {
    type: Number,
    required: [true, 'Bedrooms count is required'],
    min: [0, 'Bedrooms cannot be negative']
  },
  bathrooms: {
    type: Number,
    required: [true, 'Bathrooms count is required'],
    min: [0, 'Bathrooms cannot be negative']
  },
  livingRooms: {
    type: Number,
    min: [0, 'Living rooms cannot be negative']
  },
  kitchens: {
    type: Number,
    min: [0, 'Kitchens cannot be negative']
  },
  garage: {
    type: Boolean,
    default: false
  },
  garageSpaces: {
    type: Number,
    min: [0, 'Garage spaces cannot be negative']
  },
  location: {
    type: AddressSchema,
    required: [true, 'Location is required']
  },
  details: {
    type: PropertyDetailsSchema,
    required: [true, 'Property details are required']
  },
  amenities: [{
    type: String,
    trim: true
  }],
  nearbyFacilities: NearbyFacilitiesSchema,
  energyRating: {
    type: String,
    enum: ['A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'],
    uppercase: true
  },
  condition: {
    type: String,
    enum: ['new', 'excellent', 'good', 'fair', 'poor'],
    default: 'good'
  },
  ownership: {
    type: String,
    enum: ['freehold', 'leasehold', 'shared'],
    default: 'freehold'
  },
  furnished: {
    type: Boolean,
    default: false
  },
  petPolicy: PetPolicySchema,
  utilities: UtilitiesSchema,
  rules: LocalizedContentSchema,
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
  inquiryCount: {
    type: Number,
    default: 0,
    min: 0
  },
  slug: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add indexes
PropertyFeatureSchema.index({ owner: 1 });
PropertyFeatureSchema.index({ type: 1 });
PropertyFeatureSchema.index({ 'location.city': 1 });
PropertyFeatureSchema.index({ 'location.district': 1 });
PropertyFeatureSchema.index({ 'details.size': 1 });
PropertyFeatureSchema.index({ 'details.condition': 1 });
PropertyFeatureSchema.index({ 'details.ownership': 1 });
PropertyFeatureSchema.index({ amenities: 1 });
PropertyFeatureSchema.index({ viewCount: -1 });
PropertyFeatureSchema.index({ favoriteCount: -1 });
PropertyFeatureSchema.index({ slug: 1 });

// Add virtuals
PropertyFeatureSchema.virtual('isAvailable').get(function(this: IPropertyFeatureDocument) {
  return this.details.condition !== 'poor' && this.validateImages();
});

PropertyFeatureSchema.virtual('summary').get(function(this: IPropertyFeatureDocument) {
  return this.getSummary();
});

// Add methods
PropertyFeatureSchema.methods = propertyFeatureMethods;

// Add statics
PropertyFeatureSchema.statics = propertyFeatureStatics;

// Pre-save middleware
PropertyFeatureSchema.pre('save', function(this: IPropertyFeatureDocument) {
  if (this.isModified('type') || this.isModified('location')) {
    this.slug = `${this.type}-${this.location.city}-${this.location.district}-${this._id}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
});

// Create and export model
export const PropertyFeature = mongoose.model<IPropertyFeatureDocument, IPropertyFeatureModel>('PropertyFeature', PropertyFeatureSchema);

// Export convenience functions
export const createPropertyFeature = propertyFeatureStatics.createPropertyFeature.bind(PropertyFeature);
export const findPropertyFeatureById = propertyFeatureStatics.findPropertyById.bind(PropertyFeature);
export const findPropertyFeaturesByOwner = propertyFeatureStatics.findByOwner.bind(PropertyFeature);
export const findPropertyFeaturesByType = propertyFeatureStatics.findByType.bind(PropertyFeature);
export const findPropertyFeaturesByLocation = propertyFeatureStatics.findByLocation.bind(PropertyFeature);
export const findPropertyFeaturesBySizeRange = propertyFeatureStatics.findBySizeRange.bind(PropertyFeature);
export const searchPropertyFeatures = propertyFeatureStatics.searchProperties.bind(PropertyFeature);
export const getPropertyFeatureStats = propertyFeatureStatics.getPropertyStats.bind(PropertyFeature);
export const updatePropertyFeature = propertyFeatureStatics.updatePropertyFeature.bind(PropertyFeature);
export const deletePropertyFeature = propertyFeatureStatics.deletePropertyFeature.bind(PropertyFeature);

// Export types
export * from './interfaces';
