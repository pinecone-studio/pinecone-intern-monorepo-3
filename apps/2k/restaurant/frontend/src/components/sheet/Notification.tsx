"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Bell } from "lucide-react";
import { ActiveOrderContent } from "./ActiveOrder";


export const Notification = () => {
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  return (
    <Sheet>
      <SheetTrigger>
        <Bell size={20}/>
      </SheetTrigger>

      <SheetContent className="h-full p-3 pt-8">
        <SheetHeader className="flex flex-col h-full">
          {!selectedOrder ? (
            <>
              <SheetTitle className="font-medium text-[#441500] flex justify-center">Мэдэгдэл</SheetTitle>
              <SheetDescription>
                <div
                  onClick={() => setSelectedOrder(1)}
                  className="flex gap-3 p-3 border cursor-pointer rounded-2xl hover:bg-gray-50"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-300 rounded-full">
                    <Bell size={20} />
                  </div>
                  <div>
                    <div>
                      <span className="font-semibold text-[#441500]">#32193</span> Таны захиалсан хоол амжилттай баталгаажлаа.
                    </div>
                    <div className="flex justify-between pt-2">
                      <div className="px-1 text-xs font-medium text-black border rounded-full">Хүлээгдэж буй</div>
                      <p className="text-xs font-medium text-black">25.10.29 15:25</p>
                    </div>
                  </div>
                </div>
              </SheetDescription>
            </>
          ) : (
            <ActiveOrderContent onBack={() => setSelectedOrder(null)} />
          )}
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};