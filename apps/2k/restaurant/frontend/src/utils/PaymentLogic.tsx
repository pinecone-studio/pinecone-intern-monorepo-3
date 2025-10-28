'use client';

import { FoodServeType } from '@/generated';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export type FoodOrderItemInput = { foodId: string; quantity: number };

export type HandleWalletOrderArgs = {
  targetAmount: string;
  totalBeforeWallet: number;
  setWalletDeduction: (_v: number) => void;
  setWalletUsed: (_v: boolean) => void;
  setSelectedPayment: (_v: string) => void;
  setIsWalletDrawerOpen: (_v: boolean) => void;
  setTargetAmount: (_v: string) => void;
};

export const handleWalletOrder = ({ targetAmount, totalBeforeWallet, setWalletDeduction, setWalletUsed, setSelectedPayment, setIsWalletDrawerOpen, setTargetAmount }: HandleWalletOrderArgs): void => {
  const amt = Math.max(0, Math.min(Number.parseInt(targetAmount) || 0, totalBeforeWallet));
  setWalletDeduction(amt);
  setWalletUsed(true);
  setSelectedPayment('');
  setIsWalletDrawerOpen(false);
  setTargetAmount('');
};

export type HandlePaymentSelectArgs = {
  methodId: string;
  setSelectedPayment: (_v: string) => void;
  setIsWalletDrawerOpen: (_v: boolean) => void;
  createOrder: (_args: {
    variables: {
      userId: string;
      tableId: string;
      input: {
        foodOrderItems: { foodId: string; quantity: number }[];
        serveType: FoodServeType;
        status: string;
        totalPrice: number;
      };
    };
  }) => Promise<unknown>;
  userId: string;
  table: string;
  finalAmount: number;
  orderFood: FoodOrderItemInput[];
  orderType?: FoodServeType;
  navigate?: (_path: string) => void;
};

export const handlePaymentSelect = async ({
  methodId,
  setSelectedPayment,
  setIsWalletDrawerOpen,
  createOrder,
  userId,
  table,
  finalAmount,
  orderFood,
  orderType,
  navigate,
}: HandlePaymentSelectArgs): Promise<void> => {
  setSelectedPayment(methodId);

  if (methodId === 'wallet') {
    setIsWalletDrawerOpen(true);
    return;
  }

  if (!table || !userId) {
    toast.error(
      <div className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-red-500" />
        <span>Хоол захиалахын тулд QR кодыг уншуулна уу.</span>
        <a href="/camera" className="ml-2 text-blue-500 underline hover:text-blue-700">
          Камер нээх
        </a>
      </div>
    );
    return;
  }
console.log("helloeeeee");

  // GraphQL schema-д нийцүүлсэн input
  await createOrder({
    variables: {
      userId,
      tableId: table,
      input: {
        foodOrderItems: orderFood.map((item) => ({
          foodId: item.foodId,
          quantity: item.quantity,
        })),
        serveType: orderType || FoodServeType.Go,
        status: 'PENDING',
        totalPrice: Number(finalAmount),
      },
    },
  });

  if (navigate) navigate('/PaymentSuccess');
};