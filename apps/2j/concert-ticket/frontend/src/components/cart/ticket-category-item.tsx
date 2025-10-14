import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface TicketCategory {
  id: string;
  name: string;
  price: number;
  available: number;
  color: string;
  quantity: number;
}

interface TicketCategoryItemProps {
  category: TicketCategory;
  onUpdateQuantity: (id: string, delta: number) => void;
  isLast: boolean;
}

export const TicketCategoryItem: React.FC<TicketCategoryItemProps> = ({ category, onUpdateQuantity, isLast }) => {
  return (
    <div>
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
            onClick={() => onUpdateQuantity(category.id, -1)}
            disabled={category.quantity === 0}
            className="flex items-center justify-center w-8 h-8 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#2d2d2d' }}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 font-medium text-center text-white">{category.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(category.id, 1)}
            disabled={category.quantity >= category.available}
            className="flex items-center justify-center w-8 h-8 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#2d2d2d' }}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      {!isLast && <div className="border-t border-gray-600 border-dashed"></div>}
    </div>
  );
};
