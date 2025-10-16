import { Property } from '@/types/property';
import { PropertyCard } from '@/components';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface RecentPropertiesProps {
  properties: Property[];
}

const RecentProperties = ({ properties }: RecentPropertiesProps) => {
  const recentProperties = properties.slice(0, 6);

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Сүүлийн нэмэгдсэн</h2>
            <p className="text-lg text-gray-600">
              Саяхан нэмэгдсэн шинэ үл хөдлөх хөрөнгө
            </p>
          </div>
          <Button variant="outline" className="flex items-center">
            Бүгдийг харах
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentProperties;
