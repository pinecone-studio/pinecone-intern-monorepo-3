'use client';

import { AppSidebar } from './_Components/SideBar';
import { PanelLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex-1 bg-[#f3f4f6] p-4">
        <div className="flex items-center px-5 gap-3 border-b mb-4">
          <PanelLeft size={18} color="gray" />
          <span className="text-gray-300">|</span>
          <h2 className="text-gray-500 capitalize">{pathname.split('/').pop()}</h2>
        </div>

        {children}
      </div>
    </div>
  );
};
export default AdminLayout;
