'use client';

import { TabsDemo } from '@/components/admin/menu/Menu';

const AdminMenuStyle: React.FC = () => {
  return (
    <div className="w-full flex justify-center bg-gray-50 min-h-screen py-6">
      <TabsDemo />
    </div>
  );
};

export default AdminMenuStyle;
