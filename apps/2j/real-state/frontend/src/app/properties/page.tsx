/* eslint-disable complexity */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useMemo } from 'react';
import Header from '../../components/Header';
import PropertyCard from '../../components/PropertyCard';
import Footer from '../../components/Footer';
import { SAMPLE_PROPERTIES } from '../../data/properties';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { PropertyType } from '../../types/property';
import { useGetPropertiesQuery } from '../../generated';

interface PropertyFilters {
  query: string;
  propertyTypes: PropertyType[];
  minPrice?: number;
  maxPrice?: number;
  bedrooms: number[];
  bathrooms: number[];
  features: string[];
}

const PropertiesPage = () => {
  const [filters, setFilters] = useState<PropertyFilters>({
    query: '',
    propertyTypes: [],
    bedrooms: [],
    bathrooms: [],
    features: [],
  });
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'area'>('newest');
  const [showFilters, setShowFilters] = useState(false);
  
  // Fetch properties from MongoDB
  const { data, loading, error } = useGetPropertiesQuery();

  const propertyTypes: Array<{ value: PropertyType; label: string }> = [
    { value: 'house', label: 'Байшин' },
    { value: 'apartment', label: 'Орон сууц' },
    { value: 'commercial', label: 'Оффис' },
    { value: 'villa', label: 'Вилла' },
    { value: 'land', label: 'Газар' },
  ];

  const bedroomOptions = [1, 2, 3, 4, 5];
  const bathroomOptions = [1, 2, 3];
  const featureOptions = [
    { value: 'parking', label: 'Дулаан зогсоол' },
    { value: 'storage', label: 'Агуулах' },
    { value: 'elevator', label: 'Лифт' },
    { value: 'garden', label: 'Цэнгэлдэх хүрээлэн' },
    { value: 'balcony', label: 'Балкон' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Сүүлд нэмэгдсэн' },
    { value: 'price-low', label: 'Үнэ өсөх дараалал' },
    { value: 'price-high', label: 'Үнэ буурах дараалал' },
    { value: 'area', label: 'Талбайгаар' },
  ];

  const filteredAndSortedProperties = useMemo(() => {
    // Use real data from MongoDB if available, fallback to sample data
    const allProperties = data?.getProperties?.properties || SAMPLE_PROPERTIES;
    let results = [...allProperties];

    // Text search
    if (filters.query.trim()) {
      const query = filters.query.toLowerCase();
      results = results.filter(
        (property) =>
          property.title.toLowerCase().includes(query) ||
          property.titleEn?.toLowerCase().includes(query) ||
          property.location.toLowerCase().includes(query) ||
          property.locationEn?.toLowerCase().includes(query) ||
          property.description?.toLowerCase().includes(query) ||
          property.descriptionEn?.toLowerCase().includes(query)
      );
    }

    // Property type filter
    if (filters.propertyTypes.length > 0) {
      results = results.filter((property) => filters.propertyTypes.includes(property.type));
    }

    // Bedrooms filter
    if (filters.bedrooms.length > 0) {
      results = results.filter((property) => filters.bedrooms.includes(property.bedrooms));
    }

    // Bathrooms filter
    if (filters.bathrooms.length > 0) {
      results = results.filter((property) => filters.bathrooms.includes(property.bathrooms));
    }

    // Price filter
    if (filters.minPrice) {
      results = results.filter((property) => property.price >= filters.minPrice!);
    }
    if (filters.maxPrice) {
      results = results.filter((property) => property.price <= filters.maxPrice!);
    }

    // Features filter
    if (filters.features.length > 0) {
      results = results.filter((property) => {
        return filters.features.some(feature => {
          switch (feature) {
            case 'parking':
              return !!(property as any).parking && (property as any).parking > 0;
            case 'garden':
              return !!(property as any).garden;
            case 'balcony':
              return !!(property as any).balcony;
            case 'elevator':
              return (property as any).amenities?.includes('Лифт') || (property as any).amenities?.includes('Elevator');
            case 'storage':
              return (property as any).amenities?.some((amenity: string) => 
                amenity.toLowerCase().includes('агуулах') || 
                amenity.toLowerCase().includes('storage')
              );
            default:
              return false;
          }
        });
      });
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'area':
        results.sort((a, b) => b.area - a.area);
        break;
      case 'newest':
      default:
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return results;
  }, [filters, sortBy, data]);

  const updateFilter = <K extends keyof PropertyFilters>(key: K, value: PropertyFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key: keyof PropertyFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: (prev[key] as any[]).includes(value)
        ? (prev[key] as any[]).filter((item: any) => item !== value)
        : [...(prev[key] as any[]), value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      propertyTypes: [],
      bedrooms: [],
      bathrooms: [],
      features: [],
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Үл хөдлөх хөрөнгө ачааллаж байна...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-4">⚠️ Алдаа гарлаа</div>
            <p className="text-gray-600">{error.message}</p>
            <p className="text-sm text-gray-500 mt-2">Mock дата ашиглаж байна</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Үл хөдлөх хөрөнгө</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Монголын бүх үл хөдлөх хөрөнгийн жагсаалт
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Шүүлтүүр</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 text-blue-600"
                >
                  <Filter className="h-5 w-5" />
                  Шүүлтүүр
                </button>
              </div>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Search */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Хайх
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Хот, дүүрэг, эсвэл газар хайх..."
                      value={filters.query}
                      onChange={(e) => updateFilter('query', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Төрөл</h3>
                  <div className="space-y-2">
                    {propertyTypes.map((type) => (
                      <label key={type.value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.propertyTypes.includes(type.value)}
                          onChange={() => toggleArrayFilter('propertyTypes', type.value)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Үнэ</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Доод</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={filters.minPrice || ''}
                        onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Дээд</label>
                      <input
                        type="number"
                        placeholder="1,000,000,000"
                        value={filters.maxPrice || ''}
                        onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Bedrooms */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Өрөө</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {bedroomOptions.map((beds) => (
                      <label key={beds} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.bedrooms.includes(beds)}
                          onChange={() => toggleArrayFilter('bedrooms', beds)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{beds} өрөө</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Bathrooms */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Ариун цэврийн өрөө</h3>
                  <div className="space-y-2">
                    {bathroomOptions.map((baths) => (
                      <label key={baths} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.bathrooms.includes(baths)}
                          onChange={() => toggleArrayFilter('bathrooms', baths)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{baths} өрөө</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Бусад</h3>
                  <div className="space-y-2">
                    {featureOptions.map((feature) => (
                      <label key={feature.value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.features.includes(feature.value)}
                          onChange={() => toggleArrayFilter('features', feature.value)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{feature.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={clearFilters}
                  className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Шүүлтүүрийг цэвэрлэх
                </button>
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-2xl font-bold text-gray-900">
                  Нийт: {filteredAndSortedProperties.length} үл хөдлөх
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Эрэмбэлэх:</label>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Properties Grid */}
            {filteredAndSortedProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 mb-6">
                  <Search className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Үр дүн олдсонгүй</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Таны хайлтын нөхцөлд тохирох үл хөдлөх хөрөнгө олдсонгүй. Шүүлтүүрээ өөрчилж дахин оролдоно уу.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PropertiesPage;