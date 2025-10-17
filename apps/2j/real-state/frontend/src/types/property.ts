export interface Property {
  id: number;
  title: string;
  titleEn?: string;
  price: number;
  location: string;
  locationEn?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: PropertyType;
  image: string;
  featured: boolean;
  description?: string;
  descriptionEn?: string;
  amenities?: string[];
  images?: string[];
  features?: string[];
  yearBuilt?: number;
  parking?: number;
  garden?: boolean;
  balcony?: boolean;
  furnished?: boolean;
  petFriendly?: boolean;
  status?: 'For Sale' | 'For Rent' | 'Sold' | 'Rented';
  createdAt: string;
  updatedAt: string;
  agent?: Agent;
}

export interface Agent {
  name: string;
  phone: string;
  email: string;
  image: string;
  title?: string;
}

export type PropertyType = 'apartment' | 'house' | 'commercial' | 'land' | 'villa' | 'cottage' | 'loft' | 'condo';

export interface PropertyFilters {
  priceMin?: number;
  priceMax?: number;
  areaMin?: number;
  areaMax?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: PropertyType | 'all';
  location?: string;
  featured?: boolean;
}

export interface SearchParams {
  query?: string;
  filters?: PropertyFilters;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'area' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PropertyCardProps {
  property: Property;
  onFavorite?: (_propertyId: number) => void;
  onView?: (_propertyId: number) => void;
  viewMode?: 'grid' | 'list';
}

export interface PropertyListProps {
  properties: Property[];
  loading?: boolean;
  error?: string;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export interface PropertyDetailProps {
  property: Property;
  relatedProperties?: Property[];
}
