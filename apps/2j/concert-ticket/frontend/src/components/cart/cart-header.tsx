import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface CartHeaderProps {
  onBackClick: () => void;
}

export const CartHeader: React.FC<CartHeaderProps> = ({ onBackClick }) => {
  return (
    <div className="py-4 bg-black border-b border-gray-700">
      <div className="relative flex items-center justify-center max-w-6xl px-6 mx-auto">
        <button
          onClick={onBackClick}
          className="absolute flex items-center justify-center w-12 h-12 text-white transition-colors bg-gray-800 rounded-lg left-6 hover:bg-gray-700"
          data-testid="back-button"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-white">Тасалбар захиалах</h1>
      </div>
    </div>
  );
};
