'use client';

import { useState } from 'react';
import { AppSidebar } from './_Components/SideBar';
import { HotelsPage } from './_Components/HotelsPage';
import { GuestsPage } from './_Components/GuestsPage';
import { PanelLeft } from 'lucide-react';

export default function AdminPage() {
  const [activePage, setActivePage] = useState<'hotels' | 'guests'>('hotels');

  return (
    <div className="flex h-screen">
      <div className="">
        <AppSidebar onNavigate={setActivePage} />
      </div>

      <div className="flex-1 items-center justify-center bg-[#f3f4f6] p-4">
        <div className="flex items-center px-5 gap-3 border-b  ">
          <PanelLeft size={18} color="gray" />
          <span className="text-gray-300">|</span>
          <h2 className="text-gray-500">Hotels</h2>
        </div>
        {activePage === 'hotels' && <HotelsPage />}
        {activePage === 'guests' && <GuestsPage />}
      </div>
    </div>
  );
}
