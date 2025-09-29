import mongoose, { Document, Schema, Model } from 'mongoose';
import validator from 'validator';
import { 
  IPropertyFeature, 
  CreatePropertyFeatureInput,
  PropertyType, 
  Address, 
  PropertyDetails,
  LocalizedContent 
} from '../types';

// Interface for PropertyFeature document methods
export interface IPropertyFeatureDocument extends Document {
  owner: string;
  images: string[];
  virtualTour?: string;
  videos?: string[];
  type: PropertyType;
  size: number;
  totalRooms: number;
  bedrooms: number;
  bathrooms: number;
  livingRooms?: number;
  kitchens?: number;
  garage: boolean;
  garageSpaces?: number;
  location: Address;
  details: PropertyDetails;
  amenities?: string[];
  nearbyFacilities?: {
    schools?: string[];
    hospitals?: string[];
    shopping?: string[];
    transport?: string[];
    parks?: string[];
  };
  energyRating?: string;
  condition: 'new' | 'excellent' | 'good' | 'fair' | 'poor';
  ownership: 'freehold' | 'leasehold' | 'shared';
  furnished: boolean;
  petPolicy?: {
    allowed: boolean;
    deposit?: number;
    restrictions?: string[];
  };
  utilities?: {
    electricity?: boolean;
    water?: boolean;
    gas?: boolean;
    internet?: boolean;
    cable?: boolean;
  };
  rules?: LocalizedContent;
  viewCount: number;
  favoriteCount: number;
  inquiryCount: number;
  slug?: string;
  createdAt: Date;
  updatedAt: Date;

  // Methods
  calculateTotalArea(): number;
  calculatePricePerSqM(_price: number): number;
  isInLocation(_city?: string, _district?: string): boolean;
  hasAmenity(_amenity: string): boolean;
  getNearbyFacilities(): string[];
  toPublicJSON(): Partial<IPropertyFeature>;
  validateImages(): boolean;
}

// Interface for PropertyFeature static methods
export interface IPropertyFeatureModel extends Model<IPropertyFeatureDocument> {
  findByOwner(_ownerId: string): Promise<IPropertyFeatureDocument[]>;
  findByType(_type: PropertyType): Promise<IPropertyFeatureDocument[]>;
  findByLocation(_city?: string, _district?: string): Promise<IPropertyFeatureDocument[]>;
  findByPriceRange(_minPrice: number, _maxPrice: number, _prices: number[]): Promise<IPropertyFeatureDocument[]>;
  findBySizeRange(_minSize: number, _maxSize: number): Promise<IPropertyFeatureDocument[]>;
  searchProperties(_filters: any): Promise<IPropertyFeatureDocument[]>;
  getPropertyStats(): Promise<{
    total: number;
    byType: Record<PropertyType, number>;
    byLocation: Record<string, number>;
    averageSize: number;
    sizeRange: { min: number; max: number };
  }>;
  createPropertyFeature(_input: CreatePropertyFeatureInput, _ownerId: string): Promise<IPropertyFeatureDocument>;
}

// Address sub-schema
const AddressSchema = new Schema<Address>({
  street: { 
    type: String, 
    required: [true, 'Street is required'],
    trim: true,
    maxlength: [200, 'Street cannot be longer than 200 characters']
  },
  city: { 
    type: String, 
    required: [true, 'City is required'],
    trim: true,
    maxlength: [100, 'City cannot be longer than 100 characters']
  },
  district: { 
    type: String, 
    required: [true, 'District is required'],
    trim: true,
    maxlength: [100, 'District cannot be longer than 100 characters']
  },
  khoroo: { 
    type: String, 
    trim: true,
    maxlength: [50, 'Khoroo cannot be longer than 50 characters']
  },
  building: { 
    type: String, 
    trim: true,
    maxlength: [50, 'Building cannot be longer than 50 characters']
  },
  apartment: { 
    type: String, 
    trim: true,
    maxlength: [20, 'Apartment cannot be longer than 20 characters']
  },
  zipCode: { 
    type: String, 
    trim: true,
    validate: {
      validator: function(v: string) {
        return !v || /^\d{5}$/.test(v);
      },
      message: 'Zip code must be 5 digits'
    }
  },
  coordinates: {
    latitude: { 
      type: Number,
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90']
    },
    longitude: { 
      type: Number,
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180']
    }
  },
  description: {
    en: { type: String, trim: true },
    mn: { type: String, trim: true }
  }
}, { _id: false });

