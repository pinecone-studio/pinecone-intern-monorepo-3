'use client';

import React, { useState } from 'react';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TicketCategory {
  id: string;
  name: string;
  price: number;
  available: number;
  color: string;
  quantity: number;
}

export const CartContent: React.FC = () => {
  const router = useRouter();
  const [ticketCategories, setTicketCategories] = useState<TicketCategory[]>([
    {
      id: '1',
      name: 'Арын тасалбар',
      price: 89000,
      available: 123,
      color: '#D7D7F8',
      quantity: 0,
    },
    {
      id: '2',
      name: 'VIP тасалбар',
      price: 129000,
      available: 38,
      color: '#4651c9',
      quantity: 0,
    },
    {
      id: '3',
      name: 'Энгийн тасалбар',
      price: 159000,
      available: 38,
      color: '#c772c4',
      quantity: 0,
    },
  ]);

  const updateQuantity = (id: string, delta: number) => {
    setTicketCategories((prev) =>
      prev.map((ticket) => {
        if (ticket.id === id) {
          const newQuantity = Math.max(0, Math.min(ticket.available, ticket.quantity + delta));
          return { ...ticket, quantity: newQuantity };
        }
        return ticket;
      })
    );
  };

  const getTotalAmount = () => {
    return ticketCategories.reduce((total, ticket) => total + ticket.price * ticket.quantity, 0);
  };

  const getTotalTickets = () => {
    return ticketCategories.reduce((total, ticket) => total + ticket.quantity, 0);
  };

  const handleBackToDetails = () => {
    router.back();
  };

  const handleProceedToPayment = () => {
    console.log('Proceeding to payment...');
  };

  return (
    <div className="flex-1 text-white bg-black">
      <div className="py-4 bg-black border-b border-gray-700">
        <div className="relative flex items-center justify-center max-w-6xl px-6 mx-auto">
          <button
            onClick={handleBackToDetails}
            className="absolute flex items-center justify-center w-12 h-12 text-white transition-colors bg-gray-800 rounded-lg left-6 hover:bg-gray-700"
            data-testid="back-button"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-white">Тасалбар захиалах</h1>
        </div>
      </div>

      <div className="max-w-6xl px-6 py-8 mx-auto">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="relative w-full mx-auto">
              <img src="/images/cart-stage.png" alt="Stage Plan" className="w-full h-auto rounded-lg" />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="p-6 space-y-6 rounded-lg" style={{ backgroundColor: '#1f1f1f', border: '1px solid #27272a' }}>
              <div>
                <h3 className="mb-4 text-lg font-light text-gray-400">Тоглолт үзэх өдрөө сонгоно уу.</h3>
                <div className="relative">
                  <select
                    className="w-full px-4 py-4 pr-12 text-white transition-all duration-200 rounded-lg appearance-none cursor-pointer hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ backgroundColor: '#2d2d2d', border: '1px solid #404040' }}
                  >
                    <option value="" className="text-gray-300">
                      Өдөр сонгох
                    </option>
                    <option value="2024.11.15" className="text-white bg-gray-800">
                      2024.11.15
                    </option>
                    <option value="2024.11.16" className="text-white bg-gray-800">
                      2024.11.16
                    </option>
                    <option value="2024.11.17" className="text-white bg-gray-800">
                      2024.11.17
                    </option>
                    <option value="2024.11.18" className="text-white bg-gray-800">
                      2024.11.18
                    </option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
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
                          {category.name} <span style={{ color: category.color }}>({category.available})</span>
                        </div>
                        <div className="text-sm font-light text-white">{category.price.toLocaleString()}₮</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(category.id, -1)}
                          disabled={category.quantity === 0}
                          className="flex items-center justify-center w-8 h-8 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ backgroundColor: '#2d2d2d' }}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 font-medium text-center text-white">{category.quantity}</span>
                        <button
                          onClick={() => updateQuantity(category.id, 1)}
                          disabled={category.quantity >= category.available}
                          className="flex items-center justify-center w-8 h-8 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ backgroundColor: '#2d2d2d' }}
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
                    .filter((ticket) => ticket.quantity > 0)
                    .map((ticket) => (
                      <div key={ticket.id} className="flex items-center justify-between">
                        <span className="font-light text-gray-300">
                          {ticket.name} x {ticket.quantity}
                        </span>
                        <span className="font-medium text-white">{(ticket.price * ticket.quantity).toLocaleString()}₮</span>
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
                className="w-full px-6 py-4 font-bold text-white transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#00b7f4' }}
              >
                Тасалбар авах
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartContent;
