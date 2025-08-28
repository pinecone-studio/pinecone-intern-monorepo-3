import { Plus } from 'lucide-react';
import { useState } from 'react';

type Props = {
  onAddHotel: () => void;
};

export const TopBar = ({ onAddHotel }: Props) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-xl font-semibold">Hotels</h1>
      <button className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700" onClick={() => onAddHotel()}>
        <Plus className="h-4 w-4" />
        Add Hotel
      </button>{' '}
    </div>
  );
};
