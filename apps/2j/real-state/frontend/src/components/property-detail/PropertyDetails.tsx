import { Bed, Bath, Square, Car, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Property } from '@/types/property';

interface PropertyDetailsProps {
  property: Property;
}

const PropertyDetails = ({ property }: PropertyDetailsProps) => {
  const details = [
    { icon: Bed, label: 'Унтлагын өрөө', value: `${property.bedrooms} өрөө` },
    { icon: Bath, label: 'Угаалгын өрөө', value: `${property.bathrooms} өрөө` },
    { icon: Square, label: 'Талбай', value: `${property.area} м²` },
    { icon: Car, label: 'Зогсоол', value: property.parking ? `${property.parking} байр` : 'Байхгүй' },
    { icon: Calendar, label: 'Баригдсан', value: property.yearBuilt?.toString() || 'Тодорхойгүй' },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Үндсэн мэдээлэл</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {details.map((detail, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <detail.icon className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">{detail.label}</div>
                <div className="font-medium text-gray-900">{detail.value}</div>
              </div>
            </div>
          ))}
        </div>
        
        <Separator className="my-6" />
        
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-3">Онцлог шинж чанар</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {property.features?.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                {feature}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyDetails;
