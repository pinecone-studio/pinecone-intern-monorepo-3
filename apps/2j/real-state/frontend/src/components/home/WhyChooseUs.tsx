import { Shield, Clock, Users, Award } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: Shield,
      title: 'Найдвартай',
      description: 'Бид зөвхөн баталгаатай, шалгагдсан үл хөдлөх хөрөнгийг санал болгодог',
    },
    {
      icon: Clock,
      title: 'Хурдан',
      description: '24/7 үйлчилгээ, хамгийн хурдан мэдээлэл, шуурхай хариуцлага',
    },
    {
      icon: Users,
      title: 'Мэргэжлийн',
      description: '15 жилийн туршлагатай мэргэжилтнүүдээс бүрдсэн баг',
    },
    {
      icon: Award,
      title: 'Чанартай',
      description: 'Хэрэглэгчдийн сэтгэл ханамжийн 99% -ийн үнэлгээ',
    },
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Яагаад биднийг сонгох вэ?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Монголын хамгийн найдвартай, мэргэжлийн үл хөдлөх хөрөнгийн үйлчилгээ
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <feature.icon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
