import mongoose, { Document, Schema } from 'mongoose';
import { IPropertyFeature, CreatePropertyFeatureInput, PropertyType, Address, PropertyDetails } from '../types';

export interface IPropertyFeatureDocument extends IPropertyFeature, Document {}

// Address sub-schema
const AddressSchema = new Schema<Address>({
  address: { type: String, required: true },
  city: { type: Number, required: true },
  district: { type: String, required: true },
}, { _id: false });

// Property Details sub-schema
const PropertyDetailsSchema = new Schema<PropertyDetails>({
  completionDate: { type: Date, required: true },
  windowsCount: { type: Number, required: true },
  windowType: { type: String, required: true },
  floorMaterial: { type: String, required: true },
  floorNumber: { type: Number, required: true },
  balcony: { type: Boolean, required: true },
  totalFloors: { type: Number, required: true },
  lift: { type: Boolean, required: true },
}, { _id: false });

const PropertyFeatureSchema = new Schema<IPropertyFeatureDocument>({
  userId: {
    type: String,
    required: true,
    ref: 'User',
  },
  images: [{
    type: String,
    required: true,
  }],
  type: {
    type: String,
    enum: Object.values(PropertyType),
    required: true,
  },
  size: {
    type: Number,
    required: true,
    min: 0,
  },
  totalRooms: {
    type: Number,
    required: true,
    min: 0,
  },
  garage: {
    type: Boolean,
    required: true,
  },
  restrooms: {
    type: Number,
    required: true,
    min: 0,
  },
  location: {
    type: AddressSchema,
    required: true,
  },
  details: {
    type: PropertyDetailsSchema,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Update updatedAt before saving
PropertyFeatureSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const PropertyFeature = mongoose.model<IPropertyFeatureDocument>('PropertyFeature', PropertyFeatureSchema);

// Static methods
export const createPropertyFeature = async (input: CreatePropertyFeatureInput): Promise<IPropertyFeatureDocument> => {
  const propertyFeature = new PropertyFeature(input);
  return propertyFeature.save();
};

export const findPropertyFeatureById = async (id: string): Promise<IPropertyFeatureDocument | null> => {
  return PropertyFeature.findById(id);
};

export const findPropertyFeaturesByUserId = async (userId: string): Promise<IPropertyFeatureDocument[]> => {
  return PropertyFeature.find({ userId });
};
