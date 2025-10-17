import { Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PropertyToolbarProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (_mode: 'grid' | 'list') => void;
  sortBy: string;
  onSortChange: (_sort: string) => void;
  totalCount: number;
}

const PropertyToolbar = ({ 
  viewMode, 
  onViewModeChange, 
  sortBy, 
  onSortChange, 
  totalCount 
}: PropertyToolbarProps) => {
  const sortOptions = [
    { value: 'newest', label: 'Шинээс эхлэх' },
    { value: 'oldest', label: 'Хуучин эхлэх' },
    { value: 'price-low', label: 'Үнэ: Багаас их' },
    { value: 'price-high', label: 'Үнэ: Ихээс бага' },
    { value: 'area-low', label: 'Талбай: Багаас их' },
    { value: 'area-high', label: 'Талбай: Ихээс бага' },
  ];

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4">
      <div className="text-sm text-gray-600">
        Нийт {totalCount} үл хөдлөх хөрөнгө олдлоо
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Эрэмбэлэх:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center border border-gray-300 rounded-md">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
            className="rounded-r-none"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('list')}
            className="rounded-l-none"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyToolbar;
