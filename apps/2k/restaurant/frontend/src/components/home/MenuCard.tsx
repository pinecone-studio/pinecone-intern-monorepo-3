'use client';
 
import { X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
 
export type Props = {
  id: string;
  image: string;
  foodName: string;
  price: number;
  count?: number;
  onAdd?: (id: string, image: string, name: string, price: number) => void;
  onRemove?: (id: string) => void;
};
 
const MenuCard = ({ id, image, foodName, price, count = 0, onAdd, onRemove }: Props) => {
  const [isHovered, setIsHovered] = useState(false);
console.log(isHovered)
  function shortPrice(n: number) {
    if (n >= 1000) {
      return `${(n / 1000).toFixed(1)}`;
    }
    return `${n}`;
  }
 
  return (
    <div className="relative flex justify-center w-full h-fit" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div onClick={() => onAdd?.(id, image, foodName, price)} className="w-[165px] h-[230px] flex flex-col cursor-pointer">
        <div className="relative w-full h-40 overflow-hidden shadow-md rounded-xl">
          <Image src={image} alt={foodName} fill className="object-cover transition-transform duration-300 hover:scale-110" />
 
          {count > 0 && (
            <>
              <div className="flex relative w-[50%] h-full ml-[50%] justify-center items-center">
                <div className="absolute flex w-full h-full bg-black opacity-50 "></div>
 
                <p className="flex absolute text-[30px] text-white ">{count}</p>
              </div>
              <X
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove?.(id);
                }}
                className="absolute top-2 right-2 w-[20px] h-[20px] text-white cursor-pointer hover:text-red-400 transition"
              />
            </>
          )}
        </div>
 
        <div className="flex flex-col px-1 mt-2 text-center">
          <p className="text-sm font-medium truncate">{foodName}</p>
          <p className="text-lg font-semibold text-gray-800">{shortPrice(price)}₮</p>
        </div>
      </div>
    </div>
  );
};
 
export default MenuCard;
