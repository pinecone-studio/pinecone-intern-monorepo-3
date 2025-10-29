import Image from 'next/image';

const AboutUsComponent = () => {
  return (
    <div data-cy="About-Us" className="flex flex-col items-center justify-center min-h-screen bg-[#fff8f5]">
      {/* Fixed mobile-width container */}
      <div className="w-[390px] border border-gray-200 shadow-md bg-white rounded-lg overflow-hidden">
        <div className="w-full text-center my-4">
          <p className="text-[#521c0d] text-[20px] font-semibold">Бидний тухай</p>
        </div>

        <div className="w-full h-[200px]">
          <Image className="rounded-md object-cover w-full h-[200px]" alt="about us" height={200} width={360} src="https://i.pinimg.com/1200x/ed/e8/4b/ede84bde439283420a9208539bf6790c.jpg" />
        </div>

        <div className="px-4 py-6">
          <p className="font-light text-[14px] mb-6">
            Манай Мексик хоолны газар нь Мексикийн баялаг соёл, амттай хоолны урлагийг Монголд хүргэх зорилгоор үүсгэн байгуулагдсан. Бид амт чанартай, цэвэр, шинэхэн түүхий эдээр бэлтгэсэн уламжлалт
            Мексик хоолнуудыг та бүхэнд хүргэж байна.
          </p>
          <p className="font-light text-[14px] mb-6">
            Манай хоолны цэсэнд алдартай тако, буррито, начос зэрэг Мексикийн үндсэн хоолнууд багтсан бөгөөд, бид Мексикийн жинхэнэ амтыг танд мэдрүүлэхийн тулд жор болон бэлтгэлийн арга технологид
            маш их анхаарал хандуулдаг. Хамгийн амттай, анхилам үнэрт халуун ногоотой, шорвог амт нь таныг Мексикийн соёлд аялж байгаа мэт сэтгэгдэл төрүүлэх болно.
          </p>
          <p className="font-light text-[14px]">
            Бидний зорилго бол үйлчлүүлэгчдэдээ зөвхөн амттай хоолоор үйлчлэхээс гадна тэднийг халуун дулаан, гэр бүл шигээ орчинд тав тухтай байлгах юм. Танд Мексикийн амттай хоол, хөгжилтэй уур
            амьсгал болон манай найрсаг үйлчилгээг мэдрүүлэхээр бид өдөр бүр хичээнгүйлэн ажилладаг.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUsComponent;
