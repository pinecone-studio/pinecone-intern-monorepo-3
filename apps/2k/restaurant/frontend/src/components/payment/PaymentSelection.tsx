'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

// Шаардлагатай UI Компонентууд (Таны төсөлд байгааг ашиглана)
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Toaster } from '@/components/ui/toaster';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Төрлүүд
type FoodServeType = 'GO' | 'IN';
type PaymentMethod = {
  id: 'qpay' | 'socialpay' | 'wallet' | 'card';
  name: string;
  iconUrl: string;
};

// Түр зуурын тогтмол утгууд
const DELIVERY_FEE = 4000;
const WALLET_BALANCE = 18864;

const paymentMethods: PaymentMethod[] = [
  { id: 'qpay', name: 'Qpay', iconUrl: '/icons/qpay.png' },
  { id: 'socialpay', name: 'Social Pay', iconUrl: '/icons/socialpay.png' },
  { id: 'wallet', name: 'Хэтэвч', iconUrl: '/icons/wallet.png' },
];

// 🌟 PaymentSelection-ийн пропсын төрлийг зөв тодорхойлов
interface PaymentSelectionProps {
  baseOrderAmount: number;
  onClose: () => void;
  onSubmit: (finalAmount: number, paymentMethod: string) => void;
  // OrderType-оос сонгогдсон төрлийг MenuPage дамжуулна
  selectedOrderType: FoodServeType;
}

// Хэсэгчилсэн Компонент: Төлбөрийн Карт (Хэвээр үлдэнэ)
interface PaymentCardProps {
  method: PaymentMethod;
  selectedPayment: string;
  handlePaymentSelect: (id: string) => void;
}

const PaymentCard: React.FC<PaymentCardProps> = ({ method, selectedPayment, handlePaymentSelect }) => {
  const isSelected = selectedPayment === method.id;

  return (
    <div
      onClick={() => handlePaymentSelect(method.id)}
      className={`
        flex flex-col items-center justify-center p-4 w-1/3 h-28 rounded-xl cursor-pointer transition-all duration-200
        ${isSelected ? 'border-2 border-[#9E6038] bg-[#F7F4F1]' : 'border border-gray-200 bg-white hover:bg-gray-50'}
      `}
    >
      {/* 🌟 next/image ашиглаагүй тул img tag-ийг хэрэглэв */}
      <img src={method.iconUrl} alt={method.name} className="w-10 h-10 mb-2" />
      <span className="text-xs font-medium text-gray-700 text-center">{method.name}</span>
    </div>
  );
};

