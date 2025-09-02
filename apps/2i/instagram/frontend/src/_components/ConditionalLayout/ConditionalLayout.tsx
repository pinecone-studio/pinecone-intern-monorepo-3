'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from '@/_components/Sidebar/Sidebar';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export const ConditionalLayout = ({ children }: ConditionalLayoutProps) => {
  const pathname = usePathname();

  // Sidebar харагдахгүй хуудсууд
  const noSidebarRoutes = ['/login', '/signup', '/forgot'];

  const shouldShowSidebar = !noSidebarRoutes.includes(pathname);

  if (shouldShowSidebar) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="pl-20 md:pl-64 transition-all duration-300">{children}</main>
      </div>
    );
  }

  return <>{children}</>;
};
