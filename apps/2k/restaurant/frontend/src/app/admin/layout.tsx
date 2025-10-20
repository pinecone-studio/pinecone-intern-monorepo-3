'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const tabs = [
    { name: 'Захиалга', href: '/admin/order' },
    { name: 'Цэс', href: '/admin/menu' },
    { name: 'Хоол', href: '/admin/food' },
    { name: 'Ширээ', href: '/admin/table' },
  ];

  return (
    <div className="p-4 min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex space-x-4 border-b mb-4">
        {tabs.map((tab) => (
          <Link key={tab.name} href={tab.href} className={`px-4 py-2 ${pathname === tab.href ? 'border-b-2 border-blue-500 font-bold' : ''}`}>
            {tab.name}
          </Link>
        ))}
      </nav>

      {/* Child pages (centered) */}
      <main className="flex-1 flex justify-center items-start">{children}</main>
    </div>
  );
};

export default AdminLayout;
