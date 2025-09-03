import Image from 'next/image';
import { Heart, House, Search, SquarePlus } from 'lucide-react';
import Link from 'next/link';
// import { useEffect, useState } from 'react';
// import { useGetUserQuery } from '@/generated';

type SidebarMenuProps = {
  isCollapsed: boolean;
  activePanel: 'search' | 'notification' | null;
  onExpandClick: () => void;
  onPanelToggle: (_: 'search' | 'notification') => void;
};

export const SidebarMenu = ({ isCollapsed, activePanel, onExpandClick, onPanelToggle }: SidebarMenuProps) => {
//  const [userId, setUserId] = useState<string | null>(null);

// const [getUser,{data}]= useGetUserQuery()
// useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) return;
//     try {
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       setUserId(payload.userId);
//     } catch (err) {
//       console.error("Invalid token", err);
//     }
//   }, []);


//   const { data } = useGetUserQuery({
//     skip: !userId,
//     variables: { id: userId! }
//   });
  
// const user = data?.getuser;
// user?.profilePicture || 
  
  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-2">
        <Link href={"/"}>
        <MenuItem onClick={onExpandClick} icon={<House />} label="Home" isCollapsed={isCollapsed} />
        </Link>
        <MenuItem onClick={() => onPanelToggle('search')} icon={<Search />} label="Search" isCollapsed={isCollapsed} isActive={activePanel === 'search'} />
        <MenuItem onClick={() => onPanelToggle('notification')} icon={<Heart />} label="Notification" isCollapsed={isCollapsed} isActive={activePanel === 'notification'} />
        <MenuItem onClick={onExpandClick} icon={<SquarePlus />} label="Create" isCollapsed={isCollapsed} />
        <Link href={"/profile"}>
        <MenuItem onClick={onExpandClick} icon={ <Image
        src={'/pro1.jpg'} 
        alt="profile"
        width={24}
        height={24}
        className="rounded-full"
      />} label="Profile" isCollapsed={isCollapsed}/>
        </Link>
      </div>
    </div>
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
