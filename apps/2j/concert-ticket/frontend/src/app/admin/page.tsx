'use client';

import { useState, useEffect } from 'react';
import { useGetConcertsQuery, useDeleteConcertMutation } from '../../generated';
import AddTicketModal from '../../components/admin/AddTicketModal';
import FeaturedModal from '../../components/admin/FeaturedModal';
import ConcertTable from '../../components/admin/ConcertTable';
import EditConcertModal from '../../components/admin/EditConcertModal';

type TabType = 'tickets' | 'refunds';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('tickets');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [showFeaturedModal, setShowFeaturedModal] = useState(false);
  const [selectedConcertForFeatured, setSelectedConcertForFeatured] = useState<string | null>(null);
  const [featuredConcerts, setFeaturedConcerts] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [showAddTicketModal, setShowAddTicketModal] = useState(false);
  const [showEditConcertModal, setShowEditConcertModal] = useState(false);
  const [selectedConcert, setSelectedConcert] = useState<any>(null);
  
  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // GraphQL query
  const { data: concertsData, loading: concertsLoading, error: concertsError, refetch } = useGetConcertsQuery({
    variables: {
      filter: debouncedSearchQuery ? { name: debouncedSearchQuery } : undefined,
      pagination: {
        limit: pageSize,
        offset: (currentPage - 1) * pageSize
      }
    }
  });

  const concerts = concertsData?.concerts?.concerts || [];
  const totalCount = concertsData?.concerts?.totalCount || 0;
  const hasMore = concertsData?.concerts?.hasMore || false;

  const [deleteConcert, { loading: deleteLoading }] = useDeleteConcertMutation();

  // Sort concerts: featured first, then by name
  const sortedConcerts = [...concerts].sort((a, b) => {
    const aFeatured = featuredConcerts.has(a.id);
    const bFeatured = featuredConcerts.has(b.id);
    
    if (aFeatured && !bFeatured) return -1;
    if (!aFeatured && bFeatured) return 1;
    return a.name.localeCompare(b.name);
  });

  // Event handlers
  const handleStarClick = (concertId: string) => {
    setSelectedConcertForFeatured(concertId);
    setShowFeaturedModal(true);
  };

  const handleEditClick = (concertId: string) => {
    const concert = concerts.find(c => c.id === concertId);
    if (concert) {
      setSelectedConcert(concert);
      setShowEditConcertModal(true);
    }
  };

  const handleDeleteClick = async (concertId: string) => {
    const concert = concerts.find(c => c.id === concertId);
    if (!concert) return;

    // Confirmation dialog
    const confirmed = window.confirm(
      `"${concert.name}" концертыг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй.`
    );

    if (!confirmed) return;

    try {
      await deleteConcert({
        variables: { id: concertId }
      });

      alert('Концерт амжилттай устгагдлаа!');
      
      // Remove from featured concerts if it was featured
      setFeaturedConcerts(prev => {
        const newSet = new Set(prev);
        newSet.delete(concertId);
        return newSet;
      });

      // Refresh concert list
      refetch();
    } catch (error) {
      console.error('Error deleting concert:', error);
      alert('Концерт устгахэд алдаа гарлаа');
    }
  };

  const handleFeaturedSave = (isFeatured: boolean) => {
    if (selectedConcertForFeatured) {
      const newFeaturedConcerts = new Set(featuredConcerts);
      if (isFeatured) {
        newFeaturedConcerts.add(selectedConcertForFeatured);
      } else {
        newFeaturedConcerts.delete(selectedConcertForFeatured);
      }
      setFeaturedConcerts(newFeaturedConcerts);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const clearSearch = () => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setCurrentPage(1);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tickets':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-black mb-2">Тасалбар</h2>
                <p className="text-gray-600">Идэвхитэй зарагдаж буй тасалбарууд</p>
              </div>
              <button 
                onClick={() => setShowAddTicketModal(true)}
                className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
              >
                <span className="text-lg">+</span>
                <span>Тасалбар нэмэх</span>
                <span className="text-sm">↻</span>
              </button>
            </div>

            {/* Search and Filter Section */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {/* Search Input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Тасалбар хайх"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-64 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Filter Tags */}
              <div className="flex gap-1">
                <button className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
                  Уран бүтээлч
                </button>
                <button className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
                  Цэвэрлэх Х
                </button>
              </div>

              {/* Date Picker */}
              <div className="ml-auto">
                <input
                  type="date"
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Concert Table */}
            {concertsLoading ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="flex justify-center">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="mt-2 text-gray-500">Ачааллаж байна...</p>
              </div>
            ) : concertsError ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-red-500">Алдаа гарлаа: {concertsError.message}</p>
              </div>
            ) : (
              <ConcertTable
                concerts={sortedConcerts}
                featuredConcerts={featuredConcerts}
                onStarClick={handleStarClick}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
                currentPage={currentPage}
                pageSize={pageSize}
                totalCount={totalCount}
                hasMore={hasMore}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        );
      case 'refunds':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-black mb-2">Цуцлах хүсэлт</h2>
                <p className="text-gray-600">Цуцлах хүсэлтүүд</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">Цуцлах хүсэлт олдсонгүй</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="w-full bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-black">TICKET BOOKING</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="w-full bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('tickets')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tickets'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Тасалбар
            </button>
            <button
              onClick={() => setActiveTab('refunds')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'refunds'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Цуцлах хүсэлт
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </div>

      {/* Modals */}
      <FeaturedModal
        isOpen={showFeaturedModal}
        onClose={() => setShowFeaturedModal(false)}
        onSave={handleFeaturedSave}
      />

      <AddTicketModal
        isOpen={showAddTicketModal}
        onClose={() => {
          setShowAddTicketModal(false);
          // Refresh concert list after modal closes
          refetch();
        }}
      />

      <EditConcertModal
        isOpen={showEditConcertModal}
        onClose={() => {
          setShowEditConcertModal(false);
          setSelectedConcert(null);
          // Refresh concert list after modal closes
          refetch();
        }}
        concert={selectedConcert}
      />
    </div>
  );
};

export default AdminPage;