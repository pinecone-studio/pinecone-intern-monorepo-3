'use client';
import { useState } from 'react';
import { AlignJustify } from 'lucide-react';
import { SidebarHeader } from './SidebarHeader';
import { SidebarMenu } from './SidebarMenu';
import { SearchPanel } from './SearchPanel';
import { NotificationPanel } from './NotificationPanel';

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activePanel, setActivePanel] = useState<'search' | 'notification' | null>(null);

  const handlePanelToggle = (panel: 'search' | 'notification') => {
    if (!isCollapsed) {
      setIsCollapsed(true);
      setActivePanel(panel);
      return;
    }
    if (activePanel === panel) {
      setActivePanel(null);
      setTimeout(() => setIsCollapsed(false), 300);
      return;
    }
    setActivePanel(panel);
  };

  const handleExpandClick = () => {
    setIsCollapsed(false);
    setActivePanel(null);
  };

  const handleMenuClick = () => {
    if (isCollapsed) {
      setActivePanel(null);
      setIsCollapsed(false);
    } else {
      setIsCollapsed(true);
    }
  };

  return (
    <div className="flex relative">
      <div
        data-testid="sidebar-container"
        className={`
          fixed top-0 left-0 h-screen border-r border-gray-200 pt-9 pb-4 flex flex-col justify-between
          transition-all duration-300 bg-white z-20
          ${isCollapsed ? 'w-20 px-2' : 'w-64 px-4'}
        `}
      >
        <SidebarHeader isCollapsed={isCollapsed} />
        <SidebarMenu isCollapsed={isCollapsed} activePanel={activePanel} onExpandClick={handleExpandClick} onPanelToggle={handlePanelToggle} />
        <div onClick={handleMenuClick} className="flex items-center h-12 cursor-pointer hover:text-pink-500">
          <AlignJustify />
          {!isCollapsed && <p className="pl-4 text-sm">Menu</p>}
        </div>
      </div>

      <SearchPanel isVisible={activePanel === 'search'} />
      <NotificationPanel isVisible={activePanel === 'notification'} />
    </div>
  );
};
