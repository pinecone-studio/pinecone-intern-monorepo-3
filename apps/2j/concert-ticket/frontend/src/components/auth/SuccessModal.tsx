'use client';

import { useEffect } from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, message, onClose }: SuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 w-screen h-screen">
      <div className="bg-[#09090B] rounded-lg p-12 w-full max-w-lg border border-gray-800 mx-4">
        <div className="flex flex-col items-center text-center">
          <div className="w-32 h-32 bg-[#09090B] rounded-full flex items-center justify-center mb-4 border border-gray-700">
            <svg className="w-24 h-24 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-white text-lg font-medium mb-4">{message}</h2>
        </div>
      </div>
    </div>
  );
}
