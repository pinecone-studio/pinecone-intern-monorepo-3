import { ArrowLeft, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Property } from '@/types/property';
import { formatPrice } from '@/lib/currency';

interface PropertyHeaderProps {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const PropertyHeader = ({ property, isFavorite, onToggleFavorite }: PropertyHeaderProps) => {
  const renderBackButton = () => (
    <Link href="/properties">
      <Button variant="outline" size="sm">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Буцах
      </Button>
    </Link>
  );

  const renderPropertyInfo = () => (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
      <p className="text-gray-600">{property.location}</p>
    </div>
  );

  const renderActionButtons = () => (
    <div className="flex items-center gap-2">
      {property.featured && (
        <Badge className="bg-yellow-500 text-white">
          Онцлох
        </Badge>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={onToggleFavorite}
        className={isFavorite ? 'text-red-500 border-red-500' : ''}
      >
        <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
        {isFavorite ? 'Хасах' : 'Хадгалах'}
      </Button>
      <Button variant="outline" size="sm">
        <Share2 className="h-4 w-4 mr-2" />
        Хуваалцах
      </Button>
    </div>
  );

  const renderPriceInfo = () => (
    <div className="mt-4">
      <div className="text-3xl font-bold text-blue-600">
        {formatPrice(property.price)}
      </div>
      <div className="text-sm text-gray-500">
        {property.status || 'Худалдаанд'}
      </div>
    </div>
  );

  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {renderBackButton()}
            {renderPropertyInfo()}
          </div>
          {renderActionButtons()}
        </div>
        {renderPriceInfo()}
      </div>
    </div>
  );
};

export default PropertyHeader;
