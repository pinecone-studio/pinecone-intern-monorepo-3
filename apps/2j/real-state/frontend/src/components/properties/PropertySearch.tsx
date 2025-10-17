'use client';

import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchFilters from '@/components/SearchFilters';

interface PropertySearchProps {
  searchQuery: string;
  onSearchChange: (_query: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  onFiltersChange: (_filters: Record<string, string>) => void;
}

const PropertySearch = ({ 
  searchQuery, 
  onSearchChange, 
  showFilters, 
  onToggleFilters,
  onFiltersChange 
}: PropertySearchProps) => {
  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Хайх үг, байршил, төрөл..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <Button
            variant="outline"
            onClick={onToggleFilters}
            className="flex items-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            Шүүлтүүр
          </Button>
        </div>
        
        {showFilters && (
          <div className="mt-4">
            <SearchFilters 
              onClose={onToggleFilters}
              onFilterChange={onFiltersChange} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertySearch;
