'use client';

import { useState, useEffect } from 'react';
import { useGetAdminConcertsQuery, useDeleteConcertMutation } from '../../generated';
import ConcertTable from '../../components/admin/ConcertTable';
import AddTicketModal from '../../components/admin/AddTicketModal';
import FeaturedModal from '../../components/admin/FeaturedModal';
import EditConcertModal from '../../components/admin/EditConcertModal';
import AddConcertModal from '../../components/admin/AddConcertModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorDisplay from '../../components/common/ErrorDisplay';
import { TabType, ConcertForAdmin } from '../../types/admin.type';

// Admin хуудасны state management hook
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
  const [showAddConcertModal, setShowAddConcertModal] = useState(false);
  const [selectedConcert, setSelectedConcert] = useState<ConcertForAdmin | null>(null);

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
    showAddConcertModal, setShowAddConcertModal,
    selectedConcert, setSelectedConcert
  };
};

// Event handlers hook
const useAdminHandlers = (
  concerts: ConcertForAdmin[],
  setSelectedConcertForFeatured: (id: string | null) => void,
  setShowFeaturedModal: (show: boolean) => void,
  setSelectedConcert: (concert: ConcertForAdmin) => void,
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

// Хайлтын хэсэг компонент
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
    <div className="flex items-center gap-2">
      <div className="relative">
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
      <div className="flex gap-2">
        <button className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200">
          Уран бүтээлч
        </button>
        <button 
          onClick={clearSearch}
          className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200"
        >
          Цэвэрлэх Х
        </button>
      </div>
    </div>
    <div className="ml-auto">
      <input
        type="date"
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  </div>
);


