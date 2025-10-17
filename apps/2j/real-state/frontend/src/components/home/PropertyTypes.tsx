import { Home, Building, LandPlot, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PropertyTypes = () => {
  const types = [
    {
      icon: Home,
      title: 'Орон сууц',
      count: '2,500+',
      description: 'Орчин үеийн тоног төхөөрөмжтэй орон сууц',
    },
    {
      icon: Building,
      title: 'Гэр',
      count: '1,800+',
      description: 'Гэр бүлийн амрах газрын гэр',
    },
    {
      icon: LandPlot,
      title: 'Газар',
      count: '3,200+',
      description: 'Худалдаа, барилга барих газар',
    },
    {
      icon: TrendingUp,
      title: 'Оффис',
      count: '1,500+',
      description: 'Бизнес эрхлэх оффисын байр',
    },
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Үл хөдлөх хөрөнгийн төрлүүд</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Таны хэрэгцээнд тохирох бүх төрлийн үл хөдлөх хөрөнгийг олоорой
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {types.map((type, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 group-hover:bg-blue-200 transition-colors duration-200">
                <type.icon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{type.title}</h3>
              <div className="text-2xl font-bold text-blue-600 mb-2">{type.count}</div>
              <p className="text-gray-600 mb-4">{type.description}</p>
              <Button variant="outline" className="w-full">
                Дэлгэрэнгүй
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyTypes;
