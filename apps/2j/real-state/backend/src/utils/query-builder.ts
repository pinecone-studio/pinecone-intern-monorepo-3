import { PropertyFilters, MongoQueryWithRanges, SortOptions, MongoQuery } from '../types/property';

export const buildPropertyQuery = (filters: PropertyFilters): MongoQueryWithRanges => {
  const query: MongoQueryWithRanges = {};
  
  addTypeFilter(query, filters.type);
  addPriceFilter(query, filters.priceMin, filters.priceMax);
  addAreaFilter(query, filters.areaMin, filters.areaMax);
  addBedroomsFilter(query, filters.bedrooms);
  addBathroomsFilter(query, filters.bathrooms);
  addLocationFilter(query, filters.location);
  addFeaturedFilter(query, filters.featured);
  
  return query;
};

export const buildSortOptions = (sortBy?: string, sortOrder?: 'asc' | 'desc'): SortOptions => {
  const sort: SortOptions = {};
  const field = sortBy || 'createdAt';
  const order = sortOrder === 'asc' ? 1 : -1;
  sort[field] = order;
  return sort;
};

const buildBaseSearchQuery = (searchQuery?: string): MongoQuery => {
  const query: MongoQuery = {};
  addTextSearch(query, searchQuery);
  return query;
};

const addSearchFilters = (query: MongoQuery, filters: PropertyFilters): void => {
  addPriceFilter(query, filters.priceMin, filters.priceMax);
  addAreaFilter(query, filters.areaMin, filters.areaMax);
  addOtherFilters(query, filters);
};

export const buildSearchQuery = (searchQuery?: string, filters: PropertyFilters = {}): MongoQuery => {
  const query = buildBaseSearchQuery(searchQuery);
  addSearchFilters(query, filters);
  return query;
};

const addTypeFilter = (query: MongoQuery, type?: string): void => {
  if (type && type !== 'all') {
    query.type = type;
  }
};

const hasPriceRange = (priceMin?: number, priceMax?: number): boolean => {
  return Boolean(priceMin || priceMax);
};

const setPriceMin = (query: MongoQueryWithRanges, priceMin?: number): void => {
  if (priceMin && query.price) {
    query.price.$gte = priceMin;
  }
};

const setPriceMax = (query: MongoQueryWithRanges, priceMax?: number): void => {
  if (priceMax && query.price) {
    query.price.$lte = priceMax;
  }
};

const addPriceFilter = (query: MongoQueryWithRanges, priceMin?: number, priceMax?: number): void => {
  if (hasPriceRange(priceMin, priceMax)) {
    query.price = {};
    setPriceMin(query, priceMin);
    setPriceMax(query, priceMax);
  }
};

const hasAreaRange = (areaMin?: number, areaMax?: number): boolean => {
  return Boolean(areaMin || areaMax);
};

const setAreaMin = (query: MongoQueryWithRanges, areaMin?: number): void => {
  if (areaMin && query.area) {
    query.area.$gte = areaMin;
  }
};

const setAreaMax = (query: MongoQueryWithRanges, areaMax?: number): void => {
  if (areaMax && query.area) {
    query.area.$lte = areaMax;
  }
};

const addAreaFilter = (query: MongoQueryWithRanges, areaMin?: number, areaMax?: number): void => {
  if (hasAreaRange(areaMin, areaMax)) {
    query.area = {};
    setAreaMin(query, areaMin);
    setAreaMax(query, areaMax);
  }
};

const addBedroomsFilter = (query: MongoQuery, bedrooms?: number): void => {
  if (bedrooms) {
    query.bedrooms = { $gte: bedrooms };
  }
};

const addBathroomsFilter = (query: MongoQuery, bathrooms?: number): void => {
  if (bathrooms) {
    query.bathrooms = { $gte: bathrooms };
  }
};

const addLocationFilter = (query: MongoQuery, location?: string): void => {
  if (location) {
    query.location = { $regex: location, $options: 'i' };
  }
};

const addFeaturedFilter = (query: MongoQuery, featured?: boolean): void => {
  if (featured !== undefined) {
    query.featured = featured;
  }
};

const addTextSearch = (query: MongoQuery, searchQuery?: string): void => {
  if (searchQuery) {
    query.$or = [
      { title: { $regex: searchQuery, $options: 'i' } },
      { location: { $regex: searchQuery, $options: 'i' } },
      { description: { $regex: searchQuery, $options: 'i' } }
    ];
  }
};

const isFilterValueValid = (value: unknown): boolean => {
  return value !== undefined && value !== null && value !== '';
};

const isHandledBySpecificFilter = (key: string): boolean => {
  return ['priceMin', 'priceMax', 'areaMin', 'areaMax'].includes(key);
};

const addOtherFilters = (query: MongoQuery, filters: PropertyFilters): void => {
  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof PropertyFilters];
    
    if (isFilterValueValid(value) && !isHandledBySpecificFilter(key)) {
      query[key] = value;
    }
  });
};