// Үндсэн Компонент: Төлбөр Сонгох
const PaymentSelection: React.FC<PaymentSelectionProps> = ({ baseOrderAmount, onClose, onSubmit, selectedOrderType }) => {
  const router = useRouter();
  // 🌟 OrderType-оос ирсэн төрлөөр анхдагч утгыг тохируулж байна.
  const [deliveryOption, setDeliveryOption] = useState<FoodServeType>(selectedOrderType);
  const [selectedPayment, setSelectedPayment] = useState<string>('qpay');
  const [isWalletDrawerOpen, setIsWalletDrawerOpen] = useState(false);
  const [targetAmount, setTargetAmount] = useState<string>('');
  const [wallet, setWallet] = useState({ used: false, deduction: 0 });

  // 🌟 Захиалга "Эндээ идэх" (IN) бол савны төлбөр (DELIVERY_FEE) авахгүй
  const packagingFee = deliveryOption === 'GO' ? DELIVERY_FEE : 0;

  const totalBeforeWallet = baseOrderAmount + packagingFee;
  const finalAmount = totalBeforeWallet - wallet.deduction;

  const onPaymentSelect = (id: string) => {
    setSelectedPayment(id);
    if (id === 'wallet' && WALLET_BALANCE > 0) {
      setIsWalletDrawerOpen(true);
    } else {
      setWallet({ used: false, deduction: 0 });
    }
  };

  const onWalletOrder = () => {
    const amountToDeduct = targetAmount ? parseInt(targetAmount) : 0;

    if (amountToDeduct > WALLET_BALANCE) {
      alert('Хэтэвчний үлдэгдэл хүрэлцэхгүй байна.');
      return;
    }
    if (amountToDeduct > totalBeforeWallet) {
      alert('Төлөх дүнгээс хэтэрсэн байна.');
      return;
    }

    setWallet({ used: true, deduction: amountToDeduct });
    setIsWalletDrawerOpen(false);
  };

  const handleFinalOrder = () => {
    if (!selectedPayment) return alert('Төлбөрийн хэрэгсэл сонгоно уу.');

    // 🌟 MenuPage-ийн submitOrder-ийг дуудна
    onSubmit(finalAmount, selectedPayment);
  };

  return (
    <>
      <Toaster />
      <div className="max-w-sm mx-auto bg-white min-h-screen">
        {/* Буцах товч */}
        <div className="w-full flex justify-end px-4">
          <button onClick={onClose} className="flex mt-5" aria-label="Back">
            <X className="w-6 h-6 text-gray-800" />
          </button>
        </div>

        {/* Гарчиг */}
        <div className="flex items-center justify-between pt-10">
          <h1 className="text-2xl font-bold text-center flex-1 text-gray-800">
            Төлбөрийн хэрэгслээ
            <br />
            сонгоно уу
          </h1>
        </div>

        {/* Үндсэн контент */}
        <div className="flex flex-col p-4 gap-10 pt-10">
          {/* Хүргэлтийн сонголт (Захиалгын төрөл) */}
          <Select value={deliveryOption} onValueChange={(v) => setDeliveryOption(v as FoodServeType)}>
            <SelectTrigger className="w-full h-12 border-gray-300">
              <SelectValue placeholder="Захиалгын төрөл сонгоно уу" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GO">Авч явах (Савны төлбөр: {DELIVERY_FEE.toLocaleString()}₮)</SelectItem>
              <SelectItem value="IN">Эндээ идэх (Савны төлбөргүй)</SelectItem>
            </SelectContent>
          </Select>

          {/* Төлбөрийн аргууд */}
          <div className="flex justify-between gap-2">
            {paymentMethods.map((m) => (
              <PaymentCard key={m.id} selectedPayment={selectedPayment} method={m} handlePaymentSelect={onPaymentSelect} />
            ))}
          </div>

          {/* Захиалгын мэдээлэл */}
          <div>
            {[
              { label: 'Захиалгын нийт дүн:', value: baseOrderAmount },
              // Зөвхөн "Авч явах" бол савны төлбөрийг харуулна
              ...(deliveryOption === 'GO' ? [{ label: 'Хоолны сав:', value: packagingFee }] : []),
              ...(wallet.used ? [{ label: 'Хэтэвчээс хасагдсан дүн:', value: -wallet.deduction }] : []),
            ].map((row, i) => (
              <div key={i} className="flex justify-between items-center border-b border-gray-100 py-3">
                <span className="text-gray-600">{row.label}</span>
                <span className={`font-medium ${row.value < 0 ? 'text-red-500' : 'text-gray-800'}`}>
                  {row.value < 0 ? '-' : ''}
                  {Math.abs(row.value).toLocaleString()}₮
                </span>
              </div>
            ))}

            {/* Төлөх нийт дүн */}
            <div className="flex justify-between items-center py-3 mt-2 bg-gray-50 rounded-md p-3">
              <span className="font-bold text-lg text-gray-800">Төлөх дүн:</span>
              <span className="font-bold text-xl text-green-600">{finalAmount.toLocaleString()}₮</span>
            </div>
          </div>
        </div>

        {/* Төлбөрийн товчлуур (Fixed footer) */}
        <div className="p-4 pt-0 fixed bottom-0 left-0 right-0 max-w-sm mx-auto bg-white border-t border-gray-100">
          <Button className="w-full bg-amber-800 hover:bg-amber-900 text-white py-3 h-12 rounded-lg font-medium text-lg" onClick={handleFinalOrder}>
            {finalAmount > 0 ? `Төлөх (${finalAmount.toLocaleString()}₮)` : 'Захиалга Баталгаажуулах'}
          </Button>
        </div>

        {/* Хэтэвчний Drawer (Sheet) */}
        <Sheet open={isWalletDrawerOpen} onOpenChange={setIsWalletDrawerOpen}>
          <SheetContent side="bottom" className="h-auto rounded-t-xl max-w-sm mx-auto">
            <SheetHeader className="text-center pb-6">
              <SheetTitle className="text-lg font-bold text-gray-800">Хэтэвчинд {WALLET_BALANCE.toLocaleString()}₮</SheetTitle>
              <p className="text-sm text-gray-600">Төлөх дүн: {totalBeforeWallet.toLocaleString()}₮</p>
            </SheetHeader>
            <div className="space-y-4">
              <Input
                placeholder="Хэтэвчнээс хасах дүн"
                value={targetAmount}
                onChange={(e) => {
                  const value = e.target.value;
                  const numValue = parseInt(value);
                  const isValid = value === '' || (!isNaN(numValue) && numValue >= 0 && numValue <= WALLET_BALANCE && numValue <= totalBeforeWallet);
                  if (isValid) {
                    setTargetAmount(value);
                  }
                }}
                className="w-full p-3 border border-gray-200 rounded-lg text-lg text-center"
                type="number"
                min={0}
                max={WALLET_BALANCE}
              />
              <Button className="w-full bg-amber-800 hover:bg-amber-900 text-white py-3 rounded-lg font-medium h-12 text-lg" onClick={onWalletOrder}>
                Хэтэвч ашиглах
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default PaymentSelection;
