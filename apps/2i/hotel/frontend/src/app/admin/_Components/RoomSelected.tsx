'use client';
import { useGetHotelQuery } from '@/generated';
import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

type LocationSelectProps = {
  onChange?: (_val: string) => void;
};

export const RoomTypeSelect = ({ onChange }: LocationSelectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState('Room Type');
  const containerRef = useRef<HTMLDivElement>(null);
  const { data, loading } = useGetHotelQuery();

  const rooms = data?.getHotel.flatMap((hotel) => hotel?.rooms?.map((room) => room?.roomType)) as string[];
  const filteredRooms = rooms.filter((room) => room.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  if (loading) return <p>Loading...</p>;

  const handleSelect = (val: string) => {
    setSelected(val);
    onChange?.(val);
    setOpen(false);
    setSearch('');
  };

  return (
    <div ref={containerRef} className="relative w-[200px]">
      <button onClick={() => setOpen(!open)} className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 flex justify-between items-center">
        {selected}
        <span className="ml-2">
          <ChevronDown size={20} />
        </span>
      </button>

      {open && (
        <div className="absolute bg-white w-full border border-gray-300 rounded-sm mt-1 shadow-lg z-10">
          <input type="text" placeholder="Search option..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full px-3 py-2 border-b border-gray-200 focus:outline-none" />
          <ul className="max-h-40 overflow-y-auto">
            <li
              className="px-3 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                handleSelect('All Room');
                setSelected('All Room');
              }}
            >
              All Room
            </li>
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room) => (
                <li
                  key={room}
                  onClick={() => {
                    handleSelect(room);
                  }}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                >
                  {room}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-gray-400">No locations found.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
