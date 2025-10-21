'use client';

import React, { useState } from 'react';

interface TicketItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  color: string;
}

interface CheckoutContentProps {
  _concertId: string | null;
  _selectedDate: string | null;
  ticketData: string | null;
}

export const CheckoutContent: React.FC<CheckoutContentProps> = ({ _concertId, _selectedDate, ticketData }) => {
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const ticketItems: TicketItem[] = React.useMemo(() => {
    if (ticketData) {
      try {
        return JSON.parse(decodeURIComponent(ticketData));
      } catch (error) {
        console.error('Error parsing ticket data:', error);
        return [];
      }
    }
    return [
      {
        id: '1',
        name: 'Арын тасалбар',
        price: 89000,
        quantity: 2,
        color: '#D7D7F8',
      },
      {
        id: '2',
        name: 'VIP тасалбар',
        price: 99000,
        quantity: 8,
        color: '#4651c9',
      },
    ];
  }, [ticketData]);

  const totalItems = ticketItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = ticketItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMessage(null);
  };

  const validateForm = () => {
    if (!formData.phone.trim()) {
      setErrorMessage('Утасны дугаар оруулна уу!');
      return false;
    }
    if (!formData.email.trim()) {
      setErrorMessage('Имэйл хаяг оруулна уу!');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrorMessage('Зөв имэйл хаяг оруулна уу!');
      return false;
    }
    return true;
  };

  const handleContinue = () => {
    if (validateForm()) {
      setErrorMessage('Төлбөр боловсруулах хэсэг хөгжүүлэгдэж байна...');
    }
  };

  const clearError = () => {
    setErrorMessage(null);
  };

  return (
    <div className="flex-1 py-8">
      <div className="max-w-6xl px-6 mx-auto">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="p-6 rounded-lg" style={{ backgroundColor: '#1f1f1f', border: '1px solid #27272a' }}>
              <h2 className="mb-6 text-xl font-semibold text-white">Захиалагчийн мэдээлэл</h2>

              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-white">Утасны дугаар:</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="9900-0000"
                    className="w-full px-4 py-3 text-white transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ backgroundColor: '#2d2d2d', border: '1px solid #404040' }}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-white">Имэйл хаяг:</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 text-white transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ backgroundColor: '#2d2d2d', border: '1px solid #404040' }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-lg" style={{ backgroundColor: '#1f1f1f', border: '1px solid #27272a' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Бүтээгдэхүүний тоо</h2>
                <span className="text-lg font-medium text-white">x {totalItems}</span>
              </div>

              <div className="space-y-4 mb-6">
                {ticketItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#2d2d2d' }}>
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full border-2"
                        style={{
                          backgroundColor: item.quantity > 0 ? item.color : 'transparent',
                          borderColor: item.color,
                        }}
                      />
                      <div>
                        <div className="text-white font-medium">{item.name}</div>
                        <div className="text-sm text-gray-400">{item.price.toLocaleString()}₮</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white">x {item.quantity}</div>
                      <div className="text-sm text-gray-400">{(item.price * item.quantity).toLocaleString()}₮</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-600">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-white">Нийт төлөх дүн:</span>
                  <span className="text-xl font-bold text-white">{totalAmount.toLocaleString()}₮</span>
                </div>
              </div>

              <button onClick={handleContinue} className="w-full px-6 py-4 mt-6 font-bold text-white transition-colors rounded-lg hover:opacity-90" style={{ backgroundColor: '#00b7f4' }}>
                Үргэлжлүүлэх
              </button>
            </div>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm">
          <div className="flex items-center justify-between p-4 bg-red-900 border border-red-700 rounded-lg shadow-lg">
            <div className="flex-1">
              <p className="text-sm text-red-100">{errorMessage}</p>
            </div>
            <button onClick={clearError} className="ml-3 text-red-300 hover:text-red-100 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
