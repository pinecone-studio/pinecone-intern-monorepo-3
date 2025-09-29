import { Document, Model } from 'mongoose';
import { 
  IPropertyFeature, 
  CreatePropertyFeatureInput,
  PropertyType, 
  Address, 
  PropertyDetails,
  LocalizedContent 
} from '../../types';

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
  nearbyFacilities?: PropertyNearbyFacilities;
  energyRating?: string;
  condition: PropertyCondition;
  ownership: PropertyOwnership;
  furnished: boolean;
  petPolicy?: PropertyPetPolicy;
  utilities?: PropertyUtilities;
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
  searchProperties(_filters: PropertySearchFilters): Promise<IPropertyFeatureDocument[]>;
  getPropertyStats(): Promise<PropertyStats>;
  createPropertyFeature(_input: CreatePropertyFeatureInput, _ownerId: string): Promise<IPropertyFeatureDocument>;
}

// Type definitions for better type safety
export type PropertyCondition = 'new' | 'excellent' | 'good' | 'fair' | 'poor';
export type PropertyOwnership = 'freehold' | 'leasehold' | 'shared';

export interface PropertyPetPolicy {
  allowed: boolean;
  deposit?: number;
  restrictions?: string[];
}

export interface PropertyUtilities {
  electricity?: boolean;
  water?: boolean;
  gas?: boolean;
  internet?: boolean;
  cable?: boolean;
}

export interface PropertyNearbyFacilities {
  schools?: string[];
  hospitals?: string[];
  shopping?: string[];
  transport?: string[];
  parks?: string[];
}

export interface PropertySearchFilters {
  type?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  minSize?: number;
  maxSize?: number;
  location?: {
    city?: string;
    district?: string;
  };
  amenities?: string[];
  condition?: PropertyCondition;
  ownership?: PropertyOwnership;
  furnished?: boolean;
  petFriendly?: boolean;
  utilities?: string[];
}

export interface PropertyStats {
  total: number;
  byType: Record<PropertyType, number>;
  byLocation: Record<string, number>;
  averageSize: number;
  sizeRange: { min: number; max: number };
}
