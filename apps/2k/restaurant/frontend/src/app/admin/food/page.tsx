'use client';

import { Food } from '@/components/admin/food/Food';

const AdminFoodStyle: React.FC = () => {
  return (
    <div className="w-full flex justify-center bg-gray-50 min-h-screen py-6">
      <Food />
    </div>
  );
};

export default AdminFoodStyle;
