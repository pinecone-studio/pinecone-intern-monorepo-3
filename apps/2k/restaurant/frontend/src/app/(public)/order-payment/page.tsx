'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PaymentSelection from '@/components/payment/PaymentSelection';
import { FoodServeType, FoodOrderStatus, useCreateOrderMutation } from '@/generated';
import { toast } from 'sonner';

type PendingOrderData = {
  cartItems: any[];
  baseOrderAmount: number;
  selectedOrderType: 'IN' | 'GO';
  tableQr: string;
  tableId: string | null;
};

const OrderPaymentPage = () => {
  const router = useRouter();
  const [orderData, setOrderData] = useState<PendingOrderData | null>(null);
  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState<string>('');
  const [createOrder] = useCreateOrderMutation();

  useEffect(() => {
    const dataString = localStorage.getItem('pendingOrder');
    const userString = localStorage.getItem('user');

    if (userString) {
      try {
        const u = JSON.parse(userString);
        if (u?.userId) setUserId(u.userId);
      } catch {}
    }

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

  const handleSubmit = async (finalAmount: number, paymentMethod: string) => {
    if (!orderData) return;

    if (!orderData.tableId) {
      toast.error('Ширээний мэдээлэл дутуу байна. QR-ээ дахин уншуулна уу.');
      return;
    }

    try {
      await createOrder({
        variables: {
          userId: userId || '68ff2c8296358b4bed6a6e6b',
          tableId: orderData.tableId,
          input: {
            foodOrderItems: (orderData.cartItems || []).map((i: any) => ({
              food: i.id,
              quantity: i.selectCount,
            })),
            serveType: orderData.selectedOrderType === 'GO' ? FoodServeType.Go : FoodServeType.In,
            status: FoodOrderStatus.Pending,
            totalPrice: Number(finalAmount),
          },
        },
      });

      localStorage.removeItem('pendingOrder');
      toast.success(`Төлбөр амжилттай. ${finalAmount.toLocaleString()}₮`);
      return;
    } catch (err) {
      console.error('createOrder 실패, fallback to local:', err);
      toast.error('Захиалга амжилтгүй. Дахин оролдоно уу.');
    }

    const newOrder = {
      userId: userId || '68ff2c8296358b4bed6a6e6b',
      orderId: Date.now().toString(),
      orderNumber: Math.floor(Math.random() * 10000),
      tableQr: orderData.tableQr,
      tableId: orderData.tableId,
      items: orderData.cartItems,
      totalPrice: finalAmount,
      paymentMethod: paymentMethod,
      orderType: orderData.selectedOrderType,
      status: 'Хүлээгдэж байна',
      createdAt: new Date().toISOString(),
    };

    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    localStorage.setItem('orders', JSON.stringify([...orders, newOrder]));

    localStorage.removeItem('pendingOrder');
    toast.success(`Төлбөр амжилттай (offline). ${finalAmount.toLocaleString()}₮`);
  };

  if (loading || !orderData) {
    return <div className="max-w-sm mx-auto min-h-screen flex items-center justify-center">Мэдээлэл ачаалж байна...</div>;
  }

  return (
    <div className="max-w-sm mx-auto min-h-screen">
      <PaymentSelection baseOrderAmount={orderData.baseOrderAmount} onClose={() => router.back()} onSubmit={handleSubmit} selectedOrderType={orderData.selectedOrderType} />
    </div>
  );
};

export default OrderPaymentPage;
