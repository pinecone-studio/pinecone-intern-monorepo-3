'use client';
import { Header } from '@/components/Header';
import { ActiveOrderContent } from '@/components/sheet/ActiveOrder';
import { useRouter } from 'next/navigation';

const page = () => {
  const router = useRouter();

  return (
    <div>
      <Header />
      <ActiveOrderContent onBack={() => router.back()} />
    </div>
  );
};

export default page;