// Property Details sub-schema
const PropertyDetailsSchema = new Schema<PropertyDetails>({
  completionDate: { 
    type: Date, 
    required: [true, 'Completion date is required'],
    validate: {
      validator: function(v: Date) {
        return v <= new Date();
      },
      message: 'Completion date cannot be in the future'
    }
  },
  constructionYear: {
    type: Number,
    min: [1800, 'Construction year must be after 1800'],
    max: [new Date().getFullYear(), 'Construction year cannot be in the future'],
    validate: {
      validator: function(v: number) {
        return !v || (v >= 1800 && v <= new Date().getFullYear());
      },
      message: 'Please provide a valid construction year'
    }
  },
  windowsCount: { 
    type: Number, 
    required: [true, 'Windows count is required'],
    min: [0, 'Windows count cannot be negative'],
    max: [100, 'Windows count seems unrealistic']
  },
  windowType: { 
    type: String, 
    required: [true, 'Window type is required'],
    trim: true,
    enum: {
      values: ['wooden', 'plastic', 'aluminum', 'steel', 'composite'],
      message: '{VALUE} is not a valid window type'
    }
  },
  floorMaterial: { 
    type: String, 
    required: [true, 'Floor material is required'],
    trim: true,
    enum: {
      values: ['hardwood', 'laminate', 'tile', 'carpet', 'concrete', 'vinyl', 'marble'],
      message: '{VALUE} is not a valid floor material'
    }
  },
  floorNumber: { 
    type: Number, 
    required: [true, 'Floor number is required'],
    min: [-5, 'Floor number cannot be below -5'],
    max: [200, 'Floor number seems unrealistic']
  },
  totalFloors: { 
    type: Number, 
    required: [true, 'Total floors is required'],
    min: [1, 'Total floors must be at least 1'],
    max: [200, 'Total floors seems unrealistic'],
    validate: {
      validator: function(this: PropertyDetails, v: number) {
        return v >= Math.abs(this.floorNumber);
      },
      message: 'Total floors must be greater than or equal to floor number'
    }
  },
  balcony: { 
    type: Boolean, 
    required: [true, 'Balcony information is required']
  },
  balconyCount: {
    type: Number,
    min: [0, 'Balcony count cannot be negative'],
    max: [10, 'Balcony count seems unrealistic'],
    validate: {
      validator: function(this: PropertyDetails, v: number) {
        return !this.balcony || (v && v > 0);
      },
      message: 'Balcony count must be greater than 0 if balcony exists'
    }
  },
  lift: { 
    type: Boolean, 
    required: [true, 'Lift information is required']
  },
  liftCount: {
    type: Number,
    min: [0, 'Lift count cannot be negative'],
    max: [20, 'Lift count seems unrealistic'],
    validate: {
      validator: function(this: PropertyDetails, v: number) {
        return !this.lift || (v && v > 0);
      },
      message: 'Lift count must be greater than 0 if lift exists'
    }
  },
  heating: {
    type: String,
    required: [true, 'Heating information is required'],
    enum: {
      values: ['central', 'individual', 'electric', 'gas', 'solar', 'none'],
      message: '{VALUE} is not a valid heating type'
    }
  },
  airConditioning: { type: Boolean, default: false },
  internet: { type: Boolean, default: false },
  parking: { type: Boolean, default: false },
  parkingSpaces: {
    type: Number,
    min: [0, 'Parking spaces cannot be negative'],
    max: [50, 'Parking spaces count seems unrealistic'],
    validate: {
      validator: function(this: PropertyDetails, v: number) {
        return !this.parking || (v && v > 0);
      },
      message: 'Parking spaces must be greater than 0 if parking exists'
    }
  },
  security: { type: Boolean, default: false },
  furnished: { type: Boolean, default: false },
  petFriendly: { type: Boolean, default: false },
  garden: { type: Boolean, default: false },
  basement: { type: Boolean, default: false },
  attic: { type: Boolean, default: false },
  storage: { type: Boolean, default: false },
  laundry: { type: Boolean, default: false },
  description: {
    en: { type: String, trim: true, maxlength: [1000, 'Description cannot be longer than 1000 characters'] },
    mn: { type: String, trim: true, maxlength: [1000, 'Description cannot be longer than 1000 characters'] }
  }
}, { _id: false });

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

