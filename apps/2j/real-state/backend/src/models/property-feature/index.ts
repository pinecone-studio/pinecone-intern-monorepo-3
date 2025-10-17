import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { PropertyType } from '../../types';
import { IPropertyFeatureDocument } from '../property-feature-simple';

// Simple PropertyFeature schema
const PropertyFeatureSchema = new Schema<IPropertyFeatureDocument>({
  type: { type: String, enum: Object.values(PropertyType), required: true },
  size: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  location: {
    city: { type: String, required: true },
    district: { type: String, required: true },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Add methods
PropertyFeatureSchema.methods = {
  // Update property
  async updateProperty(this: IPropertyFeatureDocument, updates: Partial<IPropertyFeatureDocument>): Promise<void> {
    Object.assign(this, updates);
    this.updatedAt = new Date();
    await this.save();
  }
};

// Add statics
PropertyFeatureSchema.statics = {
  // Find by type
  async findByType(type: PropertyType) {
    return this.find({ type });
  }
};

export const PropertyFeature = mongoose.model<IPropertyFeatureDocument>('PropertyFeature', PropertyFeatureSchema);