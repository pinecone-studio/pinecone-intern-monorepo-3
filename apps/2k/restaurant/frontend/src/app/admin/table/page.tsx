'use client';

import { TableGrid } from '@/components/admin/table/TableGrid';

const AdminTableStyle: React.FC = () => {
  return (
    <div className="w-full flex justify-center bg-gray-50 min-h-screen">
      <TableGrid />
    </div>
  );
};

export default AdminTableStyle;
