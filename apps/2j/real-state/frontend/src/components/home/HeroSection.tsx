import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Мөрөөдлийн байраа олоорой
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
            Монголын хамгийн том үл хөдлөх хөрөнгийн веб сайт. 
            Орон сууц, гэр, оффис, газар - бүгдийг эндээс олоорой.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Хайх үг, байршил, төрөл..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <select className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Бүх дүүрэг</option>
                    <option value="sukhbaatar">Сүхбаатар дүүрэг</option>
                    <option value="khan-uul">Хан-Уул дүүрэг</option>
                    <option value="chingeltei">Чингэлтэй дүүрэг</option>
                    <option value="bayangol">Баянгол дүүрэг</option>
                    <option value="songinokhairkhan">Сонгинохайрхан дүүрэг</option>
                  </select>
                </div>
              </div>
              <div>
                <Button className="w-full py-3 text-lg">
                  Хайх
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
