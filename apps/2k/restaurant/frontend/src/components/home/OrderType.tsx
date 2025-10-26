'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

// Төрлүүд
type FoodServeTypeString = 'IN' | 'GO';

// Түр зуурын төрлийн тодорхойлолт (MenuPage-ээс ашиглаж байгаа)
interface CartItem {
  id: string;
  image: string;
  name: string;
  price: number;
  selectCount: number;
}

type Props = {
  currentCart: CartItem[];
  // MenuPage-ийн goToPayment функцийг хүлээн авна
  onProceedToPayment: (type: FoodServeTypeString) => void;
};

const OrderType: React.FC<Props> = ({ currentCart, onProceedToPayment }) => {
  const [isOpen, setIsOpen] = useState(false);

  const totalItemCount = currentCart.reduce((a, b) => a + b.selectCount, 0);

  const handlePick = (value: string) => {
    // Сонголт хийгдсэн даруйд Dialog-ийг хаана
    setIsOpen(false);

    // MenuPage-ийн төлбөрийн горим руу шилжүүлэх функцийг дуудна.
    onProceedToPayment(value as FoodServeTypeString);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* DrawerTrigger-т ашиглагдах Button */}
      <button
        onClick={() => setIsOpen(true)} // Товч дарахад Dialog нээгдэнэ
        className="w-full bg-amber-800 hover:bg-amber-900 text-white py-4 text-lg font-medium rounded-lg"
      >
        Захиалах ({totalItemCount})
      </button>

      <DialogContent className="sm:max-w-[420px] border-[2px] border-white rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-[18px]">
            <div className="flex w-full justify-between items-center">
              <p>Захиалгын төрөл</p>
              <DialogClose>
                <X className="h-5 w-5 text-gray-800" />
              </DialogClose>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* RadioGroup-т сонголт хийгдсэн даруйд handlePick ажиллаж, төлбөр рүү шилжүүлнэ */}
        <RadioGroup onValueChange={handlePick} className="flex items-center w-full justify-around mt-4 mb-8">
          <div className="flex items-center justify-center space-x-3">
            <RadioGroupItem id="IN" value="IN" />
            <Label className="text-[14px]" htmlFor="IN">
              Эндээ идэх
            </Label>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <RadioGroupItem id="GO" value="GO" />
            <Label className="text-[14px]" htmlFor="GO">
              Аваад явах
            </Label>
          </div>
        </RadioGroup>
      </DialogContent>
    </Dialog>
  );
};

export default OrderType;
