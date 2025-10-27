"use client";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';

export const ActiveOrder = () => {
     const orders = [
    {
      id: 1,
      name: "Red Velvet Cake",
      price: 12,
      count: 1,
      image: "https://i.pinimg.com/736x/c2/08/da/c208da2d808377f8fffbdd4251cbb32f.jpg",
    },
    {
      id: 2,
      name: "Chocolate Croissant",
      price: 8,
      count: 2,
      image: "https://i.pinimg.com/1200x/15/87/ec/1587ecff5029c39c229ff9227bd06502.jpg",
    },
    {
      id: 3,
      name: "Iced Coffee",
      price: 5,
      count: 1,
      image: "https://i.pinimg.com/736x/c2/e8/dc/c2e8dcb8dbe1e7a5e67eadb50a609ada.jpg",
    },
  ];
  
  return (
    <Sheet>
      <SheetTrigger>
        <ShoppingCart />
      </SheetTrigger>
      <SheetContent className="h-full p-3 pt-8">
        <SheetHeader className="flex flex-col h-full">
          <SheetTitle className="font-medium text-[#441500]">Захиалгын дэлгэрэнгүй</SheetTitle>
          <SheetDescription>
              <div className="flex flex-col items-start">
                <h2 className="font-medium text-[12px]">Захиалгын дугаар:</h2>
                <h1 className="font-medium text-[16px] text-black">#33998</h1>
              </div>

              <div className="w-full my-4 border"></div>
              
              <div className="flex flex-col items-start">
                <h2 className="font-medium text-[12px]">Захиалгын төлөв:</h2>
                <h1 className="font-medium text-[16px] text-black">Бэлтгэгдэж буй</h1>
              </div>

              <div className="w-full my-4 border"></div>
              
              <div className="flex flex-col items-start">
                <h2 className="font-medium text-[12px]">Захиалсан огноо:</h2>
                <h1 className="font-medium text-[16px] text-black">2024.10.19 12:37</h1>
              </div>

              <div className="w-full my-4 border"></div>
              
              <div className="flex flex-col items-start gap-2">
                <h2 className="font-medium text-[12px]">Захиалга:</h2>
                 {orders.map((item) => (
                <div className="flex items-center gap-3">
                  <div className="w-[90px] h-[90px] relative ">
                    <Image alt="hool" src={item.image} fill sizes="auto" className="object-cover rounded-xl" />
                  </div>
                  <div className="flex flex-col items-start">
                     <p className="text-base font-semibold text-gray-800">{item.name}</p>
                     <p className="text-sm text-gray-600">Үнэ: <span className="font-medium text-[#441500]">${item.price}</span></p>
                     <p className="text-sm text-gray-600">Тоо ширхэг: <span className="font-medium">{item.count}</span></p>
                  </div>
                </div>
                 ))}
              </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
