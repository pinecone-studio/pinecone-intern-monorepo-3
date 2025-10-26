'use client';

import PaymentSelection from '@/components/payment/PaymentSelection';
import React from 'react';

// Төрлийг тодорхойлно (PaymentSelection-д ашигласан төрөлтэй ижил байх ёстой)
type FoodServeType = 'GO' | 'IN';

const DUMMY_ORDER_AMOUNT = 54000;

const handleClose = () => {
  alert('Буцах үйлдэл энд хийгдэнэ (Бодит төсөлд router.back() эсвэл state өөрчлөгдөнө).');
};

const handleSubmit = (finalAmount: number, paymentMethod: string) => {
  console.log(`Төлбөр хийгдсэн: ${finalAmount}₮, Арга: ${paymentMethod}`);
  alert(`Төлбөр амжилттай хийгдсэн тул захиалга илгээгдлээ. (Дүн: ${finalAmount}₮)`);
};

const PaymentPage = () => {
  // 🌟 PaymentSelection-д шаардлагатай 'selectedOrderType' пропсыг нэмлээ.
  // Энэ нь жинхэнэ төсөлд MenuPage-ээс дамжуулагддаг байх ёстой.
  const initialOrderType: FoodServeType = 'IN';

  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen">
      <PaymentSelection
        baseOrderAmount={DUMMY_ORDER_AMOUNT}
        onClose={handleClose}
        onSubmit={handleSubmit}
        // 🌟 Алдааг зассан пропс:
        selectedOrderType={initialOrderType}
      />
    </div>
  );
};

export default PaymentPage;
