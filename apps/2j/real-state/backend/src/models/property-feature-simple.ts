import { Document } from 'mongoose';
import { PropertyType } from '../types';

// Simple PropertyFeature interface
export interface IPropertyFeature {
  type: PropertyType;
  size: number;
  bedrooms: number;
  bathrooms: number;
  location: {
    city: string;
    district: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IPropertyFeatureDocument extends IPropertyFeature, Document {}
