import Image from 'next/image';
import { Trash } from 'lucide-react';

type Props = {
  id: string;
  image: string;
  foodName: string;
  price: string;
  count: number;
  onAdd?: (_id: string, _image: string, _foodName: string, _price: string) => void;
  onRemove?: (_id: string, _image: string, _foodName: string, _price: string) => void;
  removeItem: (_id: string) => void;
};

export const OrderList = ({ image, foodName, price, count, onAdd, onRemove, id, removeItem }: Props) => {
  return (
    <div className="flex w-full gap-4 px-2 py-2 h-fit">
      <div className="w-[90px] h-[90px] relative ">
        <Image alt="hool" src="https://i.pinimg.com/1200x/26/a7/0e/26a70e2ddd9a68f19c12f2dbce11d0dc.jpg" fill sizes="auto" className="object-cover rounded-xl" />
      </div>
      
      <div className="flex flex-col justify-between">
        <div className="flex flex-col min-w-0">
            <p className="text-[14px] truncate">thuivan</p>
            <p className="text-[16px] font-semibold">Нэгж: 12k₮</p>
        </div>
         <div className="flex items-center gap-3">
          <button
            onClick={() => {
              onAdd?.(id, image, foodName, price);
            }}
            className="flex items-center justify-center w-10 h-10 text-lg border rounded-xl border-zinc-200"
            aria-label="Нэмэх"
          >
            +
          </button>
          <p className="w-6 text-center" aria-live="polite">
            {count}1
          </p>
          <button
            onClick={() => {
              onRemove?.(id, image, foodName, price);
            }}
            className="flex items-center justify-center w-10 h-10 text-lg border rounded-xl border-zinc-200 disabled:opacity-40"
            disabled={count <= 1}
            aria-label="Хасах"
          >
            -
          </button>
        </div>
      </div>
       <div className="flex flex-col items-center justify-between">
        <button
          onClick={() => {
            removeItem(id);
          }}
          aria-label="Устгах"
          className="flex items-center justify-center w-10 h-10 rounded-md bg-zinc-100"
        >
          <Trash className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
