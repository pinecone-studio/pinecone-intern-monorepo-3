'use client';

interface FeaturedModalProps {
  isOpen: boolean;
  onClose: () => void;
  concertId: string | null;
  onSave: (isFeatured: boolean) => void;
}

// Онцлох модал компонент
const FeaturedModal = ({ isOpen, onClose, concertId, onSave }: FeaturedModalProps) => {
  if (!isOpen || !concertId) return null;

  const handleSave = (isFeatured: boolean) => {
    onSave(isFeatured);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Онцлох тохиргоо</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Энэ концертыг онцлох эсэхийг сонгоно уу. Онцлогдсон концертууд хүснэгтийн дээд талд харагдана.
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => handleSave(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Онцлохоос хасах
            </button>
            <button
              onClick={() => handleSave(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 border border-transparent rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Онцлох
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedModal;
