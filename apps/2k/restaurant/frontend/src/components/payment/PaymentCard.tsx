import React from 'react';
import { PaymentMethod } from '@/types/payment';

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
      <img src={method.iconUrl} alt={method.name} className="w-10 h-10 mb-2" />
      <span className="text-xs font-medium text-gray-700">{method.name}</span>
    </div>
  );
};

export default PaymentCard;
