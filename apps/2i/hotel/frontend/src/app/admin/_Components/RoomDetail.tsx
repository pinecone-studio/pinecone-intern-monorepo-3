'use client';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UpcomingBookings } from './UpcomingBookings';
import { RoomServices } from './RoomServices';
import { RoomGeneralInfos } from './RoomGeneralInfos';

export const RoomDetail = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-start gap-2">
        <Button variant="ghost" className="flex items-center gap-0 p-0">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold">Economy Single Room</h1>
      </div>

      {/* Components */}
      <RoomGeneralInfos />
      <UpcomingBookings />
      <RoomServices />
    </div>
  );
};
