'use client';

import React, { useState } from 'react';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useGetConcertQuery, TicketType } from '@/generated';

// Helper function to map ticket type to display name
const getTicketTypeName = (type: TicketType): string => {
  switch (type) {
    case TicketType.Vip:
      return 'VIP тасалбар';
    case TicketType.Regular:
      return 'Энгийн тасалбар';
    case TicketType.GeneralAdmission:
      return 'Арын тасалбар';
    default:
      return 'Тасалбар';
  }
};

// Helper function to map ticket type to color
const getTicketTypeColor = (type: TicketType): string => {
  switch (type) {
    case TicketType.Vip:
      return '#4651c9';
    case TicketType.Regular:
      return '#c772c4';
    case TicketType.GeneralAdmission:
      return '#D7D7F8';
    default:
      return '#888888';
  }
};

interface TicketCategory {
  id: string;
  name: string;
  price: number;
  available: number;
  color: string;
  quantity: number;
}

interface CartContentProps {
  concertId: string | null;
  selectedDate: string | null;
}

const DEFAULT_CATEGORIES: TicketCategory[] = [
  { id: '1', name: 'Арын тасалбар', price: 89000, available: 123, color: '#D7D7F8', quantity: 0 },
  { id: '2', name: 'VIP тасалбар', price: 129000, available: 38, color: '#4651c9', quantity: 0 },
  { id: '3', name: 'Энгийн тасалбар', price: 159000, available: 38, color: '#c772c4', quantity: 0 },
];

interface ConcertCategory {
  id: string;
  type: TicketType;
  unitPrice: number;
  availableQuantity: number;
}

const mapToTicketCategories = (categories: ConcertCategory[]): TicketCategory[] => {
  return categories.map((category) => ({
    id: category.id,
    name: getTicketTypeName(category.type),
    price: category.unitPrice,
    available: category.availableQuantity,
    color: getTicketTypeColor(category.type),
    quantity: 0,
  }));
};

const validateQuantity = (newQuantity: number, ticket: TicketCategory): string | null => {
  if (newQuantity < 0) return 'Тасалбарын тоо 0-с бага байж болохгүй!';
  if (newQuantity > ticket.available) return `${ticket.available}-н тасалбар захиалах боломжтой байна!`;
  if (newQuantity > 10) return 'Нэг ангилалд 10-с олон тасалбар захиалах боломжгүй!';
  return null;
};

const LoadingState = () => (
  <div className="flex items-center justify-center flex-1">
    <div className="text-white">Ачааллаж байна...</div>
  </div>
);

const ErrorState = ({ onBack }: { onBack: () => void }) => (
  <div className="flex-1 text-white bg-black">
    <div className="py-4 bg-black border-b border-gray-700">
      <div className="relative flex items-center justify-center max-w-6xl px-6 mx-auto">
        <button onClick={onBack} className="absolute flex items-center justify-center w-12 h-12 text-white transition-colors bg-gray-800 rounded-lg left-6 hover:bg-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-white">Тасалбар захиалах</h1>
      </div>
    </div>
    <div className="flex items-center justify-center flex-1">
      <div className="text-red-400">Концертын мэдээлэл олдсонгүй</div>
    </div>
  </div>
);

interface ConcertData {
  concert?: {
    ticketCategories?: Array<{ id: string; type: TicketType; unitPrice: number; availableQuantity: number }>;
  };
}

