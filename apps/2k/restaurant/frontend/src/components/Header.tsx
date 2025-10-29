import Image from 'next/image';
import { SheetMenu } from './sheet/Menu';
import { Notification } from './sheet/Notification';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between p-4 h-14 max-w-sm mx-auto">
        <a href="/" className="flex items-center">
          <Image src="/mainLogo.png" alt="logo" width={50} height={50} className="w-[24px] h-[30px]" />
        </a>

        <div className="flex items-center gap-3">
          <Notification />
          <SheetMenu />
        </div>
      </div>
    </header>
  );
};
