import mongoose, { Document, Schema } from 'mongoose';

// PropertyFeature interface matching your database model
export interface IPropertyFeature {
  userId: mongoose.Types.ObjectId;
  images: string[];
  type: 'house' | 'apartment' | 'office';
  size: number;
  totalRooms: number;
  garage: boolean;
  restrooms: number;
  location: {
    address: string;
    city: number;
    district: string;
  };
  details: {
    completionDate: Date;
    windowsCount: number;
    windowType: string;
    floorMaterial: string;
    floorNumber: number;
    balcony: boolean;
    totalFloors: number;
    lift: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IPropertyFeatureDocument extends IPropertyFeature, Document {}

// PropertyFeature schema matching your database model
const PropertyFeatureSchema = new Schema<IPropertyFeatureDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  images: [{ type: String, required: true }],
  type: { type: String, enum: ['house', 'apartment', 'office'], required: true },
  size: { type: Number, required: true },
  totalRooms: { type: Number, required: true },
  garage: { type: Boolean, default: false },
  restrooms: { type: Number, required: true },
  location: {
    address: { type: String, required: true },
    city: { type: Number, required: true },
    district: { type: String, required: true }
  },
  details: {
    completionDate: { type: Date, required: true },
    windowsCount: { type: Number, required: true },
    windowType: { type: String, required: true },
    floorMaterial: { type: String, required: true },
    floorNumber: { type: Number, required: true },
    balcony: { type: Boolean, default: false },
    totalFloors: { type: Number, required: true },
    lift: { type: Boolean, default: false }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const PropertyFeature = mongoose.models.PropertyFeature || mongoose.model<IPropertyFeatureDocument>('PropertyFeature', PropertyFeatureSchema);