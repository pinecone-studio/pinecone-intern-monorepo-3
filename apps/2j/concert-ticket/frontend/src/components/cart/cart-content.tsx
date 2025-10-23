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

// Concert огнооноос хөнгөлөлтийн хувийг тооцоолох
const calculateDiscountFromDate = (concertDate: string): number => {
  const concert = new Date(concertDate);
  const now = new Date();
  const daysUntilConcert = Math.ceil((concert.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilConcert >= 60) {
    return 20; // 60+ хоног = 20% хөнгөлөлт
  } else if (daysUntilConcert >= 30) {
    return 10; // 30-59 хоног = 10% хөнгөлөлт
  }
  return 0; // 30 хоногоос бага = хөнгөлөлтгүй
};

interface TicketCategory {
  id: string;
  name: string;
  price: number;
  available: number;
  color: string;
  quantity: number;
  discountPercentage?: number;
  discountedPrice?: number;
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
  discountPercentage?: number;
  discountedPrice?: number;
}

const mapToTicketCategories = (categories: ConcertCategory[]): TicketCategory[] => {
  return categories.map((category) => ({
    id: category.id,
    name: getTicketTypeName(category.type),
    price: category.unitPrice,
    available: category.availableQuantity,
    color: getTicketTypeColor(category.type),
    quantity: 0,
    discountPercentage: category.discountPercentage,
    discountedPrice: category.discountedPrice,
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
        <button onClick={onBack} data-testid="back-button" className="absolute flex items-center justify-center w-12 h-12 text-white transition-colors bg-gray-800 rounded-lg left-6 hover:bg-gray-700">
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
    date?: string;
    ticketCategories?: Array<{ 
      id: string; 
      type: TicketType; 
      unitPrice: number; 
      availableQuantity: number;
      discountPercentage?: number;
      discountedPrice?: number;
    }>;
  };
}

const useCartLogic = (concertId: string | null, selectedDate: string | null, data: ConcertData | undefined) => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentSelectedDate, setCurrentSelectedDate] = useState<string | null>(selectedDate);
  
  // Concert огнооноос хөнгөлөлтийн хувийг тооцоолох
  const concertDate = data?.concert?.date;
  const dateDiscountPercentage = concertDate ? calculateDiscountFromDate(concertDate) : 0;
  
  const initialCategories = data?.concert?.ticketCategories ? mapToTicketCategories(data.concert.ticketCategories) : DEFAULT_CATEGORIES;
  const [ticketCategories, setTicketCategories] = useState<TicketCategory[]>(initialCategories);

  React.useEffect(() => {
    if (data?.concert?.ticketCategories) setTicketCategories(mapToTicketCategories(data.concert.ticketCategories));
  }, [data]);

  // Огноо форматлах функц - MM.DD формат
  const formatDateToMMDD = (dateStr: string): string => {
    try {
      let date: Date;

      // Timestamp эсэхийг шалгах
      if (/^\d+$/.test(dateStr)) {
        // Timestamp-г миллисекунд болгож форматлах
        const timestamp = parseInt(dateStr);
        date = new Date(timestamp);
      } else {
        date = new Date(dateStr);
      }

      if (isNaN(date.getTime())) {
        return dateStr;
      }

      // Local огноо ашиглах (timezone асуудал арилгах)
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${mm}.${dd}`;
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateStr;
    }
  };

  // Concert-ийн боломжит огноонуудыг үүсгэх (зөвхөн тухайн тоглолтын огноо)
  const availableDates = React.useMemo(() => {
    try {
      if (!data?.concert?.date) {
        return [formatDateToMMDD(new Date().toISOString())];
      }

      // Зөвхөн тухайн тоглолтын огноо (timestamp эсэхийг шалгахгүй)
      return [formatDateToMMDD(data.concert.date)];
    } catch (error) {
      console.error('Available dates generation error:', error);
      return [formatDateToMMDD(new Date().toISOString())];
    }
  }, [data?.concert?.date, formatDateToMMDD]);

  const onDateChange = (date: string) => {
    setCurrentSelectedDate(date);
  };

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

  const getTotalAmount = () => ticketCategories.reduce((total, ticket) => {
    // Эхлээд backend-ээс ирсэн хөнгөлөлттэй үнийг шалгах
    if (ticket.discountPercentage && ticket.discountPercentage > 0 && ticket.discountedPrice) {
      return total + ticket.discountedPrice * ticket.quantity;
    }
    
    // Backend-ээс хөнгөлөлт ирээгүй бол concert огнооноос тооцоолох
    if (dateDiscountPercentage > 0) {
      const discountedPrice = Math.round(ticket.price * (1 - dateDiscountPercentage / 100));
      return total + discountedPrice * ticket.quantity;
    }
    
    return total + ticket.price * ticket.quantity;
  }, 0);
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
    const selectedTickets = ticketCategories
      .filter((t) => t.quantity > 0)
      .map((t) => ({
        ...t,
        price: t.discountPercentage && t.discountPercentage > 0 && t.discountedPrice 
          ? t.discountedPrice 
          : dateDiscountPercentage > 0
          ? Math.round(t.price * (1 - dateDiscountPercentage / 100))
          : t.price
      }));
    const ticketData = encodeURIComponent(JSON.stringify(selectedTickets));
    const urlParams = new URLSearchParams();
    urlParams.set('concertId', concertId || '');
    urlParams.set('selectedDate', currentSelectedDate || '');
    urlParams.set('ticketData', ticketData);
    window.location.href = `/checkout?${urlParams.toString()}`;
  };

  return { router, ticketCategories, updateQuantity, getTotalAmount, getTotalTickets, handleProceedToPayment, errorMessage, setErrorMessage, availableDates, onDateChange, currentSelectedDate, dateDiscountPercentage };
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
  availableDates?: string[];
  onDateChange?: (date: string) => void;
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

const DateOptions = ({ availableDates, selectedDate }: { availableDates: string[]; selectedDate: string | null }) => {
  if (availableDates && availableDates.length > 0) {
    return (
      <>
        {availableDates.map((date) => (
          <option key={date} value={date}>
            {date}
          </option>
        ))}
      </>
    );
  }
  return <option value={selectedDate || ''}>{selectedDate || 'Өдөр сонгох'}</option>;
};

const DateSelector = ({ selectedDate, availableDates, onDateChange }: { selectedDate: string | null; availableDates: string[]; onDateChange?: (date: string) => void }) => (
  <div>
    <h3 className="mb-4 text-lg font-light text-gray-400">Тоглолт үзэх өдрөө сонгоно уу.</h3>
    <div className="relative">
      <select
        value={selectedDate || ''}
        onChange={(e) => onDateChange?.(e.target.value)}
        className="w-full px-4 py-4 pr-12 text-white transition-all duration-200 rounded-lg appearance-none cursor-pointer hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        style={{ backgroundColor: '#2d2d2d', border: '1px solid #404040' }}
      >
        <option value="">Өдөр сонгох</option>
        <DateOptions availableDates={availableDates} selectedDate={selectedDate} />
      </select>
    </div>
  </div>
);

const TicketSummary = ({ getTotalTickets, getTotalAmount, handleProceedToPayment }: { getTotalTickets: () => number; getTotalAmount: () => number; handleProceedToPayment: () => void }) => (
  <div className="pt-4 border-t border-gray-700">
    <div className="flex justify-between items-center mb-4">
      <span className="text-gray-400">Нийт тасалбар:</span>
      <span className="text-white font-bold">{getTotalTickets()}</span>
    </div>
    <div className="flex justify-between items-center mb-6">
      <span className="text-gray-400">Нийт дүн:</span>
      <span className="text-white font-bold text-xl">{getTotalAmount().toLocaleString('en-US').replace(/,/g, "'")}₮</span>
    </div>
    <button
      onClick={handleProceedToPayment}
      disabled={getTotalTickets() === 0}
      className="w-full py-4 text-white font-bold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90"
      style={{ backgroundColor: '#00B7F4' }}
    >
      Тасалбар авах
    </button>
  </div>
);

// Хөнгөлөлттэй үнийг харуулах компонент
// eslint-disable-next-line complexity
const TicketPriceDisplay = ({ category, dateDiscountPercentage }: { category: any; dateDiscountPercentage: number }) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  const hasDiscount = (category.discountPercentage && category.discountPercentage > 0 && category.discountedPrice) || dateDiscountPercentage > 0;
  
  if (!hasDiscount) {
    return <div className="text-sm font-light text-white">{category.price.toLocaleString()}₮</div>;
  }
  
  const displayPrice = category.discountPercentage && category.discountPercentage > 0 && category.discountedPrice
    ? category.discountedPrice.toLocaleString()
    : Math.round(category.price * (1 - dateDiscountPercentage / 100)).toLocaleString();
    
  const discountPercent = category.discountPercentage && category.discountPercentage > 0 
    ? Math.round(category.discountPercentage)
    : dateDiscountPercentage;
  
  return (
    <div className="flex flex-col">
      <div className="text-sm font-bold text-white">{displayPrice}₮</div>
      <div className="text-xs text-gray-400 line-through">{category.price.toLocaleString()}₮</div>
      <div className="text-xs text-red-400 font-bold">{discountPercent}% хөнгөлөлт</div>
    </div>
  );
};

// Нэг тасалбарын мөр
const TicketItem = ({ category, updateQuantity, dateDiscountPercentage, isLast }: { category: any; updateQuantity: (id: string, delta: number) => void; dateDiscountPercentage: number; isLast: boolean }) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
  <div key={category.id}>
    <div className="flex items-start gap-3 py-3">
      <div className="w-3 h-3 mt-1 rounded-full" style={{ backgroundColor: category.color }}></div>
      <div className="flex-1">
        <div className="mb-1 text-base font-medium" style={{ color: category.color }}>
          {category.name} <span>({category.available})</span>
        </div>
        <TicketPriceDisplay category={category} dateDiscountPercentage={dateDiscountPercentage} />
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
    {!isLast && <div className="border-t border-gray-600 border-dashed"></div>}
  </div>
);

const TicketList = ({ ticketCategories, updateQuantity, dateDiscountPercentage }: { ticketCategories: any[]; updateQuantity: (id: string, delta: number) => void; dateDiscountPercentage: number }) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
  <div className="space-y-0">
    {ticketCategories.map((category, index) => (
      <TicketItem 
        key={category.id}
        category={category} 
        updateQuantity={updateQuantity} 
        dateDiscountPercentage={dateDiscountPercentage}
        isLast={index === ticketCategories.length - 1}
      />
    ))}
  </div>
);

const CartSidebar = ({ selectedDate, ticketCategories, updateQuantity, getTotalTickets, getTotalAmount, handleProceedToPayment, availableDates, onDateChange, dateDiscountPercentage }: CartSidebarProps & { dateDiscountPercentage: number }) => (
  <div className="lg:col-span-2">
    <div className="p-6 space-y-6 rounded-lg" style={{ backgroundColor: '#1f1f1f', border: '1px solid #27272a' }}>
      <DateSelector selectedDate={selectedDate} availableDates={availableDates} onDateChange={onDateChange} />
      <div className="border-t border-gray-600 border-dashed"></div>
      <TicketList ticketCategories={ticketCategories} updateQuantity={updateQuantity} dateDiscountPercentage={dateDiscountPercentage} />
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
                <span className="font-medium text-white">
                  {t.discountPercentage && t.discountPercentage > 0 && t.discountedPrice 
                    ? (t.discountedPrice * t.quantity).toLocaleString()
                    : dateDiscountPercentage > 0
                    ? (Math.round(t.price * (1 - dateDiscountPercentage / 100)) * t.quantity).toLocaleString()
                    : (t.price * t.quantity).toLocaleString()}₮
                </span>
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
      <TicketSummary getTotalTickets={getTotalTickets} getTotalAmount={getTotalAmount} handleProceedToPayment={handleProceedToPayment} />
    </div>
  </div>
);

interface RouterLike {
  back: () => void;
}

interface CartLayoutProps {
  router: RouterLike;
  selectedDate: string | null;
  ticketCategories: TicketCategory[];
  updateQuantity: (id: string, delta: number) => void;
  getTotalAmount: () => number;
  getTotalTickets: () => number;
  handleProceedToPayment: () => void;
  errorMessage: string | null;
  setErrorMessage: (msg: string | null) => void;
  availableDates?: string[];
  onDateChange?: (date: string) => void;
}

const CartLayout = ({ router, selectedDate, ticketCategories, updateQuantity, getTotalAmount, getTotalTickets, handleProceedToPayment, errorMessage, setErrorMessage, availableDates, onDateChange, dateDiscountPercentage }: CartLayoutProps & { dateDiscountPercentage: number }) => (
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
          availableDates={availableDates}
          onDateChange={onDateChange}
          dateDiscountPercentage={dateDiscountPercentage}
        />
      </div>
    </div>
    {errorMessage && <ErrorMessage message={errorMessage} onClose={() => setErrorMessage(null)} />}
  </div>
);

export const CartContent: React.FC<CartContentProps> = ({ concertId, selectedDate }) => {
  const { data, loading, error } = useGetConcertQuery({
    variables: { id: concertId || '' },
    skip: !concertId,
    errorPolicy: 'all',
  });
  const logic = useCartLogic(concertId, selectedDate, data);

  if (loading) return <LoadingState />;
  if (error || !data?.concert) return <ErrorState onBack={() => window.history.back()} />;

  return <CartLayout {...logic} selectedDate={logic.currentSelectedDate} dateDiscountPercentage={logic.dateDiscountPercentage} />;
};

export default CartContent;
