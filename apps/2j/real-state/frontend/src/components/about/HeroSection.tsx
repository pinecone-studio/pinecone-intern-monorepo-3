import { Users, Award, Heart, MapPin } from 'lucide-react';

const HeroSection = () => {
  const stats = [
    { number: '10,000+', label: 'Үл хөдлөх хөрөнгө', icon: MapPin },
    { number: '50,000+', label: 'Хэрэглэгч', icon: Users },
    { number: '15+', label: 'Жил туршлага', icon: Award },
    { number: '99%', label: 'Сэтгэл ханамж', icon: Heart },
  ];

  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Бидний тухай
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Монголын хамгийн том үл хөдлөх хөрөнгийн веб сайт. 
            Таны мөрөөдлийн байрыг олоход бид туслана.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
