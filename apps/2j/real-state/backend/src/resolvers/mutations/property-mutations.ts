import { Property } from '../../models';
import { connectToDb } from '../../utils/connect-to-db';

interface CreatePropertyInput {
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
}

export const createProperty = async (_: unknown, { input }: { input: CreatePropertyInput }) => {
  try {
    await connectToDb();
    
    const property = new Property(input);
    await property.save();
    
    return property;
  } catch (error) {
    console.error('Error creating property:', error);
    throw new Error('Failed to create property');
  }
};

export const updateProperty = async (_: unknown, { id, input }: { id: string; input: Partial<CreatePropertyInput> }) => {
  try {
    await connectToDb();
    
    const property = await Property.findByIdAndUpdate(
      id,
      { $set: input },
      { new: true, runValidators: true }
    );
    
    if (!property) {
      throw new Error('Property not found');
    }
    
    return property;
  } catch (error) {
    console.error('Error updating property:', error);
    throw new Error('Failed to update property');
  }
};

export const deleteProperty = async (_: unknown, { id }: { id: string }) => {
  try {
    await connectToDb();
    
    const property = await Property.findByIdAndDelete(id);
    
    if (!property) {
      throw new Error('Property not found');
    }
    
    return { success: true, message: 'Property deleted successfully' };
  } catch (error) {
    console.error('Error deleting property:', error);
    throw new Error('Failed to delete property');
  }
};

export const toggleFeatured = async (_: unknown, { id }: { id: string }) => {
  try {
    await connectToDb();
    
    const property = await Property.findById(id);
    
    if (!property) {
      throw new Error('Property not found');
    }
    
    property.featured = !property.featured;
    await property.save();
    
    return property;
  } catch (error) {
    console.error('Error toggling featured status:', error);
    throw new Error('Failed to toggle featured status');
  }
};
