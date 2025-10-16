import Image from 'next/image';

const MissionSection = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Бидний зорилго</h2>
            <p className="text-lg text-gray-700 mb-6">
              RealEstate.mn нь 2009 онд байгуулагдсан бөгөөд Монголын үл хөдлөх хөрөнгийн 
              салбарт шилдэг үйлчилгээ үзүүлэх зорилготой. Бид хэрэглэгчдэд хамгийн тохиромжтой, 
              найдвартай, хурдан үйлчилгээ үзүүлэхэд анхаардаг.
            </p>
            <p className="text-lg text-gray-700">
              Манай баг нь 15 жилийн туршлагатай мэргэжилтнүүдээс бүрддэг бөгөөд 
              хэрэглэгч бүрийн хэрэгцээг хангахын тулд тасралтгүй ажиллаж байна.
            </p>
          </div>
          <div className="relative">
            <Image
              src="/api/placeholder/600/400"
              alt="About us"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionSection;
