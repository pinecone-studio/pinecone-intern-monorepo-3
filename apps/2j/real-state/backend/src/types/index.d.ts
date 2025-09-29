/* eslint-disable @typescript-eslint/ban-types */

// Enums
export enum PropertyType {
  HOUSE = 'house',
  APARTMENT = 'apartment',
  OFFICE = 'office'
}

export enum PropertyStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  DECLINED = 'declined'
}

export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller',
  AGENT = 'agent',
  ADMIN = 'admin'
}

// Address interface
export interface Address {
  address: string;
  city: number;
  district: string;
}

// Property Details interface
export interface PropertyDetails {
  completionDate: Date;
  windowsCount: number;
  windowType: string;
  floorMaterial: string;
  floorNumber: number;
  balcony: boolean;
  totalFloors: number;
  lift: boolean;
}

// User interfaces
export interface IUser {
  _id?: string;
  email: string;
  password: string;
  isAdmin: boolean;
  phone: number;
  updatedAt: Date;
  createdAt: Date;
}

export interface CreateUserInput {
  email: string;
  password: string;
  phone?: number;
  isAdmin?: boolean;
}

export interface LoginInput {
  email: string;
  password: string;
}

// Post interfaces
export interface IPost {
  _id?: string;
  propertyOwnerId: string;
  title: string;
  description: string;
  price: number;
  propertyDetail: string; // Reference to PropertyFeature._id
  status: PropertyStatus;
  updatedAt: Date;
  createdAt: Date;
}

export interface CreatePostInput {
  propertyOwnerId: string;
  title: string;
  description: string;
  price: number;
  propertyDetail: string;
}

export interface UpdatePostStatusInput {
  status: PropertyStatus;
}

// PropertyFeature interfaces
export interface IPropertyFeature {
  _id?: string;
  userId: string;
  images: string[];
  type: PropertyType;
  size: number;
  totalRooms: number;
  garage: boolean;
  restrooms: number;
  location: Address;
  details: PropertyDetails;
  updatedAt: Date;
  createdAt: Date;
}

export interface CreatePropertyFeatureInput {
  userId: string;
  images: string[];
  type: PropertyType;
  size: number;
  totalRooms: number;
  garage: boolean;
  restrooms: number;
  location: Address;
  details: PropertyDetails;
}

// GraphQL Context
export type Context = {
  user?: IUser;
};
