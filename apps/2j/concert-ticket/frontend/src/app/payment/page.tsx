'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Check } from 'lucide-react';

interface PaymentPageProps {
  _concertId: string;
  _ticketData: string;
  totalAmount: number;
}

const SuccessScreen = ({ ticketNumber }: { ticketNumber: string }) => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
    <div className="flex h-[80px] w-[80px] items-center justify-center rounded-full bg-blue-500">
      <Check className="h-[40px] w-[40px] text-white" />
    </div>
    <h1 className="mt-[24px] text-[24px] font-bold">Амжилттай!</h1>
    <p className="mt-[8px] text-center text-[16px] text-gray-300">
      Таны захиалга амжилттай хийгдлээ.
      <br />
      Тасалбарын дугаар: {ticketNumber}
    </p>
    <p className="mt-[16px] text-[14px] text-gray-400">Таныг нүүр хуудас руу шилжүүлж байна...</p>
  </div>
);

const PaymentHeader = ({ onBack }: { onBack: () => void }) => (
  <div className="py-4 bg-black border-b border-gray-700">
    <div className="relative flex items-center justify-center max-w-6xl px-6 mx-auto">
      <button onClick={onBack} className="absolute flex items-center justify-center w-12 h-12 text-white transition-colors bg-gray-800 rounded-lg left-6 hover:bg-gray-700" data-testid="back-button">
        <ArrowLeft className="w-5 h-5" />
      </button>
      <h1 className="text-2xl font-bold text-white">Төлбөр төлөх</h1>
    </div>
  </div>
);

const PaymentButton = ({ method, selected, onClick }: { method: string; selected: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`p-6 rounded-2xl transition-all border-2 ${selected ? '' : 'border-transparent hover:border-gray-500'}`}
    style={{
      backgroundColor: '#1a1a1a',
      borderColor: selected ? '#00b7f4' : 'transparent',
    }}
  >
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-3 overflow-hidden">
        <img src={`/images/${method.toLowerCase().replace(' ', '')}.png`} alt={method} className="w-full h-full object-contain" />
      </div>
      <span className="text-white font-medium">{method}</span>
    </div>
  </button>
);

const ErrorNotification = ({ message, onClose }: { message: string; onClose: () => void }) => (
  <div className="fixed bottom-4 right-4 z-50 max-w-sm">
    <div className="flex items-center justify-between p-4 bg-red-900 border border-red-700 rounded-lg shadow-lg">
      <div className="flex-1">
        <p className="text-sm text-red-100">{message}</p>
      </div>
      <button onClick={onClose} className="ml-3 text-red-300 hover:text-red-100 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
);

const usePaymentLogic = () => {
  const router = useRouter();
  const [selectedPayment, setSelectedPayment] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [ticketNumber, setTicketNumber] = React.useState<string>('');

  const handlePaymentSelect = (method: string) => {
    setSelectedPayment(method);
    setErrorMessage(null);
  };

  const handlePay = async () => {
    if (!selectedPayment) {
      setErrorMessage('Төлбөрийн арга сонгоно уу!');
      return;
    }
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setTicketNumber((Math.floor(Math.random() * 90000) + 10000).toString());
      setShowSuccess(true);
      setIsProcessing(false);
      setTimeout(() => router.push('/'), 5000);
    } catch {
      setIsProcessing(false);
      setErrorMessage('Төлбөр төлөх үед алдаа гарлаа. Дахин оролдоно уу.');
    }
  };

  return { selectedPayment, handlePaymentSelect, handlePay, isProcessing, showSuccess, ticketNumber, errorMessage, setErrorMessage, router };
};

const PaymentForm = ({
  totalAmount,
  selectedPayment,
  isProcessing,
  handlePaymentSelect,
  handlePay,
}: {
  totalAmount: number;
  selectedPayment: string | null;
  isProcessing: boolean;
  handlePaymentSelect: (method: string) => void;
  handlePay: () => void;
}) => {
  const isReady = Boolean(selectedPayment && !isProcessing);
  return (
    <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: '#1a1a1a' }}>
      <div className="flex justify-between items-center mb-8">
        <span className="text-white">Нийт төлөх дүн</span>
        <span className="text-2xl font-bold text-white">{totalAmount.toLocaleString()}₮</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <PaymentButton method="Qpay" selected={selectedPayment === 'Qpay'} onClick={() => handlePaymentSelect('Qpay')} />
        <PaymentButton method="Social Pay" selected={selectedPayment === 'Social Pay'} onClick={() => handlePaymentSelect('Social Pay')} />
      </div>
      <button
        onClick={handlePay}
        disabled={!isReady}
        className={`w-full px-6 py-4 mt-8 font-bold text-white transition-colors rounded-lg ${isReady ? 'hover:opacity-90' : 'opacity-50 cursor-not-allowed'}`}
        style={{ backgroundColor: isReady ? '#00b7f4' : '#6b7280' }}
      >
        {isProcessing ? 'Боловсруулаж байна...' : 'Төлбөр төлөх'}
      </button>
    </div>
  );
};

function PaymentContent({ _concertId, _ticketData, totalAmount }: PaymentPageProps) {
  const { selectedPayment, handlePaymentSelect, handlePay, isProcessing, showSuccess, ticketNumber, errorMessage, setErrorMessage, router } = usePaymentLogic();

  if (showSuccess) return <SuccessScreen ticketNumber={ticketNumber} />;

  return (
    <div className="min-h-screen bg-black text-white">
      <PaymentHeader onBack={() => router.back()} />
      <div className="py-20">
        <div className="max-w-md mx-auto px-6">
          <PaymentForm totalAmount={totalAmount} selectedPayment={selectedPayment} isProcessing={isProcessing} handlePaymentSelect={handlePaymentSelect} handlePay={handlePay} />
        </div>
      </div>
      {errorMessage && <ErrorNotification message={errorMessage} onClose={() => setErrorMessage(null)} />}
    </div>
  );
}

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const concertId = searchParams.get('concertId');
  const ticketData = searchParams.get('ticketData');

  const totalAmount = React.useMemo(() => {
    if (!ticketData) return 0;
    try {
      const tickets = JSON.parse(decodeURIComponent(ticketData));
      return tickets.reduce((sum: number, ticket: { price: number; quantity: number }) => sum + ticket.price * ticket.quantity, 0);
    } catch (error) {
      console.error('Error parsing ticket data:', error);
      return 0;
    }
  }, [ticketData]);

  if (!concertId || !ticketData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Алдаа</h1>
          <p className="text-gray-300">Концертын мэдээлэл олдсонгүй</p>
        </div>
      </div>
    );
  }

  return <PaymentContent concertId={concertId} ticketData={ticketData} totalAmount={totalAmount} />;
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Ачааллаж байна...</h1>
          </div>
        </div>
      }
    >
      <PaymentPageContent />
    </Suspense>
  );
}
