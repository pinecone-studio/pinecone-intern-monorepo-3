'use client';

import { useState, useEffect } from 'react';
import { useGetConcertsQuery, useDeleteConcertMutation } from '../../generated';
import ConcertTable from '../../components/admin/ConcertTable';
import AddTicketModal from '../../components/admin/AddTicketModal';
import FeaturedModal from '../../components/admin/FeaturedModal';
import EditConcertModal from '../../components/admin/EditConcertModal';

type TabType = 'tickets' | 'refunds';

const useAdminState = () => {
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
  const [selectedConcert, setSelectedConcert] = useState<{ id: string; name: string; [key: string]: unknown } | null>(null);

  return {
    activeTab, setActiveTab,
    currentPage, setCurrentPage,
    pageSize,
    showFeaturedModal, setShowFeaturedModal,
    selectedConcertForFeatured, setSelectedConcertForFeatured,
    featuredConcerts, setFeaturedConcerts,
    searchQuery, setSearchQuery,
    debouncedSearchQuery, setDebouncedSearchQuery,
    showAddTicketModal, setShowAddTicketModal,
    showEditConcertModal, setShowEditConcertModal,
    selectedConcert, setSelectedConcert
  };
};

const useAdminHandlers = (
  concerts: { id: string; name: string; [key: string]: unknown }[],
  setSelectedConcertForFeatured: (id: string | null) => void,
  setShowFeaturedModal: (show: boolean) => void,
  setSelectedConcert: (concert: { id: string; name: string; [key: string]: unknown }) => void,
  setShowEditConcertModal: (show: boolean) => void,
  deleteConcert: (variables: { variables: { id: string } }) => Promise<unknown>,
  setFeaturedConcerts: (fn: (prev: Set<string>) => Set<string>) => void,
  refetch: () => void
) => {
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

    const confirmed = window.confirm(
      `"${concert.name}" концертыг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй.`
    );

    if (!confirmed) return;

    try {
      await deleteConcert({
        variables: { id: concertId }
      });

      alert('Концерт амжилттай устгагдлаа!');
      
      setFeaturedConcerts(prev => {
        const newSet = new Set(prev);
        newSet.delete(concertId);
        return newSet;
      });

      refetch();
    } catch (error) {
      console.error('Error deleting concert:', error);
      alert('Концерт устгахэд алдаа гарлаа');
    }
  };

  return { handleStarClick, handleEditClick, handleDeleteClick };
};

const SearchSection = ({ 
  searchQuery, 
  handleSearchChange, 
  clearSearch 
}: {
  searchQuery: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearSearch: () => void;
}) => (
  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
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
    <div className="flex gap-1">
      <button className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
        Уран бүтээлч
      </button>
      <button className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
        Цэвэрлэх Х
      </button>
    </div>
    <div className="ml-auto">
      <input
        type="date"
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  </div>
);

const LoadingSection = () => (
  <div className="bg-white rounded-lg shadow p-8 text-center">
    <div className="flex justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
    <p className="mt-2 text-gray-500">Ачааллаж байна...</p>
  </div>
);

const ErrorSection = ({ error }: { error: { message: string } }) => (
  <div className="bg-white rounded-lg shadow p-8 text-center">
    <p className="text-red-500">Алдаа: {error.message}</p>
  </div>
);

