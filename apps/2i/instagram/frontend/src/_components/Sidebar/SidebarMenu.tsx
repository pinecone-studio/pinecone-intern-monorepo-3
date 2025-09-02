import Image from 'next/image';
import { Heart, House, Search, SquarePlus } from 'lucide-react';
import { useState } from 'react';
import { CreatePostModal } from '../CreatePost/CreatePostModal';

type SidebarMenuProps = {
  isCollapsed: boolean;
  activePanel: 'search' | 'notification' | null;
  onExpandClick: () => void;
  onPanelToggle: (_: 'search' | 'notification') => void;
  onPostCreated?: () => void;
};

export const SidebarMenu = ({ isCollapsed, activePanel, onExpandClick, onPanelToggle, onPostCreated }: SidebarMenuProps) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handlePostCreated = () => {
    // Call the parent's onPostCreated function to refresh posts
    if (onPostCreated) {
      onPostCreated();
    }
  };

  return (
    <>
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-2">
          <MenuItem onClick={onExpandClick} icon={<House />} label="Home" isCollapsed={isCollapsed} />
          <MenuItem onClick={() => onPanelToggle('search')} icon={<Search />} label="Search" isCollapsed={isCollapsed} isActive={activePanel === 'search'} />
          <MenuItem onClick={() => onPanelToggle('notification')} icon={<Heart />} label="Notification" isCollapsed={isCollapsed} isActive={activePanel === 'notification'} />
          <MenuItem onClick={handleCreateClick} icon={<SquarePlus />} label="Create" isCollapsed={isCollapsed} />
          <MenuItem onClick={onExpandClick} icon={<Image src={'/pro1.jpg'} alt="profile" width={24} height={24} className="rounded-full" />} label="Profile" isCollapsed={isCollapsed} />
        </div>
      </div>

      <CreatePostModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onPostCreated={handlePostCreated} />
    </>
  );
};

type MenuItemProps = {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
  isActive?: boolean;
};

const MenuItem = ({ onClick, icon, label, isCollapsed, isActive = false }: MenuItemProps) => {
  return (
    <div onClick={onClick} className={`flex items-center h-12 cursor-pointer hover:text-pink-500 ${isActive ? 'text-pink-500' : ''}`}>
      {icon}
      {!isCollapsed && <p className="pl-4 text-sm">{label}</p>}
    </div>
  );
};
