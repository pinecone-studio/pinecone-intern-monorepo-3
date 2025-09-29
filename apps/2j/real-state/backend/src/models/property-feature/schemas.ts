import { Schema } from 'mongoose';
import validator from 'validator';
import { LocalizedContent, PropertyType } from '../../types';
import { 
  PropertyPetPolicy, 
  PropertyUtilities, 
  PropertyNearbyFacilities, 
  PropertyCondition, 
  PropertyOwnership 
} from './interfaces';

// Address sub-schema
export const AddressSchema = new Schema({
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
  zipCode: { 
    type: String, 
    required: [true, 'ZIP code is required'],
    trim: true,
    validate: {
      validator: function(v: string) {
        return !v || /^\d{5}$/.test(v);
      },
      message: 'ZIP code must be 5 digits'
    }
  },
  coordinates: {
    latitude: { 
      type: Number,
      min: -90,
      max: 90
    },
    longitude: { 
      type: Number,
      min: -180,
      max: 180
    }
  },
  description: {
    en: { type: String, trim: true },
    mn: { type: String, trim: true }
  }
}, { _id: false });

// Property Details sub-schema
export const PropertyDetailsSchema = new Schema({
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
  }
}, { _id: false });

// Pet Policy sub-schema
export const PetPolicySchema = new Schema<PropertyPetPolicy>({
  allowed: { 
    type: Boolean, 
    required: true 
  },
  deposit: { 
    type: Number, 
    min: [0, 'Pet deposit cannot be negative'] 
  },
  restrictions: [{
    type: String, 
    trim: true 
  }]
}, { _id: false });

// Utilities sub-schema
export const UtilitiesSchema = new Schema<PropertyUtilities>({
  electricity: { type: Boolean, default: false },
  water: { type: Boolean, default: false },
  gas: { type: Boolean, default: false },
  internet: { type: Boolean, default: false },
  cable: { type: Boolean, default: false }
}, { _id: false });

// Nearby Facilities sub-schema
export const NearbyFacilitiesSchema = new Schema<PropertyNearbyFacilities>({
  schools: [{
    type: String, 
    trim: true 
  }],
  hospitals: [{
    type: String, 
    trim: true 
  }],
  shopping: [{
    type: String, 
    trim: true 
  }],
  transport: [{
    type: String, 
    trim: true 
  }],
  parks: [{
    type: String, 
    trim: true 
  }]
}, { _id: false });

// Localized Content sub-schema
export const LocalizedContentSchema = new Schema<LocalizedContent>({
  en: { 
    type: String, 
    trim: true,
    required: [true, 'English content is required']
  },
  mn: { 
    type: String, 
    trim: true,
    required: [true, 'Mongolian content is required']
  }
}, { _id: false });