const useCartLogic = (concertId: string | null, selectedDate: string | null, data: ConcertData | undefined) => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const initialCategories = data?.concert?.ticketCategories ? mapToTicketCategories(data.concert.ticketCategories) : DEFAULT_CATEGORIES;
  const [ticketCategories, setTicketCategories] = useState<TicketCategory[]>(initialCategories);

  React.useEffect(() => {
    if (data?.concert?.ticketCategories) setTicketCategories(mapToTicketCategories(data.concert.ticketCategories));
  }, [data]);

  const updateQuantity = (id: string, delta: number) => {
    setTicketCategories((prev) =>
      prev.map((ticket) => {
        if (ticket.id !== id) return ticket;
        const newQuantity = ticket.quantity + delta;
        const error = validateQuantity(newQuantity, ticket);
        if (error) {
          setErrorMessage(error);
          return ticket;
        }
        setErrorMessage(null);
        return { ...ticket, quantity: newQuantity };
      })
    );
  };

  const getTotalAmount = () => ticketCategories.reduce((total, ticket) => total + ticket.price * ticket.quantity, 0);
  const getTotalTickets = () => ticketCategories.reduce((total, ticket) => total + ticket.quantity, 0);

  const validateTickets = () => {
    const total = getTotalTickets();
    if (total === 0) {
      setErrorMessage('Дор хаяж нэг тасалбар сонгоно уу!');
      return false;
    }
    if (total > 20) {
      setErrorMessage('Нийт 20-с олон тасалбар захиалах боломжгүй!');
      return false;
    }
    return true;
  };

  const handleProceedToPayment = () => {
    if (!validateTickets()) return;
    const selectedTickets = ticketCategories.filter((t) => t.quantity > 0);
    const ticketData = encodeURIComponent(JSON.stringify(selectedTickets));
    const urlParams = new URLSearchParams();
    urlParams.set('concertId', concertId || '');
    urlParams.set('selectedDate', selectedDate || '');
    urlParams.set('ticketData', ticketData);
    window.location.href = `/checkout?${urlParams.toString()}`;
  };

  return { router, ticketCategories, updateQuantity, getTotalAmount, getTotalTickets, handleProceedToPayment, errorMessage, setErrorMessage };
};

const CartHeader = ({ onBack }: { onBack: () => void }) => (
  <div className="py-4 bg-black border-b border-gray-700">
    <div className="relative flex items-center justify-center max-w-6xl px-6 mx-auto">
      <button onClick={onBack} className="absolute flex items-center justify-center w-12 h-12 text-white transition-colors bg-gray-800 rounded-lg left-6 hover:bg-gray-700" data-testid="back-button">
        <ArrowLeft className="w-5 h-5" />
      </button>
      <h1 className="text-2xl font-bold text-white">Тасалбар захиалах</h1>
    </div>
  </div>
);

const StageImage = () => (
  <div className="lg:col-span-3">
    <div className="relative w-full mx-auto">
      <img src="/images/cart-stage.png" alt="Stage Plan" className="w-full h-auto rounded-lg" />
    </div>
  </div>
);

interface CartSidebarProps {
  selectedDate: string | null;
  ticketCategories: TicketCategory[];
  updateQuantity: (id: string, delta: number) => void;
  getTotalTickets: () => number;
  getTotalAmount: () => number;
  handleProceedToPayment: () => void;
}

