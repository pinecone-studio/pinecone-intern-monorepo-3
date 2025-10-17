/* eslint-disable max-lines */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Post } from '../../models';
import { connectToDb } from '../../utils/connect-to-db';
import { 
  getMockProperties, 
  getMockPropertyById, 
  getMockFeaturedProperties, 
  searchMockProperties 
} from '../../services/mock-data';
import { PropertyFilters, PropertyResponse } from '../../types/property';

// Transform Post + PropertyFeature to Property format for frontend
const transformPostToProperty = (post: any, propertyFeature: any) => {
  return {
    _id: post._id,
    title: post.title,
    price: post.price,
    location: propertyFeature.location.address,
    bedrooms: propertyFeature.totalRooms,
    bathrooms: propertyFeature.restrooms,
    area: propertyFeature.size,
    type: propertyFeature.type,
    image: propertyFeature.images[0] || '',
    images: propertyFeature.images,
    featured: false, // Can be determined by business logic
    description: post.description,
    features: [
      propertyFeature.garage ? 'Гараж' : '',
      propertyFeature.details.balcony ? 'Балкон' : '',
      propertyFeature.details.lift ? 'Лифт' : '',
    ].filter(Boolean),
    yearBuilt: new Date(propertyFeature.details.completionDate).getFullYear(),
    parking: propertyFeature.garage ? 1 : 0,
    garden: false,
    balcony: propertyFeature.details.balcony,
    furnished: false,
    petFriendly: false,
    status: post.status === 'approved' ? 'FOR_SALE' : 'FOR_SALE',
    agent: null,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };
};

const fetchPropertiesFromDb = async (filters: PropertyFilters): Promise<PropertyResponse> => {
  await connectToDb();
  
  // Get approved posts with their property features
  const posts = await Post.find({ status: 'approved' })
    .populate('propertyDetail')
    .sort({ createdAt: -1 })
    .limit(filters.limit || 20)
    .skip(filters.offset || 0)
    .lean();

  const total = await Post.countDocuments({ status: 'approved' });

  // Transform to Property format
  const properties = posts.map(post => transformPostToProperty(post, post.propertyDetail));

  return {
    properties,
    total,
    hasMore: (filters.offset || 0) + properties.length < total
  };
};

const getPropertiesFromMock = (filters: PropertyFilters): PropertyResponse => {
  const properties = getMockProperties(filters.limit || 20, filters.offset || 0);
  return {
    properties,
    total: properties.length,
    hasMore: false
  };
};

export const getProperties = async (_: unknown, { filters = {} }: { filters?: PropertyFilters }): Promise<PropertyResponse> => {
  try {
    return await fetchPropertiesFromDb(filters);
  } catch (error) {
    console.error('Error fetching properties:', error);
    console.log('🔄 Using mock data as fallback');
    return getPropertiesFromMock(filters);
  }
};

const fetchPropertyByIdFromDb = async (id: string) => {
  await connectToDb();
  
  const post = await Post.findById(id)
    .populate('propertyDetail')
    .lean();
  
  if (!post) {
    throw new Error('Property not found');
  }
  
  return transformPostToProperty(post, post.propertyDetail);
};

const getPropertyByIdFromMock = (id: string) => {
  const property = getMockPropertyById(id);
  if (!property) {
    throw new Error('Property not found');
  }
  return property;
};

export const getPropertyById = async (_: unknown, { id }: { id: string }) => {
  try {
    return await fetchPropertyByIdFromDb(id);
  } catch (error) {
    console.error('Error fetching property:', error);
    console.log('🔄 Using mock data as fallback');
    return getPropertyByIdFromMock(id);
  }
};

const fetchFeaturedPropertiesFromDb = async (limit: number) => {
  await connectToDb();
  
  // For now, get recent approved posts as "featured"
  const posts = await Post.find({ status: 'approved' })
    .populate('propertyDetail')
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  
  return posts.map(post => transformPostToProperty(post, post.propertyDetail));
};

const getFeaturedPropertiesFromMock = (limit: number) => {
  return getMockFeaturedProperties(limit);
};

export const getFeaturedProperties = async (_: unknown, { limit = 6 }: { limit?: number }) => {
  try {
    return await fetchFeaturedPropertiesFromDb(limit);
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    console.log('🔄 Using mock data as fallback');
    return getFeaturedPropertiesFromMock(limit);
  }
};

const fetchSearchPropertiesFromDb = async (query: string | undefined, _filters: PropertyFilters) => {
  await connectToDb();
  
  const searchQuery: any = { status: 'approved' };
  
  if (query) {
    searchQuery.$or = [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } }
    ];
  }
  
  const posts = await Post.find(searchQuery)
    .populate('propertyDetail')
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();
  
  return posts.map(post => transformPostToProperty(post, post.propertyDetail));
};

const getSearchPropertiesFromMock = (query: string | undefined) => {
  return searchMockProperties(query, 20);
};

export const searchProperties = async (_: unknown, { query, filters = {} }: { query?: string; filters?: PropertyFilters }) => {
  try {
    return await fetchSearchPropertiesFromDb(query, filters);
  } catch (error) {
    console.error('Error searching properties:', error);
    console.log('🔄 Using mock data as fallback');
    return getSearchPropertiesFromMock(query);
  }
};

// New resolvers for Posts
export const getPosts = async (_: unknown, { filters = {} }: { filters?: PropertyFilters }) => {
  try {
    await connectToDb();
    
    const posts = await Post.find()
      .populate('propertyOwnerId', 'email phone')
      .populate('propertyDetail')
      .sort({ createdAt: -1 })
      .limit(filters.limit || 20)
      .skip(filters.offset || 0)
      .lean();
    
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

export const getPostById = async (_: unknown, { id }: { id: string }) => {
  try {
    await connectToDb();
    
    const post = await Post.findById(id)
      .populate('propertyOwnerId', 'email phone')
      .populate('propertyDetail')
      .lean();
    
    if (!post) {
      throw new Error('Post not found');
    }
    
    return post;
  } catch (error) {
    console.error('Error fetching post:', error);
    throw new Error('Post not found');
  }
};
