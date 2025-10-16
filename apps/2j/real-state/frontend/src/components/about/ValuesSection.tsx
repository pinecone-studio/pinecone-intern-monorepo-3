import { Target, Heart, Award } from 'lucide-react';

const ValuesSection = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Бидний үнэт зүйлс</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Бид хэрэглэгчдэд хамгийн сайн үйлчилгээ үзүүлэхэд анхаардаг
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Target className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Найдвартай байдал</h3>
            <p className="text-gray-600">
              Бид хэрэглэгчдэд найдвартай, бодитой мэдээлэл өгч, 
              хамгийн сайн үйлчилгээ үзүүлдэг.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Heart className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Хэрэглэгчийн сэтгэл ханамж</h3>
            <p className="text-gray-600">
              Хэрэглэгч бүрийн хэрэгцээг ойлгож, тэдэнд хамгийн тохиромжтой 
              шийдлийг санал болгодог.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Award className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Мэргэжлийн чанар</h3>
            <p className="text-gray-600">
              Манай баг нь үл хөдлөх хөрөнгийн салбарт мэргэшсэн 
              мэргэжилтнүүдээс бүрддэг.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValuesSection;
