'use client';

import { Star, Pencil, Trash2 } from 'lucide-react';

interface Concert {
  id: string;
  name: string;
  mainArtist?: {
    name: string;
  };
  otherArtists?: Array<{
    name: string;
  }>;
  ticketCategories: Array<{
    type: string;
    totalQuantity: number;
    availableQuantity: number;
    unitPrice: number;
  }>;
  date: string;
  time: string;
}

interface ConcertTableProps {
  concerts: Concert[];
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
  const totalPages = Math.ceil(totalCount / pageSize);

  // Format date to YYYY/MM/DD
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}/${month}/${day}`;
    } catch (error) {
      return dateString; // Return original if parsing fails
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (hasMore) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Concert Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Онцлох
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Тоглолтын нэр
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Артист
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex flex-col">
                    <span>Нийт тоо</span>
                    <div className="flex gap-4 mt-1">
                      <span className="text-xs">VIP</span>
                      <span className="text-xs">Reg</span>
                      <span className="text-xs">Gen</span>
                    </div>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Тоглох өдрүүд
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Нийт ашиг
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Үйлдэл
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {concerts.map((concert) => {
                const isFeatured = featuredConcerts.has(concert.id);
                const totalTickets = concert.ticketCategories.reduce((sum, cat) => sum + cat.totalQuantity, 0);
                const vipTickets = concert.ticketCategories.find(cat => cat.type === 'VIP')?.totalQuantity || 0;
                const regularTickets = concert.ticketCategories.find(cat => cat.type === 'REGULAR')?.totalQuantity || 0;
                const generalTickets = concert.ticketCategories.find(cat => cat.type === 'GENERAL')?.totalQuantity || 0;
                const totalRevenue = concert.ticketCategories.reduce((sum, cat) => sum + (cat.totalQuantity * cat.unitPrice), 0);

                return (
                  <tr key={concert.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {isFeatured && (
                        <Star className="w-5 h-5 text-black fill-current" />
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      <div className="max-w-[250px] truncate">
                        {concert.name}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      <div className="max-w-[200px]">
                        <div className="font-medium text-gray-900 truncate">
                          {concert.mainArtist?.name}
                        </div>
                        {concert.otherArtists && concert.otherArtists.length > 0 && (
                          <div className="text-xs text-gray-400 truncate">
                            +{concert.otherArtists.length} бусад
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      <div className="flex gap-4">
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs text-gray-400">Нийт:</span>
                          <span className="text-sm font-semibold text-gray-900">{totalTickets}</span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs text-gray-400">VIP:</span>
                          <span className="text-sm font-semibold text-gray-900">{vipTickets}</span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs text-gray-400">Reg:</span>
                          <span className="text-sm font-semibold text-gray-900">{regularTickets}</span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs text-gray-400">Gen:</span>
                          <span className="text-sm font-semibold text-gray-900">{generalTickets}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      <div>
                        <div className="font-medium text-gray-900">
                          {formatDate(concert.date)}
                        </div>
                        <div className="text-xs text-gray-400">{concert.time}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      <div className="max-w-[120px] truncate">
                        ₮{totalRevenue.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onStarClick(concert.id)}
                          className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                            isFeatured ? 'text-black' : 'text-gray-400'
                          }`}
                        >
                          <Star className={`w-4 h-4 ${isFeatured ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={() => onEditClick(concert.id)}
                          className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteClick(concert.id)}
                          className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Өмнөх
            </button>
            
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={handleNextPage}
              disabled={!hasMore}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Дараах
            </button>
          </div>
          
          <div className="text-sm text-gray-500">
            {totalCount} тоглолт
          </div>
        </div>
      )}
    </div>
  );
};

export default ConcertTable;