// PropertyFeature Schema
const PropertyFeatureSchema = new Schema<IPropertyFeatureDocument>({
  owner: {
    type: String,
    ref: 'User',
    required: [true, 'Owner is required']
  },
  images: [{
    type: String,
    required: [true, 'Image URL is required'],
    validate: {
      validator: function(v: string) {
        return validator.isURL(v) || /^data:image\//.test(v);
      },
      message: 'Please provide a valid image URL or base64 data'
    }
  }],
  virtualTour: {
    type: String,
    validate: [validator.isURL, 'Please provide a valid virtual tour URL']
  },
  videos: [{
    type: String,
    validate: [validator.isURL, 'Please provide a valid video URL']
  }],
  type: {
    type: String,
    enum: {
      values: Object.values(PropertyType),
      message: '{VALUE} is not a valid property type'
    },
    required: [true, 'Property type is required']
  },
  size: {
    type: Number,
    required: [true, 'Property size is required'],
    min: [1, 'Property size must be at least 1 square meter'],
    max: [10000, 'Property size seems unrealistic']
  },
  totalRooms: {
    type: Number,
    required: [true, 'Total rooms is required'],
    min: [1, 'Total rooms must be at least 1'],
    max: [50, 'Total rooms count seems unrealistic']
  },
  bedrooms: {
    type: Number,
    required: [true, 'Bedrooms count is required'],
    min: [0, 'Bedrooms count cannot be negative'],
    max: [20, 'Bedrooms count seems unrealistic']
  },
  bathrooms: {
    type: Number,
    required: [true, 'Bathrooms count is required'],
    min: [1, 'At least one bathroom is required'],
    max: [10, 'Bathrooms count seems unrealistic']
  },
  livingRooms: {
    type: Number,
    min: [0, 'Living rooms count cannot be negative'],
    max: [10, 'Living rooms count seems unrealistic'],
    default: 1
  },
  kitchens: {
    type: Number,
    min: [0, 'Kitchens count cannot be negative'],
    max: [5, 'Kitchens count seems unrealistic'],
    default: 1
  },
  garage: {
    type: Boolean,
    required: [true, 'Garage information is required']
  },
  garageSpaces: {
    type: Number,
    min: [0, 'Garage spaces cannot be negative'],
    max: [20, 'Garage spaces count seems unrealistic'],
    validate: {
      validator: function(this: IPropertyFeatureDocument, v: number) {
        return !this.garage || (v && v > 0);
      },
      message: 'Garage spaces must be greater than 0 if garage exists'
    }
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
    trim: true,
    enum: {
      values: [
        'swimming_pool', 'gym', 'playground', 'garden', 'elevator',
        'security', 'parking', 'storage', 'laundry', 'internet',
        'cable_tv', 'air_conditioning', 'heating', 'balcony',
        'terrace', 'basement', 'attic', 'fireplace', 'jacuzzi'
      ],
      message: '{VALUE} is not a valid amenity'
    }
  }],
  nearbyFacilities: {
    schools: [{ type: String, trim: true }],
    hospitals: [{ type: String, trim: true }],
    shopping: [{ type: String, trim: true }],
    transport: [{ type: String, trim: true }],
    parks: [{ type: String, trim: true }]
  },
  energyRating: {
    type: String,
    enum: {
      values: ['A+', 'A', 'B', 'C', 'D', 'E', 'F'],
      message: '{VALUE} is not a valid energy rating'
    }
  },
  condition: {
    type: String,
    required: [true, 'Property condition is required'],
    enum: {
      values: ['new', 'excellent', 'good', 'fair', 'poor'],
      message: '{VALUE} is not a valid condition'
    }
  },
  ownership: {
    type: String,
    required: [true, 'Ownership type is required'],
    enum: {
      values: ['freehold', 'leasehold', 'shared'],
      message: '{VALUE} is not a valid ownership type'
    }
  },
  furnished: {
    type: Boolean,
    required: [true, 'Furnished information is required']
  },
  petPolicy: {
    allowed: { type: Boolean, default: false },
    deposit: { 
      type: Number, 
      min: [0, 'Pet deposit cannot be negative'] 
    },
    restrictions: [{ type: String, trim: true }]
  },
  utilities: {
    electricity: { type: Boolean, default: true },
    water: { type: Boolean, default: true },
    gas: { type: Boolean, default: false },
    internet: { type: Boolean, default: false },
    cable: { type: Boolean, default: false }
  },
  rules: LocalizedContentSchema,
  // Analytics fields
  viewCount: { type: Number, default: 0 },
  favoriteCount: { type: Number, default: 0 },
  inquiryCount: { type: Number, default: 0 },
  // SEO fields
  slug: { 
    type: String, 
    unique: true,
    lowercase: true
  },
  // Timestamps
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
PropertyFeatureSchema.index({ owner: 1 });
PropertyFeatureSchema.index({ type: 1 });
PropertyFeatureSchema.index({ 'location.city': 1 });
PropertyFeatureSchema.index({ 'location.district': 1 });
PropertyFeatureSchema.index({ size: 1 });
PropertyFeatureSchema.index({ bedrooms: 1 });
PropertyFeatureSchema.index({ bathrooms: 1 });
PropertyFeatureSchema.index({ condition: 1 });
PropertyFeatureSchema.index({ furnished: 1 });
PropertyFeatureSchema.index({ createdAt: -1 });
PropertyFeatureSchema.index({ viewCount: -1 });
PropertyFeatureSchema.index({ slug: 1 });
PropertyFeatureSchema.index({ 
  'location.coordinates.latitude': 1, 
  'location.coordinates.longitude': 1 
});

// Compound indexes
PropertyFeatureSchema.index({ type: 1, 'location.city': 1 });
PropertyFeatureSchema.index({ size: 1, bedrooms: 1, bathrooms: 1 });

// Virtual for property age
PropertyFeatureSchema.virtual('age').get(function() {
  if (!this.details.constructionYear) return null;
  return new Date().getFullYear() - this.details.constructionYear;
});

// Virtual for room density (size per room)
PropertyFeatureSchema.virtual('roomDensity').get(function() {
  return this.size / this.totalRooms;
});

// Pre-save middleware: Update updatedAt
PropertyFeatureSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Pre-save middleware: Generate slug
PropertyFeatureSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('type') || this.isModified('location.city')) {
    const baseSlug = `${this.type}-${this.location.city}-${Date.now()}`.toLowerCase();
    this.slug = baseSlug.replace(/[^a-z0-9-]/g, '-');
  }
  next();
});

