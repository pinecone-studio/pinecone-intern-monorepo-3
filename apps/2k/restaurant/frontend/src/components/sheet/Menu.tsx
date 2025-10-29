'use client';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Ellipsis, HomeIcon, Info, List, User, Wallet } from 'lucide-react';
import Link from 'next/link';
export const SheetMenu = () => {
  const logout = () => {
    localStorage.clear();
  };
  return (
    <div>
      <Sheet>
        <SheetTrigger>
          <Ellipsis />
        </SheetTrigger>
        <SheetContent className="h-full">
          <SheetHeader className="flex flex-col h-full">
            <SheetTitle></SheetTitle>
            <SheetDescription className="flex flex-col justify-between h-full">
              <div>
                <div className="w-full py-5 border-b">
                  <a href="/" className="flex items-center gap-4">
                    <HomeIcon size={20} />
                    <p>Нүүр хуудас</p>
                  </a>
                </div>
                <div className="w-full py-5 border-b">
                  <Link href="/wallet" className="flex items-center gap-4">
                    <Wallet size={20} />
                    <p>Хэтэвч</p>
                  </Link>
                </div>
                <div className="w-full py-5 border-b">
                  <a href="/update-user" className="flex items-center gap-4">
                    <User size={20} />
                    <p>Хэрэглэгч</p>
                  </a>
                </div>
                <div className="w-full py-5 border-b">
                  <a href="/history" className="flex items-center gap-4">
                    <List size={20} />
                    <p>Захиалгын түүх</p>
                  </a>
                </div>
                <div className="w-full py-5 border-b">
                  <a href="/about-us" className="flex items-center gap-4">
                    <Info size={20} />
                    <p>Бидний тухай</p>
                  </a>
                </div>
              </div>
              <div className="flex justify-center pb-4">
                <a data-testid="logout-button" onClick={() => logout()} href="/sign-in" className="w-[300px] h-[40px] bg-[#441500] flex items-center justify-center rounded-md">
                  <p className="text-white">Гарах</p>
                </a>
              </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};
