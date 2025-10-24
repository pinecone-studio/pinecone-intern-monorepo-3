import React from 'react';

interface ErrorDisplayProps {
  error: any;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="text-red-600 text-xl font-semibold mb-2">
          Алдаа гарлаа
        </div>
        <div className="text-gray-600">
          {error?.message || 'Тодорхойгүй алдаа'}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
