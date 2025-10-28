'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PaymentSelection from '@/components/payment/PaymentSelection';

type PendingOrderData = {
  cartItems: any[];
  baseOrderAmount: number;
  selectedOrderType: 'IN' | 'GO';
  tableQr: string;
};

const OrderPaymentPage = () => {
  const router = useRouter();
  const [orderData, setOrderData] = useState<PendingOrderData | null>(null);
  const [loading, setLoading] = useState(true);

  // 🌟 Шинээр нэмсэн state
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // 🌟 Component DOM дээр ачаалагдсан гэдгийг тэмдэглэнэ
    setHasMounted(true);

    const dataString = localStorage.getItem('pendingOrder');

    if (dataString) {
      try {
        const data: PendingOrderData = JSON.parse(dataString);
        setOrderData(data);
      } catch (e) {
        console.error('Local Storage-ийн өгөгдөл буруу байна:', e);
        router.back();
      }
    } else {
      router.back();
    }
    setLoading(false);
  }, [router]);

  // ... (handleSubmit функц хэвээр)
  const handleSubmit = (finalAmount: number, paymentMethod: string) => {
    if (!orderData) return;

    const newOrder = {
      orderId: Date.now().toString(),
      orderNumber: Math.floor(Math.random() * 10000),
      tableQr: orderData.tableQr,
      items: orderData.cartItems,
      totalPrice: finalAmount,
      paymentMethod: paymentMethod,
      orderType: orderData.selectedOrderType,
      status: 'Боловсруулж байна',
      createdAt: new Date().toISOString(),
    };

    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    localStorage.setItem('orders', JSON.stringify([...orders, newOrder]));

    localStorage.removeItem('pendingOrder');

    // alert(`Захиалга амжилттай илгээгдэж, ${finalAmount.toLocaleString()}₮ төлөгдлөө!`);

    router.push('/success');
  };

  // 🌟 hasMounted шалгах
  if (!hasMounted || loading || !orderData) {
    // Хэрэв шууд шилжилт хийгдсэн бол, энэ хэсэг түр хугацаанд гарч, DOM-ийг зөв байршуулах хугацаа олгоно.
    return <div className="flex items-center justify-center max-w-sm min-h-screen mx-auto">Мэдээлэл ачаалж байна...</div>;
  }

  return (
    <div className="max-w-sm min-h-screen mx-auto">
      {/* hasMounted үнэн бол PaymentSelection-ийг рендэрлэнэ */}
      <PaymentSelection baseOrderAmount={orderData.baseOrderAmount} onClose={() => router.back()} onSubmit={handleSubmit} selectedOrderType={orderData.selectedOrderType} />
    </div>
  );
};

export default OrderPaymentPage;
