export interface PropertyFilters {
  type?: string;
  priceMin?: number;
  priceMax?: number;
  areaMin?: number;
  areaMax?: number;
  bedrooms?: number;
  bathrooms?: number;
  location?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PropertySearchFilters {
  query?: string;
  filters?: PropertyFilters;
}

export interface PropertyResponse {
  properties: unknown[];
  total: number;
  hasMore: boolean;
}

export interface MongoQuery {
  [key: string]: unknown;
}

export interface MongoRangeQuery {
  $gte?: number;
  $lte?: number;
}

export interface MongoQueryWithRanges extends MongoQuery {
  price?: MongoRangeQuery;
  area?: MongoRangeQuery;
}

export interface SortOptions {
  [key: string]: 1 | -1;
}
