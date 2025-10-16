/* eslint-disable complexity */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
'use client';

import { useState, useMemo } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import PropertyCard from '../components/PropertyCard';
import Footer from '../components/Footer';
import SearchBar, { SearchFilters } from '../components/SearchBar';
import { SAMPLE_PROPERTIES } from '../data/properties';
import { Building2, Home, Search, MapPin } from 'lucide-react';

const HomePage = () => {
  
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    propertyType: 'all',
    district: 'all',
  });
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Filter properties based on search criteria
  const filteredProperties = useMemo(() => {
    let results = [...SAMPLE_PROPERTIES];

    // Text search (query)
    if (searchFilters.query.trim()) {
      const query = searchFilters.query.toLowerCase();
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
    if (searchFilters.propertyType !== 'all') {
      results = results.filter((property) => property.type === searchFilters.propertyType);
    }

    // District filter
    if (searchFilters.district !== 'all') {
      results = results.filter((property) => {
        const locationLower = property.location.toLowerCase();
        const locationEnLower = property.locationEn?.toLowerCase() || '';
        const district = searchFilters.district.toLowerCase();
        
        // Map district values to location strings
        const districtMap: Record<string, string[]> = {
          'sukhbaatar': ['сүхбаатар', 'sukhbaatar'],
          'chingeltei': ['чингэлтэй', 'chingeltei'],
          'bayanzurkh': ['баянзүрх', 'bayanzurkh', 'бзд', 'bzd'],
          'bayangol': ['баянгол', 'bayangol'],
          'khan-uul': ['хан-уул', 'khan-uul', 'зайсан', 'zaisan'],
          'songinokhairkhan': ['сонгинохайрхан', 'songinokhairkhan', 'яармаг', 'yarmag'],
        };

        const searchTerms = districtMap[district] || [district];
        return searchTerms.some(
          (term) => locationLower.includes(term) || locationEnLower.includes(term)
        );
      });
    }

    // Bedrooms filter
    if (searchFilters.bedrooms) {
      results = results.filter((property) => property.bedrooms >= searchFilters.bedrooms!);
    }

    // Price range filter
    if (searchFilters.minPrice) {
      results = results.filter((property) => property.price >= searchFilters.minPrice!);
    }
    if (searchFilters.maxPrice) {
      results = results.filter((property) => property.price <= searchFilters.maxPrice!);
    }

    return results;
  }, [searchFilters]);

  // Get featured properties
  const featuredProperties = SAMPLE_PROPERTIES.filter(p => p.featured);
  const recentProperties = SAMPLE_PROPERTIES.slice(0, 6);

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    setIsSearchActive(
      filters.query !== '' ||
      filters.propertyType !== 'all' ||
      filters.district !== 'all' ||
      filters.bedrooms !== undefined ||
      filters.minPrice !== undefined ||
      filters.maxPrice !== undefined
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />

      {/* Search Section */}
      <section className="py-12 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">Find Your Perfect Property</h2>
            </div>
          </div>
          <SearchBar onSearch={handleSearch} totalResults={isSearchActive ? filteredProperties.length : undefined} />
        </div>
      </section>

      {/* Search Results or Default Sections */}
      {isSearchActive ? (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 mb-6">
                  <Search className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No Properties Found</h3>
                <p className="text-gray-600 max-w-md mx-auto">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        </section>
      ) : (
        <>
          {/* Featured Properties */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center mb-4">
                  <Building2 className="h-8 w-8 text-yellow-500 mr-2" />
                  <h2 className="text-3xl font-bold text-gray-900">Featured Properties</h2>
                </div>
                <p className="text-xl text-gray-600">Hand-picked premium properties</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </div>
          </section>

          {/* All Properties Section */}
          <section className="py-16 bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center mb-4">
                  <Home className="h-8 w-8 text-blue-600 mr-2" />
                  <h2 className="text-3xl font-bold text-gray-900">Recent Properties</h2>
                </div>
                <p className="text-xl text-gray-600">Latest additions to our collection</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Location Overview - Static Display */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <MapPin className="h-8 w-8 text-blue-600 mr-2" />
              <h2 className="text-3xl font-bold text-gray-900">
                Улаанбаатарын дүүргүүд
              </h2>
            </div>
            <p className="text-xl text-gray-600">
              Бид 6 дүүрэгт үйлчилгээ үзүүлдэг
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { name: 'Сүхбаатар', count: 3, icon: '🏛️' },
              { name: 'Баянзүрх', count: 3, icon: '🏘️' },
              { name: 'Чингэлтэй', count: 2, icon: '🏢' },
              { name: 'Хан-Уул', count: 1, icon: '⛰️' },
              { name: 'Баянгол', count: 2, icon: '🏡' },
              { name: 'Сонгинохайрхан', count: 1, icon: '🌳' },
            ].map((district) => (
              <div
                key={district.name}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-blue-100"
              >
                <div className="text-4xl mb-3">{district.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{district.name}</h3>
                <p className="text-blue-600 font-semibold">{district.count} үл хөдлөх хөрөнгө</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-xl text-gray-600">Your trusted real estate partner</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Local Expertise</h3>
              <p className="text-gray-600">Deep knowledge of Ulaanbaatar&apos;s market</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Trusted Service</h3>
              <p className="text-gray-600">Reliable and professional support</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Results</h3>
              <p className="text-gray-600">Quick and efficient property search</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;