const MainContent = ({
  activeTab,
  setActiveTab,
  searchQuery,
  handleSearchChange,
  clearSearch,
  concertsLoading,
  concertsError,
  sortedConcerts,
  featuredConcerts,
  handleStarClick,
  handleEditClick,
  handleDeleteClick,
  currentPage,
  pageSize,
  totalCount,
  hasMore,
  onPageChange,
  setShowAddTicketModal
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearSearch: () => void;
  concertsLoading: boolean;
  concertsError: { message: string };
  sortedConcerts: { id: string; name: string; [key: string]: unknown }[];
  featuredConcerts: Set<string>;
  handleStarClick: (id: string) => void;
  handleEditClick: (id: string) => void;
  handleDeleteClick: (id: string) => void;
  currentPage: number;
  pageSize: number;
  totalCount: number;
  hasMore: boolean;
  onPageChange: (page: number) => void;
  setShowAddTicketModal: (show: boolean) => void;
}) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'tickets'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Тасалбар
        </button>
        <button
          onClick={() => setActiveTab('refunds')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'refunds'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Буцаалт
        </button>
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

    <SearchSection 
      searchQuery={searchQuery}
      handleSearchChange={handleSearchChange}
      clearSearch={clearSearch}
    />

    {concertsLoading ? (
      <LoadingSection />
    ) : concertsError ? (
      <ErrorSection error={concertsError} />
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
        onPageChange={onPageChange}
      />
    )}
  </div>
);

const AdminLayout = ({ 
  activeTab, 
  setActiveTab, 
  renderTabContent 
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  renderTabContent: () => React.ReactNode;
}) => (
  <div className="min-h-screen bg-gray-50">
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

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {renderTabContent()}
    </div>
  </div>
);

const AdminPage = () => {
  const {
    activeTab, setActiveTab,
    currentPage, setCurrentPage,
    pageSize,
    setSelectedConcertForFeatured,
    featuredConcerts, setFeaturedConcerts,
    searchQuery, setSearchQuery,
    debouncedSearchQuery, setDebouncedSearchQuery
  } = useAdminState();
  
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

  const [deleteConcert] = useDeleteConcertMutation();

  // Sort concerts: featured first, then by name
  const sortedConcerts = [...concerts].sort((a, b) => {
    const aFeatured = featuredConcerts.has(a.id);
    const bFeatured = featuredConcerts.has(b.id);
    
    if (aFeatured && !bFeatured) return -1;
    if (!aFeatured && bFeatured) return 1;
    return a.name.localeCompare(b.name);
  });

  // Event handlers
  const { handleStarClick, handleEditClick, handleDeleteClick } = useAdminHandlers(
    concerts,
    setSelectedConcertForFeatured,
    setShowFeaturedModal,
    setSelectedConcert,
    setShowEditConcertModal,
    deleteConcert,
    setFeaturedConcerts,
    refetch
  );


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const clearSearch = () => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setCurrentPage(1);
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
      setShowFeaturedModal(false);
      setSelectedConcertForFeatured(null);
    }
  };

  const renderTabContent = () => {
    if (activeTab === 'tickets') {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-black mb-2">Тасалбар</h2>
              <p className="text-gray-600">Идэвхитэй зарагдаж буй тасалбарууд</p>
            </div>
          </div>
          <MainContent
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            searchQuery={searchQuery}
            handleSearchChange={handleSearchChange}
            clearSearch={clearSearch}
            concertsLoading={concertsLoading}
            concertsError={concertsError}
            sortedConcerts={sortedConcerts}
            featuredConcerts={featuredConcerts}
            handleStarClick={handleStarClick}
            handleEditClick={handleEditClick}
            handleDeleteClick={handleDeleteClick}
            currentPage={currentPage}
            pageSize={pageSize}
            totalCount={totalCount}
            hasMore={hasMore}
            onPageChange={setCurrentPage}
            setShowAddTicketModal={() => {}}
          />
        </div>
      );
    }
    
    if (activeTab === 'refunds') {
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
    }
    
    return null;
  };

  return (
    <>
      <AdminLayout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        renderTabContent={renderTabContent}
      />
      
      <AddTicketModal
        isOpen={showAddTicketModal}
        onClose={() => setShowAddTicketModal(false)}
      />
      
      <FeaturedModal
        isOpen={showFeaturedModal}
        onClose={() => setShowFeaturedModal(false)}
        concertId={selectedConcertForFeatured}
        onSave={handleFeaturedSave}
      />
      
      <EditConcertModal
        isOpen={showEditConcertModal}
        onClose={() => setShowEditConcertModal(false)}
        concert={selectedConcert}
      />
    </>
  );
};

export default AdminPage;