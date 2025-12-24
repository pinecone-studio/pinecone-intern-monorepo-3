import Image from 'next/image';
import { Heart, House, MessageCircle, Search, SquarePlus, User } from 'lucide-react';
import Link from 'next/link';
import { CreatePostModal } from '../Feed/CreatePostModal';
import { useEffect, useRef, useState } from 'react';
import { useGetNotificationsQuery } from '@/generated';
// import { useEffect, useState } from 'react';
// import { useGetUserQuery } from '@/generated';

type SidebarMenuProps = {
  isCollapsed: boolean;
  activePanel: 'search' | 'notification' | null;
  onExpandClick: () => void;
  onPanelToggle: (_: 'search' | 'notification') => void;
};

export const SidebarMenu = ({ isCollapsed, activePanel, onExpandClick, onPanelToggle }: SidebarMenuProps) => {
  const [userId, setUserId] = useState<string>('');
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserId(payload.userId);
    } catch (err) {
      console.error('Invalid token', err);
    }
  }, []);
  const { data } = useGetNotificationsQuery({
    variables: {
      userId,
    },
    skip: !userId, // userId байхгүй бол query хийхгүй
  });
  console.log('Notifications data:', data);

  const commentCount = data?.getNotifications?.filter((n) => n.type === 'comment').length ?? 0;
  const followCount = data?.getNotifications?.filter((n) => n.type === 'follow').length ?? 0;
  const hasNotification = commentCount > 0 || followCount > 0;

  const [showBubble, setShowBubble] = useState(hasNotification && activePanel !== 'notification');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Bubble fade-out logic
  useEffect(() => {
    if (showBubble) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setShowBubble(false), 5000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [showBubble, commentCount, followCount, activePanel !== 'notification']);

  // Хэрэглэгчийн үйлдэл бүрт bubble-ийг дахин харуулах функц
  const onUserAction = () => {
    if (hasNotification && activePanel !== 'notification') {
      setShowBubble(false); // reset for animation
      setTimeout(() => setShowBubble(true), 1000); // trigger fade-in
    }
  };
  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-2">
        <Link href={'/'}>
          <MenuItem
            onClick={() => {
              onExpandClick();
              onUserAction();
            }}
            icon={<House />}
            label="Home"
            isCollapsed={isCollapsed}
          />
        </Link>
        <MenuItem
          onClick={() => {
            onPanelToggle('search');
            onUserAction();
          }}
          icon={<Search />}
          label="Search"
          isCollapsed={isCollapsed}
          isActive={activePanel === 'search'}
        />
        <div className="relative">
          <MenuItem
            onClick={() => {
              onPanelToggle('notification');
              onUserAction();
            }}
            icon={
              <span className="relative">
                <Heart />
                {hasNotification && activePanel !== 'notification' && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />}
              </span>
            }
            label="Notification"
            isCollapsed={isCollapsed}
            isActive={activePanel === 'notification'}
          />
          {hasNotification && activePanel !== 'notification' && activePanel !== 'search' && (
            <div
              className={`absolute right-[-40px] top-1 flex items-center bg-red-500 rounded-full px-4 py-1 shadow z-10 transition-opacity duration-1000 ease-in-out ${
                showBubble ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              // style={{ minWidth: '90px', justifyContent: 'center' }}
            >
              <span className="relative z-10 flex items-center">
                {commentCount > 0 && (
                  <span className="flex items-center mr-3">
                    <MessageCircle className="w-5 h-5 text-white" />
                    <span className="ml-1 text-white font-semibold">{commentCount}</span>
                  </span>
                )}
                {followCount > 0 && (
                  <span className="flex items-center">
                    <User className="w-5 h-5 text-white" />
                    <span className="ml-1 text-white font-semibold">{followCount}</span>
                  </span>
                )}
              </span>
            </div>
          )}
        </div>

        <CreatePostModal isCollapsed={isCollapsed} />
        <Link href={'/profile'}>
          <MenuItem onClick={onExpandClick} icon={<Image src={'/pro1.jpg'} alt="profile" width={24} height={24} className="rounded-full" />} label="Profile" isCollapsed={isCollapsed} />
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
