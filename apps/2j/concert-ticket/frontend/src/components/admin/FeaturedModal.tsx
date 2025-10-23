'use client';

import { X } from 'lucide-react';

interface FeaturedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (isFeatured: boolean) => void;
}

const FeaturedModal = ({ isOpen, onClose, onSave }: FeaturedModalProps) => {
  const handleSave = () => {
    const selectedValue = (document.querySelector('input[name="featured"]:checked') as HTMLInputElement)?.value;
    onSave(selectedValue === 'yes');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Онцлох тоглолт болгох
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="featured"
                value="yes"
                className="w-4 h-4 text-blue-600"
                defaultChecked={false}
              />
              <span className="text-gray-700">Тийм</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="featured"
                value="no"
                className="w-4 h-4 text-blue-600"
                defaultChecked={true}
              />
              <span className="text-gray-700">Үгүй</span>
            </label>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Цуцлах
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Хадгалах
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedModal;
