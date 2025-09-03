'use client';

import { AppSidebar } from './_Components/SideBar';
import { PanelLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-700 via-red-400 to-gray-800">
      <AppSidebar />

      <div className="flex-1 p-4 ">
        <div className="flex items-center px-5 gap-3 border-b mb-4">
          <PanelLeft size={18} color="black" />
          <span className="text-black">|</span>
          <h2 className="text-black capitalize">{pathname.split('/').pop()}</h2>
        </div>

        {children}
      </div>
    </div>
  );
};
export default AdminLayout;
