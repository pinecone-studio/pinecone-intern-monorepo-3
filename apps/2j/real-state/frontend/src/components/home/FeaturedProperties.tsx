import { Property } from '@/types/property';
import { PropertyCard } from '@/components';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

interface FeaturedPropertiesProps {
  properties: Property[];
}

const FeaturedProperties = ({ properties }: FeaturedPropertiesProps) => {
  const featuredProperties = properties.filter(property => property.featured);

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Star className="h-8 w-8 text-yellow-500 mr-2" />
            <h2 className="text-3xl font-bold text-gray-900">Онцлох үл хөдлөх хөрөнгө</h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Манай сайтад хамгийн их анхаарал татаж буй шилдэг үл хөдлөх хөрөнгө
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((property) => (
            <div key={property.id} className="relative">
              <PropertyCard property={property} />
              <div className="absolute top-4 left-4">
                <Badge className="bg-yellow-500 text-white">
                  <Star className="h-4 w-4 mr-1" />
                  Онцлох
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProperties;
