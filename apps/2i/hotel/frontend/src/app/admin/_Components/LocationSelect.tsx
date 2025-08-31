'use client';
import { useGetHotelQuery } from '@/generated';
import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

type LocationSelectProps = {
  onChange?: (_val: string) => void;
};

export const LocationSelectWithSearch = ({ onChange }: LocationSelectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState('Locations');
  const containerRef = useRef<HTMLDivElement>(null);
  const { data } = useGetHotelQuery();
  const locations = data?.getHotel.map((hotel) => hotel?.location) as string[];

  const filteredLocations = locations?.filter((loc) => loc.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    onChange?.(val);
    setOpen(false);
    setSearch('');
  };

  return (
    <div ref={containerRef} className="relative w-[200px]">
      <button onClick={() => setOpen(!open)} className="w-full  border border-gray-300 rounded-sm px-3 py-2 flex justify-between items-center">
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
                handleSelect('All Locations');
                setSelected('All Locations');
              }}
            >
              All Locations
            </li>
            {filteredLocations.length > 0 ? (
              filteredLocations.map((loc, i) => (
                <li
                  key={i}
                  onClick={() => {
                    handleSelect(loc);
                    setSelected(loc);
                  }}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                >
                  {loc}
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
