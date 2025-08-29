import Image from 'next/image';

type SidebarHeaderProps = {
  isCollapsed: boolean;
};

export const SidebarHeader = ({ isCollapsed }: SidebarHeaderProps) => {
  return (
    <div className="border-b border-gray-200 pb-4">
      {!isCollapsed ? <Image src={'/insta.png'} alt="logo" width={103} height={29} priority /> : <Image src={'/insta-icon.png'} alt="logo small" width={30} height={30} priority />}
    </div>
  );
};
