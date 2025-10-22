'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useMyProfileQuery } from '@/generated';

function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    phone: '',
    email: '',
  });
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // User мэдээлэл авах
  const { data: profileData, loading: profileLoading } = useMyProfileQuery({
    errorPolicy: 'all'
  });


  const concertId = searchParams.get('concertId');
  const selectedDate = searchParams.get('selectedDate');
  const ticketData = searchParams.get('ticketData');

  const selectedTickets = React.useMemo(() => {
    if (!ticketData) return [];
    try {
      return JSON.parse(decodeURIComponent(ticketData)) as Array<{ id: string; name: string; price: number; quantity: number; color: string }>;
    } catch (error) {
      console.error('Error parsing ticket data:', error);
      return [];
    }
  }, [ticketData]);

  const totalItems = selectedTickets.reduce((sum: number, ticket) => sum + ticket.quantity, 0);
  const totalAmount = selectedTickets.reduce((sum: number, ticket) => sum + ticket.price * ticket.quantity, 0);

  // User мэдээлэл ирэхэд form-г default утгаар бөглөх
  React.useEffect(() => {
    if (profileData?.myProfile) {
      setFormData({
        phone: profileData.myProfile.phoneNumber || '',
        email: profileData.myProfile.email || ''
      });
    }
  }, [profileData]);

  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === 'Return') {
        event.preventDefault();
        handleContinue();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [formData.phone, formData.email]); // Dependencies to ensure fresh data

  if (!concertId) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Алдаа</h1>
          <p className="text-gray-300">Концертын мэдээлэл олдсонгүй</p>
        </div>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Ачааллаж байна...</h1>
          <p className="text-gray-300">Хэрэглэгчийн мэдээлэл татаж байна</p>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    router.back();
  };

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
      setErrorMessage('Имэйл оруулна уу!');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrorMessage('Буруу имэйл!');
      return false;
    }
    return true;
  };

  const handleContinue = () => {
    if (!validateForm()) return;

    // Payment page руу шилжих (backend update хийхгүй)
    const urlParams = new URLSearchParams();
    urlParams.set('concertId', concertId);
    urlParams.set('selectedDate', selectedDate || '');
    urlParams.set('ticketData', ticketData || '');
    urlParams.set('phone', formData.phone);
    urlParams.set('email', formData.email);

    window.location.href = `/payment?${urlParams.toString()}`;
  };

  const clearError = () => {
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="py-4 bg-black border-b border-gray-700">
        <div className="relative flex items-center justify-center max-w-6xl px-6 mx-auto">
          <button
            onClick={handleBack}
            className="absolute flex items-center justify-center w-12 h-12 text-white transition-colors bg-gray-800 rounded-lg left-6 hover:bg-gray-700"
            data-testid="back-button"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-white">Захиалга баталгаажуулах</h1>
        </div>
      </div>

      <div className="py-20">
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
                <h2 className="mb-6 text-xl font-semibold text-white">Захиалгын дэлгэрэнгүй</h2>

                {selectedDate && (
                  <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: '#2d2d2d' }}>
                    <h3 className="font-medium text-white mb-2">Сонгосон өдөр</h3>
                    <p className="text-gray-300">{selectedDate}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white">Бүтээгдэхүүний тоо</h3>
                    <span className="text-white">x {totalItems}</span>
                  </div>

                  {selectedTickets.map((ticket, index: number) => (
                    <div key={ticket.id}>
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{
                              backgroundColor: ticket.color,
                            }}
                          />
                          <span className="text-white">{ticket.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-300">{ticket.price.toLocaleString()}₮</span>
                          <span className="text-gray-300">x {ticket.quantity}</span>
                          <span className="text-white font-medium">{(ticket.price * ticket.quantity).toLocaleString()}₮</span>
                        </div>
                      </div>
                      {index < selectedTickets.length - 1 && <div className="border-b border-dashed border-gray-500 my-2"></div>}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-600">
                  <span className="text-lg font-medium text-white">Нийт төлөх дүн:</span>
                  <span className="text-xl font-bold text-white">{totalAmount.toLocaleString()}₮</span>
                </div>

                <button 
                  onClick={handleContinue} 
                  className="w-full px-6 py-4 mt-6 font-bold text-white transition-colors rounded-lg hover:opacity-90" 
                  style={{ backgroundColor: '#00b7f4' }}
                >
                  Үргэлжлүүлэх
                </button>
              </div>
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
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Ачааллаж байна...</h1>
        </div>
      </div>
    }>
      <CheckoutPageContent />
    </Suspense>
  );
}
