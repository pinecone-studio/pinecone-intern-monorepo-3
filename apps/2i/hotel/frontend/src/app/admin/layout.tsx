'use client';

import { PropsWithChildren, useState } from 'react';
import { AppSidebar } from './_Components/SideBar';
import { PanelLeft } from 'lucide-react';

const RootLayout = ({ children }: PropsWithChildren) => {
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
        {children}
      </div>
    </div>
  );
};

export default RootLayout;
