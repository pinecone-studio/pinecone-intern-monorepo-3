import { Card, CardContent } from '@/components/ui/card';

interface PropertyDescriptionProps {
  description: string;
}

const PropertyDescription = ({ description }: PropertyDescriptionProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Тайлбар</h3>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export default PropertyDescription;
