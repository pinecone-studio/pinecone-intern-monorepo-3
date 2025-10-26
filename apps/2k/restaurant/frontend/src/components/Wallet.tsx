import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Header } from './Header';

export const Wallet = () => {
  return (
    <div>
      <Header />
      <div className="w-full h-[170px] bg-muted flex flex-col items-center justify-center">
        <p className="text-[20px] text-[#441500] font-medium">Хэтэвч</p>
        <p className="text-[32px]">18,864</p>
        <p className="text-[12px] font-light">Үлдэгдэл</p>
      </div>
      <div className="flex items-center justify-between px-4 pt-4 ">
        <div className="flex items-center gap-3">
          <div className="w-[40px] h-[40px] bg-muted rounded-md flex items-center justify-center ">
            <ArrowUp color="green" />
          </div>
          <p className="font-semibold">+324</p>
        </div>
        <p className="font-light text-[12px]">24.10.19 15:25</p>
      </div>
      <div className="flex px-5 pt-3">
        <div className="w-full flex h-[1px] border-[1px]  "></div>
      </div>
      <div className="flex items-center justify-between px-4 pt-4 ">
        <div className="flex items-center gap-3">
          <div className="w-[40px] h-[40px] bg-muted rounded-md flex items-center justify-center ">
            <ArrowUp color="green" />
          </div>
          <p className="font-semibold">+324</p>
        </div>
        <p className="font-light text-[12px]">24.10.19 15:25</p>
      </div>
      <div className="flex px-5 pt-3">
        <div className="w-full flex h-[1px] border-[1px]  "></div>
      </div>
      <div className="flex items-center justify-between px-4 pt-4 ">
        <div className="flex items-center gap-3">
          <div className="w-[40px] h-[40px] bg-muted rounded-md flex items-center justify-center ">
            <ArrowUp color="green" />
          </div>
          <p className="font-semibold">+324</p>
        </div>
        <p className="font-light text-[12px]">24.10.19 15:25</p>
      </div>
      <div className="flex px-5 pt-3">
        <div className="w-full flex h-[1px] border-[1px]  "></div>
      </div>
      <div className="flex items-center justify-between px-4 pt-4 ">
        <div className="flex items-center gap-3">
          <div className="w-[40px] h-[40px] bg-muted rounded-md flex items-center justify-center ">
            <ArrowDown color="red" />
          </div>
          <p className="font-semibold">+324</p>
        </div>
        <p className="font-light text-[12px]">24.10.19 15:25</p>
      </div>
      <div className="flex px-5 pt-3">
        <div className="w-full flex h-[1px] border-[1px]  "></div>
      </div>
    </div>
  );
};
