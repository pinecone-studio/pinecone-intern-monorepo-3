import React from 'react';

interface TicketCategory {
  id: string;
  name: string;
  price: number;
  available: number;
  color: string;
  quantity: number;
}

interface OrderSummaryProps {
  ticketCategories: TicketCategory[];
  getTotalTickets: () => number;
  getTotalAmount: () => number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ ticketCategories, getTotalTickets, getTotalAmount }) => {
  if (getTotalTickets() === 0) {
    return null;
  }

  return (
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
  );
};
