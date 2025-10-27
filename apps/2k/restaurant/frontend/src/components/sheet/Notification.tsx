import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Bell } from 'lucide-react';

export const Notification = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <Bell />
      </SheetTrigger>
      <SheetContent className="h-full p-2 pt-8">
        <SheetHeader className="flex flex-col h-full">
          <SheetTitle className="font-medium text-[#441500]">Мэдэгдэл</SheetTitle>
          <SheetDescription>
            <div className="flex gap-3 p-3 border rounded-2xl">
              <div className="flex items-center justify-center w-10 h-10 bg-gray-300 rounded-full">
                <Bell size={20} />
              </div>
              <div>
                <div className="">
                  <span className="font-semibold text-[#441500]">#32193</span> Таны захиалсан хоол амжилттай баталгаажлаа. 
                </div>
                <div className="flex justify-between pt-2">
                  <div className="px-1 text-xs font-medium text-black border rounded-full">Хүлээгдэж буй</div>
                  <p className="text-xs font-medium text-black">25.10.29 15:25</p>
                </div>
              </div>
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
