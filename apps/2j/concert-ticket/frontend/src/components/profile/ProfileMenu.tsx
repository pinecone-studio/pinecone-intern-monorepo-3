'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface MenuItem {
  id: string;
  label: string;
  path: string;
}

const menuItems: MenuItem[] = [
  { id: 'profile', label: 'Хэрэглэгчийн мэдээлэл', path: '/profile' },
  { id: 'orders', label: 'Захиалгын түүх', path: '/orders' },
  { id: 'forgot-password', label: 'Нууц үг сэргээх', path: '/forgot-password' }
];

const ProfileMenu: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleMenuClick = (path: string) => {
    router.push(path);
  };

  return (
    <div className="w-[280px]">
      <nav className="space-y-[8px]">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          
          return (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.path)}
              className={`w-full rounded-[8px] px-[16px] py-[12px] text-left text-[14px] transition-colors ${
                isActive
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default ProfileMenu;