// Admin хуудасны data management hook
const useAdminData = () => {
  const state = useAdminState();
  
  // Search query-г debounce хийх
  useEffect(() => {
    const timer = setTimeout(() => {
      state.setDebouncedSearchQuery(state.searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [state.searchQuery]);

  // GraphQL query
  const { data: concertsData, loading: concertsLoading, error: concertsError, refetch } = useGetAdminConcertsQuery({
    variables: {
      filter: state.debouncedSearchQuery ? { name: state.debouncedSearchQuery } : undefined,
      pagination: {
        limit: state.pageSize,
        offset: (state.currentPage - 1) * state.pageSize
      }
    }
  });

  const concerts = (concertsData?.concerts?.concerts || []) as ConcertForAdmin[];
  const totalCount = concertsData?.concerts?.totalCount || 0;
  const hasMore = concertsData?.concerts?.hasMore || false;

  return { ...state, concerts, totalCount, hasMore, concertsLoading, concertsError, refetch };
};

// Admin хуудасны event handlers hook
const useAdminEventHandlers = (
  concerts: ConcertForAdmin[],
  featuredConcerts: Set<string>,
  setFeaturedConcerts: (concerts: Set<string>) => void,
  setSelectedConcertForFeatured: (concert: string | null) => void,
  setShowFeaturedModal: (show: boolean) => void,
  setSelectedConcert: (concert: ConcertForAdmin | null) => void,
  setShowEditConcertModal: (show: boolean) => void,
  deleteConcert: any,
  refetch: () => void,
  searchQuery: string,
  setSearchQuery: (query: string) => void,
  setDebouncedSearchQuery: (query: string) => void,
  setCurrentPage: (page: number) => void
) => {
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setCurrentPage(1);
  };

  return {
    handleStarClick,
    handleEditClick,
    handleDeleteClick,
    handleFeaturedSave,
    handleSearchChange,
    clearSearch
  };
};

// Концертуудыг эрэмбэлэх функц
const sortConcerts = (concerts: ConcertForAdmin[], featuredConcerts: Set<string>) => {
  return [...concerts].sort((a, b) => {
    const aFeatured = featuredConcerts.has(a.id);
    const bFeatured = featuredConcerts.has(b.id);
    
    if (aFeatured && !bFeatured) return -1;
    if (!aFeatured && bFeatured) return 1;
    return a.name.localeCompare(b.name);
  });
};

// Admin header компонент
const AdminHeader = () => (
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
);

// Admin main content компонент
const AdminMainContent = ({
  activeTab, setActiveTab,
  currentPage, setCurrentPage,
  searchQuery, handleSearchChange, clearSearch,
  setShowAddConcertModal,
  sortedConcerts, featuredConcerts,
  handleStarClick, handleEditClick, handleDeleteClick,
  totalCount, hasMore
}: any) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="mb-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('concerts')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'concerts'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Концертууд
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'orders'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Захиалгууд
          </button>
        </nav>
      </div>
    </div>

    {activeTab === 'concerts' && (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <SearchSection 
            searchQuery={searchQuery}
            handleSearchChange={handleSearchChange}
            clearSearch={clearSearch}
          />
          <button
            onClick={() => setShowAddConcertModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Концерт нэмэх
          </button>
        </div>

        <ConcertTable
          concerts={sortedConcerts}
          featuredConcerts={featuredConcerts}
          onStarClick={handleStarClick}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
          currentPage={currentPage}
          totalCount={totalCount}
          hasMore={hasMore}
          onPageChange={setCurrentPage}
        />
      </div>
    )}

    {activeTab === 'orders' && (
      <div className="text-center py-12">
        <p className="text-gray-500">Захиалгууд харах функц хөгжүүлэгдэж байна...</p>
      </div>
    )}
  </div>
);

// Admin modals компонент
const AdminModals = ({
  showFeaturedModal, setShowFeaturedModal, handleFeaturedSave, selectedConcertForFeatured,
  showAddConcertModal, setShowAddConcertModal,
  showEditConcertModal, setShowEditConcertModal, selectedConcert,
  showAddTicketModal, setShowAddTicketModal
}: any) => (
  <>
    <FeaturedModal
      isOpen={showFeaturedModal}
      onClose={() => setShowFeaturedModal(false)}
      onSave={handleFeaturedSave}
      concertId={selectedConcertForFeatured}
    />

    <AddConcertModal
      isOpen={showAddConcertModal}
      onClose={() => setShowAddConcertModal(false)}
      onSuccess={() => {
        setShowAddConcertModal(false);
      }}
    />

    <EditConcertModal
      isOpen={showEditConcertModal}
      onClose={() => setShowEditConcertModal(false)}
      concert={selectedConcert}
      onSuccess={() => {
        setShowEditConcertModal(false);
      }}
    />

    <AddTicketModal
      isOpen={showAddTicketModal}
      onClose={() => setShowAddTicketModal(false)}
    />
  </>
);

// Admin хуудасны JSX хэсэг
const AdminPageContent = ({
  activeTab, setActiveTab,
  currentPage, setCurrentPage,
  showFeaturedModal, setShowFeaturedModal,
  selectedConcertForFeatured,
  featuredConcerts,
  searchQuery,
  showAddTicketModal, setShowAddTicketModal,
  showEditConcertModal, setShowEditConcertModal,
  showAddConcertModal, setShowAddConcertModal,
  selectedConcert,
  sortedConcerts, totalCount, hasMore, concertsLoading, concertsError,
  handleStarClick, handleEditClick, handleDeleteClick,
  handleFeaturedSave, handleSearchChange, clearSearch
}: any) => {
  if (concertsLoading) return <LoadingSpinner />;
  if (concertsError) return <ErrorDisplay error={concertsError} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <AdminMainContent
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        clearSearch={clearSearch}
        setShowAddConcertModal={setShowAddConcertModal}
        sortedConcerts={sortedConcerts}
        featuredConcerts={featuredConcerts}
        handleStarClick={handleStarClick}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
        totalCount={totalCount}
        hasMore={hasMore}
      />
      <AdminModals
        showFeaturedModal={showFeaturedModal}
        setShowFeaturedModal={setShowFeaturedModal}
        handleFeaturedSave={handleFeaturedSave}
        selectedConcertForFeatured={selectedConcertForFeatured}
        showAddConcertModal={showAddConcertModal}
        setShowAddConcertModal={setShowAddConcertModal}
        showEditConcertModal={showEditConcertModal}
        setShowEditConcertModal={setShowEditConcertModal}
        selectedConcert={selectedConcert}
        showAddTicketModal={showAddTicketModal}
        setShowAddTicketModal={setShowAddTicketModal}
      />
    </div>
  );
};

// Admin хуудасны гол компонент
const AdminPage = () => {
  const {
    activeTab, setActiveTab,
    currentPage, setCurrentPage,
    showFeaturedModal, setShowFeaturedModal,
    selectedConcertForFeatured, setSelectedConcertForFeatured,
    featuredConcerts, setFeaturedConcerts,
    searchQuery, setSearchQuery,
    setDebouncedSearchQuery,
    showAddTicketModal, setShowAddTicketModal,
    showEditConcertModal, setShowEditConcertModal,
    showAddConcertModal, setShowAddConcertModal,
    selectedConcert,
    concerts, totalCount, hasMore, concertsLoading, concertsError, refetch
  } = useAdminData();

  const [deleteConcert] = useDeleteConcertMutation();
  const sortedConcerts = sortConcerts(concerts, featuredConcerts);

  const {
    handleStarClick,
    handleEditClick,
    handleDeleteClick,
    handleFeaturedSave,
    handleSearchChange,
    clearSearch
  } = useAdminEventHandlers(
    concerts,
    featuredConcerts,
    setFeaturedConcerts,
    setSelectedConcertForFeatured,
    setShowFeaturedModal,
    selectedConcert,
    setShowEditConcertModal,
    deleteConcert,
    refetch,
    searchQuery,
    setSearchQuery,
    setDebouncedSearchQuery,
    setCurrentPage
  );

  return (
    <AdminPageContent
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      showFeaturedModal={showFeaturedModal}
      setShowFeaturedModal={setShowFeaturedModal}
      selectedConcertForFeatured={selectedConcertForFeatured}
      featuredConcerts={featuredConcerts}
      searchQuery={searchQuery}
      showAddTicketModal={showAddTicketModal}
      setShowAddTicketModal={setShowAddTicketModal}
      showEditConcertModal={showEditConcertModal}
      setShowEditConcertModal={setShowEditConcertModal}
      showAddConcertModal={showAddConcertModal}
      setShowAddConcertModal={setShowAddConcertModal}
      selectedConcert={selectedConcert}
      sortedConcerts={sortedConcerts}
      totalCount={totalCount}
      hasMore={hasMore}
      concertsLoading={concertsLoading}
      concertsError={concertsError}
      handleStarClick={handleStarClick}
      handleEditClick={handleEditClick}
      handleDeleteClick={handleDeleteClick}
      handleFeaturedSave={handleFeaturedSave}
      handleSearchChange={handleSearchChange}
      clearSearch={clearSearch}
    />
  );
};

export default AdminPage;
