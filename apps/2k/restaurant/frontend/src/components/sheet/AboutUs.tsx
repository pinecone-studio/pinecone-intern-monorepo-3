import Image from 'next/image';

const AboutUsComponent = () => {
  return (
    <div data-cy="About-Us" className="flex flex-col items-center justify-center w-full h-full">
      <div className="w-[343px] h-[32px] text-center mb-3">
        <p className="text-[#521c0d] text-[20px] font-[100px]">Бидний тухай</p>
      </div>
      <div className="w-[360px] h-[180px]">
        <Image className="rounded-md w-[360px] h-[200px] object-cover" alt="" height={180} width={360} src={'https://i.pinimg.com/1200x/ed/e8/4b/ede84bde439283420a9208539bf6790c.jpg'} />
      </div>
      <div>
        <p className="font-light text-[14px] px-4 pt-10">
          Манай Мексик хоолны газар нь Мексикийн баялаг соёл, амттай хоолны урлагийг Монголд хүргэх зорилгоор үүсгэн байгуулагдсан. Бид амт чанартай, цэвэр, шинэхэн түүхий эдээр бэлтгэсэн уламжлалт
          Мексик хоолнуудыг та бүхэнд хүргэж байна.
        </p>
        <p className="font-light text-[14px] px-4 pt-10">
          Манай хоолны цэсэнд алдартай тако, буррито, начос зэрэг Мексикийн үндсэн хоолнууд багтсан бөгөөд, бид Мексикийн жинхэнэ амтыг танд мэдрүүлэхийн тулд жор болон бэлтгэлийн арга технологид маш
          их анхаарал хандуулдаг. Хамгийн амттай, анхилам үнэрт халуун ногоотой, шорвог амт нь таныг Мексикийн соёлд аялж байгаа мэт сэтгэгдэл төрүүлэх болно.
        </p>
        <p className="font-light text-[14px] px-4 pt-10">
          Бидний зорилго бол үйлчлүүлэгчдэдээ зөвхөн амттай хоолоор үйлчлэхээс гадна тэднийг халуун дулаан, гэр бүл шигээ орчинд тав тухтай байлгах юм. Танд Мексикийн амттай хоол, хөгжилтэй уур
          амьсгал болон манай найрсаг үйлчилгээг мэдрүүлэхээр бид өдөр бүр хичээнгүйлэн ажилладаг.
        </p>
      </div>
    </div>
  );
};

export default AboutUsComponent;