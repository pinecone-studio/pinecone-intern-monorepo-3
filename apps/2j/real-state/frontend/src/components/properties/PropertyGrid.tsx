import { Property } from '@/types/property';
import PropertyCard from '@/components/PropertyCard';

interface PropertyGridProps {
  properties: Property[];
  viewMode: 'grid' | 'list';
}

const PropertyGrid = ({ properties, viewMode }: PropertyGridProps) => {
  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">
          Хайлтын үр дүнд тохирох үл хөдлөх хөрөнгө олдсонгүй
        </div>
        <p className="text-gray-400">
          Өөр хайлтын нөхцөл ашиглаж үзээрэй
        </p>
      </div>
    );
  }

  return (
    <div className={
      viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        : 'space-y-4'
    }>
      {properties.map((property) => (
        <PropertyCard 
          key={property.id} 
          property={property}
        />
      ))}
    </div>
  );
};

export default PropertyGrid;
