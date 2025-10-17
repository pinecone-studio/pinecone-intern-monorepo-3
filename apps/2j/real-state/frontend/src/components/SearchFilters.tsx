'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PriceFilter from '@/components/filters/PriceFilter';
import AreaFilter from '@/components/filters/AreaFilter';
import RoomsFilter from '@/components/filters/RoomsFilter';
import TypeLocationFilter from '@/components/filters/TypeLocationFilter';

interface SearchFiltersProps {
  onClose: () => void;
  onFilterChange?: (_filters: Record<string, string>) => void;
}

const SearchFilters = ({ onClose, onFilterChange }: SearchFiltersProps) => {
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    areaMin: '',
    areaMax: '',
    bedrooms: '',
    bathrooms: '',
    propertyType: 'all',
    location: '',
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplyFilters = () => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
    onClose();
  };

  const handleClearFilters = () => {
    setFilters({
      priceMin: '',
      priceMax: '',
      areaMin: '',
      areaMax: '',
      bedrooms: '',
      bathrooms: '',
      propertyType: 'all',
      location: '',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Шүүлтүүр</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          <PriceFilter
            priceMin={filters.priceMin}
            priceMax={filters.priceMax}
            onPriceChange={handleFilterChange}
          />
          
          <AreaFilter
            areaMin={filters.areaMin}
            areaMax={filters.areaMax}
            onAreaChange={handleFilterChange}
          />
          
          <RoomsFilter
            bedrooms={filters.bedrooms}
            bathrooms={filters.bathrooms}
            onRoomsChange={handleFilterChange}
          />
          
          <TypeLocationFilter
            propertyType={filters.propertyType}
            location={filters.location}
            onTypeLocationChange={handleFilterChange}
          />
        </div>

        <div className="flex gap-3 mt-8">
          <Button onClick={handleApplyFilters} className="flex-1">
            Хэрэглэх
          </Button>
          <Button variant="outline" onClick={handleClearFilters} className="flex-1">
            Цэвэрлэх
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;