const ErrorMessage = ({ message, onClose }: { message: string; onClose: () => void }) => (
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

const CartSidebar = ({ selectedDate, ticketCategories, updateQuantity, getTotalTickets, getTotalAmount, handleProceedToPayment }: CartSidebarProps) => (
  <div className="lg:col-span-2">
    <div className="p-6 space-y-6 rounded-lg" style={{ backgroundColor: '#1f1f1f', border: '1px solid #27272a' }}>
      <div>
        <h3 className="mb-4 text-lg font-light text-gray-400">Тоглолт үзэх өдрөө сонгоно уу.</h3>
        <div className="relative">
          <select
            value={selectedDate || ''}
            className="w-full px-4 py-4 pr-12 text-white transition-all duration-200 rounded-lg appearance-none cursor-pointer hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{ backgroundColor: '#2d2d2d', border: '1px solid #404040' }}
          >
            <option value="">Өдөр сонгох</option>
            <option value="2024.11.15">2024.11.15</option>
            <option value="2024.11.16">2024.11.16</option>
            <option value="2024.11.17">2024.11.17</option>
            <option value="2024.11.18">2024.11.18</option>
          </select>
        </div>
      </div>
      <div className="border-t border-gray-600 border-dashed"></div>
      <div className="space-y-0">
        {ticketCategories.map((category, index) => (
          <div key={category.id}>
            <div className="flex items-start gap-3 py-3">
              <div className="w-3 h-3 mt-1 rounded-full" style={{ backgroundColor: category.color }}></div>
              <div className="flex-1">
                <div className="mb-1 text-base font-medium" style={{ color: category.color }}>
                  {category.name} <span>({category.available})</span>
                </div>
                <div className="text-sm font-light text-white">{category.price.toLocaleString()}₮</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(category.id, -1)}
                  disabled={category.quantity === 0}
                  style={{ backgroundColor: '#2d2d2d' }}
                  className="flex items-center justify-center w-8 h-8 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 font-medium text-center text-white">{category.quantity}</span>
                <button
                  onClick={() => updateQuantity(category.id, 1)}
                  disabled={category.quantity >= category.available}
                  style={{ backgroundColor: '#2d2d2d' }}
                  className="flex items-center justify-center w-8 h-8 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            {index < ticketCategories.length - 1 && <div className="border-t border-gray-600 border-dashed"></div>}
          </div>
        ))}
      </div>
      {getTotalTickets() > 0 && (
        <div className="pt-4 space-y-3 border-t border-gray-600">
          <h3 className="text-lg font-medium text-white">Захиалгын дэлгэрэнгүй</h3>
          {ticketCategories
            .filter((t) => t.quantity > 0)
            .map((t) => (
              <div key={t.id} className="flex items-center justify-between">
                <span className="font-light text-gray-300">
                  {t.name} x {t.quantity}
                </span>
                <span className="font-medium text-white">{(t.price * t.quantity).toLocaleString()}₮</span>
              </div>
            ))}
          <div className="pt-3 border-t border-gray-600">
            <div className="flex items-center justify-between">
              <span className="text-lg font-light text-gray-400">Нийт төлөх дүн:</span>
              <span className="text-xl font-bold text-white">{getTotalAmount().toLocaleString()}₮</span>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={handleProceedToPayment}
        disabled={getTotalTickets() === 0}
        style={{ backgroundColor: '#00b7f4' }}
        className="w-full px-6 py-4 font-bold text-white transition-colors rounded-lg disabled:opacity-50"
      >
        Тасалбар авах
      </button>
    </div>
  </div>
);

interface CartLayoutProps {
  router: { back: () => void };
  selectedDate: string | null;
  ticketCategories: TicketCategory[];
  updateQuantity: (id: string, delta: number) => void;
  getTotalAmount: () => number;
  getTotalTickets: () => number;
  handleProceedToPayment: () => void;
  errorMessage: string | null;
  setErrorMessage: (msg: string | null) => void;
}

const CartLayout = ({ router, selectedDate, ticketCategories, updateQuantity, getTotalAmount, getTotalTickets, handleProceedToPayment, errorMessage, setErrorMessage }: CartLayoutProps) => (
  <div className="flex-1 text-white bg-black">
    <CartHeader onBack={() => router.back()} />
    <div className="max-w-6xl px-6 py-8 mx-auto">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <StageImage />
        <CartSidebar
          selectedDate={selectedDate}
          ticketCategories={ticketCategories}
          updateQuantity={updateQuantity}
          getTotalTickets={getTotalTickets}
          getTotalAmount={getTotalAmount}
          handleProceedToPayment={handleProceedToPayment}
        />
      </div>
    </div>
    {errorMessage && <ErrorMessage message={errorMessage} onClose={() => setErrorMessage(null)} />}
  </div>
);

export const CartContent: React.FC<CartContentProps> = ({ concertId, selectedDate }) => {
  const { data, loading, error } = useGetConcertQuery({ variables: { id: concertId || '' }, skip: !concertId });
  const logic = useCartLogic(concertId, selectedDate, data);

  if (loading) return <LoadingState />;
  if (error || !data?.concert) return <ErrorState onBack={() => logic.router.back()} />;

  return <CartLayout {...logic} selectedDate={selectedDate} />;
};

export default CartContent;
