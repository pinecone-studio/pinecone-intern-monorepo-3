import React from 'react';

interface TicketCategory {
  id: string;
  name: string;
  price: number;
  available: number;
  color: string;
}

interface TicketCategoriesProps {
  ticketCategories: TicketCategory[];
  onBookTicket: () => void;
}

export const TicketCategories: React.FC<TicketCategoriesProps> = ({ ticketCategories, onBookTicket }) => {
  return (
    <div className="space-y-4">
      {ticketCategories.map((category) => (
        <div key={category.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
            <div>
              <span className="text-white font-medium" style={{ color: category.color }}>
                {category.name}
              </span>
              <span className="ml-2 text-gray-400">({category.available} ширхэг)</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white font-bold">{category.price.toLocaleString()}₮</span>
            <button onClick={onBookTicket} className="px-6 py-2 text-white transition-colors rounded-lg hover:bg-blue-600" style={{ backgroundColor: '#00b7f4' }}>
              Тасалбар захиалах
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
