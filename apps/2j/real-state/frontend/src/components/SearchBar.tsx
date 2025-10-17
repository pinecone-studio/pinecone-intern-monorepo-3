/* eslint-disable complexity */
/* eslint-disable max-lines */
'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { PropertyType } from '../types/property';

export interface SearchFilters {
  query: string;
  propertyType: PropertyType | 'all';
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  district: string;
}

interface SearchBarProps {
  // eslint-disable-next-line no-unused-vars
  onSearch: (filters: SearchFilters) => void;
  totalResults?: number;
}

const SearchBar = ({ onSearch, totalResults }: SearchBarProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    propertyType: 'all',
    district: 'all',
  });

  const propertyTypes: Array<{ value: PropertyType | 'all'; label: string }> = [
    { value: 'all', label: 'All Types' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'villa', label: 'Villa' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'land', label: 'Land' },
    { value: 'cottage', label: 'Cottage' },
    { value: 'loft', label: 'Loft' },
    { value: 'condo', label: 'Condo' },
  ];

  const districts = [
    { value: 'all', label: 'All Districts' },
    { value: 'sukhbaatar', label: 'Sukhbaatar' },
    { value: 'chingeltei', label: 'Chingeltei' },
    { value: 'bayanzurkh', label: 'Bayanzurkh' },
    { value: 'bayangol', label: 'Bayangol' },
    { value: 'khan-uul', label: 'Khan-Uul' },
    { value: 'songinokhairkhan', label: 'Songinokhairkhan' },
  ];

  const bedroomOptions = [
    { value: undefined, label: 'Any Bedrooms' },
    { value: 1, label: '1+' },
    { value: 2, label: '2+' },
    { value: 3, label: '3+' },
    { value: 4, label: '4+' },
    { value: 5, label: '5+' },
  ];

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleReset = () => {
    const resetFilters: SearchFilters = {
      query: '',
      propertyType: 'all',
      district: 'all',
    };
    setFilters(resetFilters);
    onSearch(resetFilters);
  };

  const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full">
      {/* Main Search Bar */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search location, district..."
              value={filters.query}
              onChange={(e) => updateFilter('query', e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Quick Filter: Property Type */}
          <div className="w-full lg:w-48">
            <select
              value={filters.propertyType}
              onChange={(e) => updateFilter('propertyType', e.target.value as PropertyType | 'all')}
              className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
            >
              {propertyTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                showFilters
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <SlidersHorizontal className="h-5 w-5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
            <button
              onClick={handleSearch}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
            >
              <Search className="h-5 w-5" />
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
            {/* District Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                District
              </label>
              <select
                value={filters.district}
                onChange={(e) => updateFilter('district', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
              >
                {districts.map((district) => (
                  <option key={district.value} value={district.value}>
                    {district.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Bedrooms Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bedrooms
              </label>
              <select
                value={filters.bedrooms || ''}
                onChange={(e) => updateFilter('bedrooms', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
              >
                {bedroomOptions.map((option) => (
                  <option key={option.label} value={option.value || ''}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Min Price (₮)
              </label>
              <input
                type="number"
                placeholder="0"
                value={filters.minPrice || ''}
                onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Max Price (₮)
              </label>
              <input
                type="number"
                placeholder="1,000,000,000"
                value={filters.maxPrice || ''}
                onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Reset Button */}
            <div className="md:col-span-2 lg:col-span-4 flex justify-end">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      {totalResults !== undefined && (
        <div className="mt-4 text-center">
          <p className="text-gray-600 font-medium">
            <span className="text-2xl font-bold text-blue-600">{totalResults}</span>{' '}
            properties found
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

