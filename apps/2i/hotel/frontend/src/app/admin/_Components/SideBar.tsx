import { Home, Users, ChevronDown } from 'lucide-react';
import Image from 'next/image';

interface SidebarProps {
  onNavigate: (_page: 'hotels' | 'guests') => void;
}
export const AppSidebar = ({ onNavigate }: SidebarProps) => {
  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="flex items-center gap-3 px-4 py-5 border-b">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 text-white font-bold">P</div>
        <div>
          <h2 className="font-semibold text-gray-900">Pedia</h2>
          <p className="text-xs text-gray-500">Admin</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4">
        <h3 className="mb-2 px-2 text-xs font-semibold text-gray-400 uppercase">Menu</h3>
        <ul className="space-y-1">
          <li>
            <button onClick={() => onNavigate('hotels')} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <Home className="h-4 w-4" />
              Hotels
            </button>
          </li>
          <li>
            <button onClick={() => onNavigate('guests')} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <Users className="h-4 w-4" />
              Guests
            </button>
          </li>
        </ul>
      </nav>

      <div className="flex items-center justify-between border-t px-3 py-4">
        <div className="flex items-center gap-2">
          <Image src="/avatar.png" alt="admin" width={32} height={32} className="rounded-full" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">admin</span>
            <span className="text-xs text-gray-500">admin@pedia.com</span>
          </div>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </div>
    </aside>
  );
};
