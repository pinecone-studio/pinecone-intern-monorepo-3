'use client';

import { ConcertForAdmin } from '../../types/admin.type';

interface ConcertTableProps {
  concerts: ConcertForAdmin[];
  featuredConcerts: Set<string>;
  onStarClick: (concertId: string) => void;
  onEditClick: (concertId: string) => void;
  onDeleteClick: (concertId: string) => void;
  currentPage: number;
  pageSize: number;
  totalCount: number;
  hasMore: boolean;
  onPageChange: (page: number) => void;
}

// Helper functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('mn-MN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatTime = (timeString: string) => {
  return timeString.substring(0, 5); // HH:MM форматаар харуулах
};

const getPriceRange = (ticketCategories: any[]) => {
  const prices = ticketCategories.map(cat => cat.unitPrice);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
};

// Концертын зураг харуулах компонент
const ConcertImage = ({ concert }: { concert: ConcertForAdmin }) => (
  <div className="flex-shrink-0 h-10 w-10">
    {concert.image ? (
      <img 
        className="h-10 w-10 rounded-lg object-cover" 
        src={concert.image} 
        alt={concert.name}
      />
    ) : (
      <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
        <span className="text-gray-400 text-xs">Зураг</span>
      </div>
    )}
  </div>
);

// Концертын нэр харуулах компонент
const ConcertName = ({ concert, isFeatured }: { concert: ConcertForAdmin; isFeatured: boolean }) => (
  <div className="ml-3">
    <div className="text-sm font-medium text-gray-900 flex items-center">
      {concert.name}
      {isFeatured && (
        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
          Онцлох
        </span>
      )}
    </div>
    <div className="text-sm text-gray-500">{concert.venue}</div>
  </div>
);

// Концертын мэдээллийг харуулах компонент
const ConcertRow = ({ 
  concert, 
  isFeatured, 
  onStarClick, 
  onEditClick, 
  onDeleteClick 
}: {
  concert: ConcertForAdmin;
  isFeatured: boolean;
  onStarClick: (concertId: string) => void;
  onEditClick: (concertId: string) => void;
  onDeleteClick: (concertId: string) => void;
}) => {
  const priceRange = getPriceRange(concert.ticketCategories);

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center">
          <ConcertImage concert={concert} />
          <ConcertName concert={concert} isFeatured={isFeatured} />
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="text-sm text-gray-900">{concert.mainArtist?.name || 'Тодорхойгүй'}</div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="text-sm text-gray-900">{formatDate(concert.date)}</div>
        <div className="text-sm text-gray-500">{formatTime(concert.time)}</div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {priceRange.min.toLocaleString()}₮ - {priceRange.max.toLocaleString()}₮
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="space-y-1">
          <div className="text-sm font-medium text-gray-900">
            Нийт: {concert.totalAvailableTickets}
          </div>
          <div className="flex flex-wrap gap-2">
            {concert.ticketCategories.map((category) => (
              <div key={category.id} className="text-xs text-gray-600">
                <span className="font-medium">
                  {category.type === 'GENERAL_ADMISSION' ? 'Задгай' : 
                   category.type === 'VIP' ? 'VIP' : 
                   category.type === 'REGULAR' ? 'Энгийн' : category.type}:
                </span> {category.availableQuantity}
              </div>
            ))}
          </div>
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center justify-center">
          <div className={`w-3 h-3 rounded-full ${
            concert.isActive ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onStarClick(concert.id)}
            className={`p-1 rounded-full transition-colors ${
              isFeatured 
                ? 'text-yellow-500 hover:text-yellow-600' 
                : 'text-gray-400 hover:text-yellow-500'
            }`}
            title={isFeatured ? 'Онцлохоос хасах' : 'Онцлох'}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
          <button
            onClick={() => onEditClick(concert.id)}
            className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition-colors"
            title="Засах"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDeleteClick(concert.id)}
            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors"
            title="Устгах"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
};

// Pagination компонент
const Pagination = ({ 
  currentPage, 
  pageSize, 
  totalCount, 
  hasMore, 
  onPageChange 
}: {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  hasMore: boolean;
  onPageChange: (page: number) => void;
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasMore && currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalCount === 0) return null;

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Өмнөх
        </button>
        <button
          onClick={handleNext}
          disabled={!hasMore}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Дараах
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            <span className="font-medium">{startItem}</span> - <span className="font-medium">{endItem}</span> / <span className="font-medium">{totalCount}</span> үр дүн
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Өмнөх</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === pageNum
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={handleNext}
              disabled={!hasMore}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Дараах</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

// Концертуудын хүснэгт
const ConcertTable = ({
  concerts,
  featuredConcerts,
  onStarClick,
  onEditClick,
  onDeleteClick,
  currentPage,
  pageSize,
  totalCount,
  hasMore,
  onPageChange
}: ConcertTableProps) => {
  if (concerts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Концерт олдсонгүй</h3>
          <p className="mt-1 text-sm text-gray-500">Одоогоор нэмэгдсэн концерт байхгүй байна.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Концерт
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Уран бүтээлч
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Огноо
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Үнэ
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Тасалбар
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Төлөв
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Үйлдэл
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {concerts.map((concert) => (
              <ConcertRow
                key={concert.id}
                concert={concert}
                isFeatured={featuredConcerts.has(concert.id)}
                onStarClick={onStarClick}
                onEditClick={onEditClick}
                onDeleteClick={onDeleteClick}
              />
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalCount={totalCount}
        hasMore={hasMore}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default ConcertTable;