// Pre-save middleware: Validate room counts
PropertyFeatureSchema.pre('save', function(next) {
  const doc = this as IPropertyFeatureDocument;
  if (doc.bedrooms + doc.bathrooms + (doc.livingRooms || 0) + (doc.kitchens || 0) > doc.totalRooms) {
    return next(new Error('Sum of individual rooms cannot exceed total rooms'));
  }
  next();
});

// Instance Methods
PropertyFeatureSchema.methods.calculateTotalArea = function(): number {
  return this.size;
};

PropertyFeatureSchema.methods.calculatePricePerSqM = function(price: number): number {
  return price / this.size;
};

PropertyFeatureSchema.methods.isInLocation = function(city?: string, district?: string): boolean {
  if (city && this.location.city.toLowerCase() !== city.toLowerCase()) return false;
  if (district && this.location.district.toLowerCase() !== district.toLowerCase()) return false;
  return true;
};

PropertyFeatureSchema.methods.hasAmenity = function(amenity: string): boolean {
  return this.amenities.includes(amenity);
};

PropertyFeatureSchema.methods.getNearbyFacilities = function(): string[] {
  const facilities: string[] = [];
  Object.values(this.nearbyFacilities).forEach(facilityList => {
    if (Array.isArray(facilityList)) {
      facilities.push(...facilityList);
    }
  });
  return facilities;
};

PropertyFeatureSchema.methods.toPublicJSON = function(): Partial<IPropertyFeature> {
  const propertyObject = this.toObject();
  // Remove sensitive or internal fields if needed
  return propertyObject;
};

PropertyFeatureSchema.methods.validateImages = function(): boolean {
  return this.images.length >= 1 && this.images.length <= 20;
};

// Static Methods
PropertyFeatureSchema.statics.findByOwner = async function(ownerId: string): Promise<IPropertyFeatureDocument[]> {
  return this.find({ owner: ownerId }).sort({ createdAt: -1 });
};

PropertyFeatureSchema.statics.findByType = async function(type: PropertyType): Promise<IPropertyFeatureDocument[]> {
  return this.find({ type }).sort({ createdAt: -1 });
};

PropertyFeatureSchema.statics.findByLocation = async function(city?: string, district?: string): Promise<IPropertyFeatureDocument[]> {
  const query: any = {};
  if (city) query['location.city'] = new RegExp(city, 'i');
  if (district) query['location.district'] = new RegExp(district, 'i');
  
  return this.find(query).sort({ createdAt: -1 });
};

