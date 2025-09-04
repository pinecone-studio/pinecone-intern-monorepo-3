'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const TopBar = () => {
  const router = useRouter();
  const handleCreateHotel = () => {
    router.push('/admin/hotels/create-hotel');
  };
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-xl font-semibold">Hotels</h1>
      <Button variant="hotel" onClick={handleCreateHotel}>
        <Plus className="h-4 w-4" />
        Add Hotel
      </Button>
    </div>
  );
};
