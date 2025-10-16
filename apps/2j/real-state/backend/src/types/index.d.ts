// Minimal types for build requirements
/* eslint-disable no-unused-vars */
export enum PropertyType {
  HOUSE = 'house',
  APARTMENT = 'apartment'
}

export enum PropertyStatus {
  PENDING = 'pending',
  APPROVED = 'approved'
}

export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller'
}

export enum Language {
  EN = 'en',
  MN = 'mn'
}

export enum Currency {
  MNT = 'MNT',
  USD = 'USD'
}
/* eslint-enable no-unused-vars */

export interface LocalizedContent {
  en: string;
  mn: string;
}

export interface Address {
  street: string;
  city: string;
  district: string;
  province: string;
  zipCode: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  description: LocalizedContent;
}

export interface PropertyDetails {
  completionDate: Date;
  constructionYear?: number;
  windowsCount: number;
  windowType: string;
  floorMaterial: string;
  floorNumber: number;
  totalFloors: number;
  balcony: boolean;
  balconyCount?: number;
  lift: boolean;
  liftCount?: number;
  heating: string;
  airConditioning?: boolean;
  internet?: boolean;
  parking?: boolean;
  parkingSpaces?: number;
  security?: boolean;
  furnished?: boolean;
  petFriendly?: boolean;
  garden?: boolean;
  basement?: boolean;
  attic?: boolean;
  storage?: boolean;
  laundry?: boolean;
  description?: LocalizedContent;
}

export interface IUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  preferredLanguage: string;
  isActive: boolean;
  address?: Address;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {}

export interface IPropertyFeature {
  type: PropertyType;
  size: number;
  totalRooms: number;
  bedrooms: number;
  bathrooms: number;
  garage: boolean;
  location: Address;
  details: PropertyDetails;
  images: string[];
  amenities: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IPropertyFeatureDocument extends IPropertyFeature, Document {}

export interface IPost {
  title: LocalizedContent;
  description: LocalizedContent;
  price: number;
  currency: string;
  status: string;
  featured: boolean;
  availableFrom: Date;
  owner: string;
  propertyFeature: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPostDocument extends IPost, Document {}

export type Context = {
  req?: unknown;
  user?: IUser;
  language?: Language;
  ip?: string;
  userAgent?: string;
};

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: LocalizedContent;
  errors?: Array<{
    field: string;
    message: LocalizedContent;
  }>;
}