PropertyFeatureSchema.statics.findByPriceRange = async function(
  minPrice: number, 
  maxPrice: number, 
  prices: number[]
): Promise<IPropertyFeatureDocument[]> {
  // This would need to be coordinated with Post model pricing
  // For now, return based on size as a proxy
  const minSize = minPrice / 1000; // Rough estimate
  const maxSize = maxPrice / 1000;
  
  return this.find({
    size: { $gte: minSize, $lte: maxSize }
  }).sort({ size: 1 });
};

PropertyFeatureSchema.statics.findBySizeRange = async function(
  minSize: number, 
  maxSize: number
): Promise<IPropertyFeatureDocument[]> {
  return this.find({
    size: { $gte: minSize, $lte: maxSize }
  }).sort({ size: 1 });
};

PropertyFeatureSchema.statics.searchProperties = async function(filters: any): Promise<IPropertyFeatureDocument[]> {
  const query: any = {};
  
  if (filters.type) query.type = { $in: Array.isArray(filters.type) ? filters.type : [filters.type] };
  if (filters.sizeMin || filters.sizeMax) {
    query.size = {};
    if (filters.sizeMin) query.size.$gte = filters.sizeMin;
    if (filters.sizeMax) query.size.$lte = filters.sizeMax;
  }
  if (filters.bedrooms) query.bedrooms = filters.bedrooms;
  if (filters.bathrooms) query.bathrooms = { $gte: filters.bathrooms };
  if (filters.location?.city) query['location.city'] = new RegExp(filters.location.city, 'i');
  if (filters.location?.district) query['location.district'] = new RegExp(filters.location.district, 'i');
  if (filters.amenities) query.amenities = { $in: filters.amenities };
  if (filters.condition) query.condition = { $in: Array.isArray(filters.condition) ? filters.condition : [filters.condition] };
  if (typeof filters.furnished === 'boolean') query.furnished = filters.furnished;
  if (typeof filters.garage === 'boolean') query.garage = filters.garage;
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(filters.limit || 50);
};

PropertyFeatureSchema.statics.getPropertyStats = async function() {
  const [totalResult, typeResults, locationResults, sizeStats] = await Promise.all([
    this.countDocuments(),
    this.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]),
    this.aggregate([
      { $group: { _id: '$location.city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]),
    this.aggregate([
      {
        $group: {
          _id: null,
          avgSize: { $avg: '$size' },
          minSize: { $min: '$size' },
          maxSize: { $max: '$size' }
        }
      }
    ])
  ]);

  const byType = typeResults.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {} as Record<PropertyType, number>);

  // Initialize missing types with 0
  Object.values(PropertyType).forEach(type => {
    if (!(type in byType)) {
      byType[type] = 0;
    }
  });

  const byLocation = locationResults.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {} as Record<string, number>);

  const sizeData = sizeStats[0] || { avgSize: 0, minSize: 0, maxSize: 0 };

  return {
    total: totalResult,
    byType,
    byLocation,
    averageSize: Math.round(sizeData.avgSize || 0),
    sizeRange: {
      min: sizeData.minSize || 0,
      max: sizeData.maxSize || 0
    }
  };
};

PropertyFeatureSchema.statics.createPropertyFeature = async function(
  input: CreatePropertyFeatureInput,
  ownerId: string
): Promise<IPropertyFeatureDocument> {
  const propertyFeature = new this({
    ...input,
    owner: ownerId
  });
  return propertyFeature.save();
};

// Create and export model
export const PropertyFeature = mongoose.model<IPropertyFeatureDocument, IPropertyFeatureModel>(
  'PropertyFeature', 
  PropertyFeatureSchema
);

// Export convenience functions
export const createPropertyFeature = (input: CreatePropertyFeatureInput, ownerId: string) => 
  PropertyFeature.createPropertyFeature(input, ownerId);
export const findPropertyFeatureById = (id: string) => PropertyFeature.findById(id);
export const findPropertyFeaturesByOwner = (ownerId: string) => PropertyFeature.findByOwner(ownerId);
export const findPropertyFeaturesByType = (type: PropertyType) => PropertyFeature.findByType(type);
export const findPropertyFeaturesByLocation = (city?: string, district?: string) => 
  PropertyFeature.findByLocation(city, district);
export const searchPropertyFeatures = (filters: any) => PropertyFeature.searchProperties(filters);
export const getPropertyFeatureStats = () => PropertyFeature.getPropertyStats();