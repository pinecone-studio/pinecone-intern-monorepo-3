import { Bell, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { SheetMenu } from './sheet/Menu';


export const Header = () => {
  return (
    <div className="flex items-center justify-between p-4 h-14">
      <a href="/" className="flex items-center h-14">
        <Image
          src="/mainLogo.png"
          alt="logo"
          width={50}
          height={50}
          className="w-[24px] h-[30px]"
        />
      </a>

      <div className="flex items-center gap-4">
        <ShoppingCart size={15} />
        <Bell size={15} />
        <SheetMenu />
      </div>
    </div>
  );
};
