import mongoose, { Document, Schema } from 'mongoose';

// Property interface based on mutations
export interface IProperty {
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  image: string;
  featured?: boolean;
  description?: string;
  features?: string[];
  yearBuilt?: number;
  parking?: number;
  garden?: boolean;
  balcony?: boolean;
  furnished?: boolean;
  petFriendly?: boolean;
  status?: string;
  agent?: {
    name: string;
    phone: string;
    email: string;
    title?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IPropertyDocument extends IProperty, Document {}

// Property schema
const PropertySchema = new Schema<IPropertyDocument>({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  area: { type: Number, required: true },
  type: { type: String, required: true },
  image: { type: String, required: true },
  featured: { type: Boolean, default: false },
  description: { type: String },
  features: [{ type: String }],
  yearBuilt: { type: Number },
  parking: { type: Number },
  garden: { type: Boolean },
  balcony: { type: Boolean },
  furnished: { type: Boolean },
  petFriendly: { type: Boolean },
  status: { type: String, default: "available" },
  agent: {
    name: { type: String },
    phone: { type: String },
    email: { type: String },
    title: { type: String }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Property = mongoose.models.Property || mongoose.model<IPropertyDocument>('Property', PropertySchema);
