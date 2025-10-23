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
  { id: 'change-password', label: 'Нууц үг солих', path: '/change-password' },
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
              className={`w-full rounded-[8px] px-[16px] py-[12px] text-left text-[14px] font-medium text-white transition-colors ${isActive ? 'bg-[#2a2a2a]' : 'bg-[#1a1a1a] hover:bg-[#2a2a2a]'}`}
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
