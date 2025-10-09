'use client';

import { useMemo, useRef, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GetConcertsDocument, UpdateConcertFeaturedDocument } from '../../generated';

type TabKey = 'tickets' | 'cancel';

// Add Ticket Modal Component
const AddTicketModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    performanceName: '',
    programDetails: '',
    mainArtist: '',
    date: '',
    hour: '',
    minute: '',
    vipQuantity: '',
    vipPrice: '',
    regularQuantity: '',
    regularPrice: '',
    generalQuantity: '',
    generalPrice: '',
    image: ''
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrl = formData.image;
      
      // Upload image if a file was selected
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
        setFormData(prev => ({ ...prev, image: imageUrl }));
      }

      // TODO: Submit to backend with image URL
      console.log('Form submitted:', { ...formData, image: imageUrl });
      onClose();
    } catch (error) {
      console.error('Submit error:', error);
      alert('Тасалбар үүсгэхэд алдаа гарлаа');
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const openCalendar = () => {
    dateInputRef.current?.showPicker?.();
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Зөвхөн зураг файл сонгоно уу');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Зурагийн хэмжээ 5MB-аас бага байх ёстой');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'concert_tickets'); // Upload preset for concert tickets
      formData.append('folder', 'concert-tickets'); // Organize images in a folder

      // Upload to Cloudinary
      const response = await fetch(`https://api.cloudinary.com/v1_1/dxlufhjua/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Зураг оруулахад алдаа гарлаа');
    } finally {
      setIsUploading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl rounded-xl border bg-white p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-6">
          <h3 className="text-2xl font-semibold">Тасалбар нэмэх</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Performance Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тоглолтын нэр*
            </label>
            <input
              type="text"
              value={formData.performanceName}
              onChange={(e) => handleChange('performanceName', e.target.value)}
              placeholder="Нэр оруулах"
              className="w-full rounded-md border border-gray-200 px-3 py-2"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тоглолтын зураг
            </label>
            <div className="relative">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-md border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('');
                      setImageFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-48 bg-gray-100 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="text-center text-gray-500">
                    <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-md flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21,15 16,10 5,21"/>
                      </svg>
                    </div>
                    <p className="text-sm font-medium">Зураг оруулах</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG эсвэл WEBP (хамгийн ихдээ 5MB)</p>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Program Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Хөтөлбөрийн тухай*
            </label>
            <textarea
              value={formData.programDetails}
              onChange={(e) => handleChange('programDetails', e.target.value)}
              placeholder="Дэлгэрэнгүй мэдээлэл"
              rows={4}
              className="w-full rounded-md border border-gray-200 px-3 py-2"
              required
            />
          </div>

          {/* Main Artist */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Үндсэн артистын нэр*
            </label>
            <input
              type="text"
              value={formData.mainArtist}
              onChange={(e) => handleChange('mainArtist', e.target.value)}
              placeholder="Артистын нэр"
              className="w-full rounded-md border border-gray-200 px-3 py-2"
              required
            />
          </div>

          {/* Add Other Artist Button */}
          <div>
            <button
              type="button"
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
            >
              Бусад артист нэмэх +
            </button>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тоглолтын өдөр сонгох*
            </label>
            <div className="relative">
              <input
                ref={dateInputRef}
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className={`custom-date ${formData.date ? 'has-value' : ''} rounded-md border border-gray-200 px-4 py-3 w-full pr-12 text-gray-700`}
                onKeyDown={(e) => {
                  // prevent manual typing while allowing navigation keys
                  const allowed = ['Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
                  if (!allowed.includes(e.key)) e.preventDefault();
                }}
                onClick={openCalendar}
                required
              />
              {!formData.date && (
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">өдөр сонгох</span>
              )}
              <button
                type="button"
                onClick={openCalendar}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                aria-label="Өдөр сонгох"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                  <rect x="3" y="5" width="18" height="16" rx="2"/>
                  <path d="M16 3v4M8 3v4M3 11h18"/>
                  <circle cx="8" cy="15" r="1"/>
                  <circle cx="12" cy="15" r="1"/>
                  <circle cx="16" cy="15" r="1"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тоглолтын цаг сонгох*
            </label>
            <div className="flex gap-4">
              <div className="flex-1">
                <select
                  value={formData.hour}
                  onChange={(e) => handleChange('hour', e.target.value)}
                  className="w-full rounded-md border border-gray-200 px-3 py-2"
                  required
                >
                  <option value="">Цаг</option>
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i.toString().padStart(2, '0')}>
                      {i.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <select
                  value={formData.minute}
                  onChange={(e) => handleChange('minute', e.target.value)}
                  className="w-full rounded-md border border-gray-200 px-3 py-2"
                  required
                >
                  <option value="">Минут</option>
                  {Array.from({ length: 60 }, (_, i) => (
                    <option key={i} value={i.toString().padStart(2, '0')}>
                      {i.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Ticket Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Тасалбарын ангилал</h4>
            
            {/* VIP */}
            <div className="border border-gray-200 rounded-md p-4">
              <h5 className="font-medium mb-3">VIP*</h5>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Нийт тоо хэмжээ</label>
                  <input
                    type="number"
                    value={formData.vipQuantity}
                    onChange={(e) => handleChange('vipQuantity', e.target.value)}
                    className="w-full rounded-md border border-gray-200 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Нэгжийн үнэ</label>
                  <input
                    type="number"
                    value={formData.vipPrice}
                    onChange={(e) => handleChange('vipPrice', e.target.value)}
                    className="w-full rounded-md border border-gray-200 px-3 py-2"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Regular */}
            <div className="border border-gray-200 rounded-md p-4">
              <h5 className="font-medium mb-3">Regular*</h5>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Нийт тоо хэмжээ</label>
                  <input
                    type="number"
                    value={formData.regularQuantity}
                    onChange={(e) => handleChange('regularQuantity', e.target.value)}
                    className="w-full rounded-md border border-gray-200 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Нэгжийн үнэ</label>
                  <input
                    type="number"
                    value={formData.regularPrice}
                    onChange={(e) => handleChange('regularPrice', e.target.value)}
                    className="w-full rounded-md border border-gray-200 px-3 py-2"
                    required
                  />
                </div>
              </div>
            </div>

            {/* General */}
            <div className="border border-gray-200 rounded-md p-4">
              <h5 className="font-medium mb-3">Задгай*</h5>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Нийт тоо хэмжээ</label>
                  <input
                    type="number"
                    value={formData.generalQuantity}
                    onChange={(e) => handleChange('generalQuantity', e.target.value)}
                    className="w-full rounded-md border border-gray-200 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Нэгжийн үнэ</label>
                  <input
                    type="number"
                    value={formData.generalPrice}
                    onChange={(e) => handleChange('generalPrice', e.target.value)}
                    className="w-full rounded-md border border-gray-200 px-3 py-2"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUploading}
            className={`w-full rounded-md py-3 text-lg font-medium ${
              isUploading 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {isUploading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Зураг оруулж байна...
              </div>
            ) : (
              'Үүсгэх'
            )}
          </button>
        </form>
        
        {/* Custom Date Picker Styles */}
        <style jsx>{`
          .custom-date { appearance: none; -webkit-appearance: none; caret-color: transparent; }
          .custom-date::-webkit-calendar-picker-indicator { display: none; }
          /* Completely hide the internal editable text when no value to avoid overlay */
          .custom-date:not(.has-value)::-webkit-datetime-edit { opacity: 0; }
          .custom-date:not(.has-value)::-webkit-datetime-edit-fields-wrapper { opacity: 0; }
          .custom-date:not(.has-value)::selection { background: transparent; }
        `}</style>
      </div>
    </div>
  );
};

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: 'tickets', label: 'Тасалбар' },
  { key: 'cancel', label: 'Цуцлах хүсэлт' },
];

const AdminDashboardPage = () => {
  const [active, setActive] = useState<TabKey>('tickets');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-sky-500" />
            <span className="font-semibold tracking-wide">TICKET BOOKING</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-gray-200" />
        </div>
        <nav className="max-w-7xl mx-auto px-6">
          <ul className="flex gap-6">
            {tabs.map((t) => (
              <li key={t.key}>
                <button
                  onClick={() => setActive(t.key)}
                  className={`py-3 border-b-2 -mb-px ${
                    active === t.key ? 'border-black text-black' : 'border-transparent text-gray-500'
                  }`}
                >
                  {t.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {active === 'tickets' ? <TicketsTab /> : <CancelTab />}
      </main>

      <footer className="text-center text-sm text-gray-500 py-8">©2024 Copyright</footer>
    </div>
  );
};

type TicketRow = {
  id: string;
  title: string;
  artists: string;
  totals: { all: number; vip: number; regular: number; general: number };
  date: string;
  revenue: string;
  featured: boolean;
};

const TicketsTab = () => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Matches backend limit
  
  // Fetch concerts data from GraphQL with pagination
  const { data: concertsData, loading, error, refetch } = useQuery(GetConcertsDocument, {
    variables: {
      pagination: {
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage
      }
    }
  });
  
  // Mutation for updating featured status
  const [updateConcertFeatured] = useMutation(UpdateConcertFeaturedDocument);
  
  // Transform GraphQL data to match the table format
  const rows = useMemo<TicketRow[]>(() => {
    if (!concertsData?.concerts?.concerts) return [];
    
    return concertsData.concerts.concerts.map((concert: {
      id: string;
      name: string;
      date: string;
      time: string;
      venue: string;
      featured?: boolean;
      mainArtist?: { name: string };
      otherArtists?: Array<{ name: string }>;
      ticketCategories?: Array<{
        type: string;
        totalQuantity: number;
        availableQuantity: number;
        unitPrice: number;
      }>;
    }) => {
      // Calculate totals from ticket categories
      const totals = concert.ticketCategories?.reduce((acc: Record<string, number>, category: {
        type: string;
        availableQuantity: number;
      }) => {
        acc.all += category.availableQuantity;
        switch (category.type) {
          case 'VIP':
            acc.vip = category.availableQuantity;
            break;
          case 'REGULAR':
            acc.regular = category.availableQuantity;
            break;
          case 'GENERAL_ADMISSION':
            acc.general = category.availableQuantity;
            break;
        }
        return acc;
      }, { all: 0, vip: 0, regular: 0, general: 0 }) || { all: 0, vip: 0, regular: 0, general: 0 };

      // Calculate revenue (example calculation)
      const revenue = concert.ticketCategories?.reduce((sum: number, cat: {
        totalQuantity: number;
        availableQuantity: number;
        unitPrice: number;
      }) => 
        sum + (cat.totalQuantity - cat.availableQuantity) * cat.unitPrice, 0) || 0;

      // Format date
      const date = new Date(concert.date).toLocaleDateString('en-US', { 
        month: '2-digit', 
        day: '2-digit',
        year: 'numeric'
      });

      // Get artists names
      const artists = [concert.mainArtist?.name, ...(concert.otherArtists?.map((a: { name: string }) => a.name) || [])]
        .filter(Boolean)
        .join(', ');

      return {
        id: concert.id,
        title: concert.name,
        artists: artists || 'Unknown Artist',
        totals,
        date,
        revenue: `${revenue.toLocaleString()}₮`,
        featured: concert.featured || false,
      };
    });
  }, [concertsData]);
  const [modal, setModal] = useState<{ open: boolean; rowId?: string; value: 'yes' | 'no' }>(
    { open: false, rowId: undefined, value: 'no' }
  );
  const [addTicketModal, setAddTicketModal] = useState(false);

  const openFeaturedModal = (rowId: string, current: boolean) => {
    setModal({ open: true, rowId, value: current ? 'yes' : 'no' });
  };

  const saveFeatured = async () => {
    if (!modal.rowId) return;
    
    try {
      const featured = modal.value === 'yes';
      await updateConcertFeatured({
        variables: {
          id: modal.rowId,
          featured: featured
        }
      });
      
      // Refetch the data to update the list with current pagination
      await refetch({
        pagination: {
          limit: itemsPerPage,
          offset: (currentPage - 1) * itemsPerPage
        }
      });
      
      setModal({ open: false, rowId: undefined, value: 'no' });
    } catch (error) {
      console.error('Error updating featured status:', error);
      alert('Онцлох тоглолт болгоход алдаа гарлаа');
    }
  };

  // Calculate pagination info
  const totalCount = concertsData?.concerts?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const openCalendar = () => {
    dateInputRef.current?.showPicker?.();
  };

  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Тасалбар</h2>
          <p className="text-gray-500">Идэвхитэй зарагдаж буй тасалбарууд</p>
        </div>
        <button 
          onClick={() => setAddTicketModal(true)}
          className="rounded-md bg-black text-white px-4 py-2 flex items-center gap-2"
        >
          Тасалбар нэмэх
          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full border border-white">
            +
          </span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <input
          placeholder="Тасалбар хайх"
          className="w-64 rounded-md border border-gray-200 px-3 py-2"
        />
        <button className="rounded-full border px-3 py-1 text-sm">Уран бүтээлч</button>
        
        <button className="rounded-full border px-3 py-1 text-sm">Цэвэрлэх ✕</button>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <input
              ref={dateInputRef}
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={`custom-date ${selectedDate ? 'has-value' : ''} rounded-md border border-gray-200 px-4 py-3 w-56 pr-12 text-gray-700`}
              onKeyDown={(e) => {
                // prevent manual typing while allowing navigation keys
                const allowed = ['Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
                if (!allowed.includes(e.key)) e.preventDefault();
              }}
              onClick={openCalendar}
            />
            {!selectedDate && (
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Өдөр сонгох</span>
            )}
            <button
              type="button"
              onClick={openCalendar}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              aria-label="Өдөр сонгох"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                <rect x="3" y="5" width="18" height="16" rx="2"/>
                <path d="M16 3v4M8 3v4M3 11h18"/>
                <circle cx="8" cy="15" r="1"/>
                <circle cx="12" cy="15" r="1"/>
                <circle cx="16" cy="15" r="1"/>
              </svg>
            </button>
          </div>
          {/* Hide native date placeholder and indicator when no value */}
          <style jsx>{`
            .custom-date { appearance: none; -webkit-appearance: none; caret-color: transparent; }
            .custom-date::-webkit-calendar-picker-indicator { display: none; }
            /* Completely hide the internal editable text when no value to avoid overlay */
            .custom-date:not(.has-value)::-webkit-datetime-edit { opacity: 0; }
            .custom-date:not(.has-value)::-webkit-datetime-edit-fields-wrapper { opacity: 0; }
            .custom-date:not(.has-value)::selection { background: transparent; }
          `}</style>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              <span>Уншиж байна...</span>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8 text-red-500">
            <span>Өгөгдөл авахад алдаа гарлаа: {error.message}</span>
          </div>
        ) : rows.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-gray-500">
            <span>Тасалбар олдсонгүй</span>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-gray-500">
                <th className="px-4 py-3 text-left w-10">Онцлох</th>
                <th className="px-4 py-3 text-left">Тоглолтын нэр</th>
                <th className="px-4 py-3 text-left">Артист</th>
                <th className="px-4 py-3 text-left">Нийт тоо: {rows.reduce((sum, row) => sum + row.totals.all, 0)}</th>
                <th className="px-4 py-3 text-left">VIP: {rows.reduce((sum, row) => sum + row.totals.vip, 0)}</th>
                <th className="px-4 py-3 text-left">Regular: {rows.reduce((sum, row) => sum + row.totals.regular, 0)}</th>
                <th className="px-4 py-3 text-left">Задгай: {rows.reduce((sum, row) => sum + row.totals.general, 0)}</th>
                <th className="px-4 py-3 text-left">Тоглох өдрүүд</th>
                <th className="px-4 py-3 text-left">Нийт ашиг</th>
                <th className="px-4 py-3 text-left">Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="px-4 py-3">
                  {row.featured ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 fill-black">
                      <path d="M12 2l2.89 5.86 6.47.94-4.68 4.56 1.1 6.44L12 16.98 6.22 19.8l1.1-6.44L2.64 8.8l6.47-.94L12 2z" />
                    </svg>
                  ) : null}
                </td>
                <td className="px-4 py-3">{row.title}</td>
                <td className="px-4 py-3">{row.artists}</td>
                <td className="px-4 py-3">{row.totals.all}</td>
                <td className="px-4 py-3">{row.totals.vip}</td>
                <td className="px-4 py-3">{row.totals.regular}</td>
                <td className="px-4 py-3">{row.totals.general}</td>
                <td className="px-4 py-3">{row.date}</td>
                <td className="px-4 py-3">{row.revenue}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openFeaturedModal(row.id, row.featured)} className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      {/* outline star in gray square */}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                        <path d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L12 16.9l-5.2 2.6.99-5.78-4.21-4.1 5.82-.85L12 3.5z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      {/* pencil */}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                        <path d="M3 17.25V21h3.75L18.81 8.94l-3.75-3.75L3 17.25z" strokeLinejoin="round"/>
                        <path d="M14.06 5.19 16.81 7.94" strokeLinecap="round"/>
                      </svg>
                    </button>
                    <button className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      {/* trash */}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                        <path d="M6 7h12" strokeLinecap="round"/>
                        <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" strokeLinecap="round"/>
                        <path d="M7 7l1 12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-12" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4">
            <button 
              className="h-8 w-8 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ‹
            </button>
            
            {/* Show page numbers */}
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 7) {
                pageNum = i + 1;
              } else if (currentPage <= 4) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 3) {
                pageNum = totalPages - 6 + i;
              } else {
                pageNum = currentPage - 3 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  className={`h-8 w-8 rounded ${
                    pageNum === currentPage
                      ? 'bg-black text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button 
              className="h-8 w-8 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              ›
            </button>
          </div>
        )}
      </div>

      {/* Featured Modal */}
      <Modal open={modal.open} onClose={() => setModal({ open: false, rowId: undefined, value: 'no' })}>
        <div className="flex items-start justify-between mb-6">
          <h3 className="text-2xl font-semibold">Онцлох тоглолт болгох</h3>
          <button onClick={() => setModal({ open: false, rowId: undefined, value: 'no' })}>✕</button>
        </div>
        <div className="flex items-center gap-10 mb-8">
          <label className="flex items-center gap-3 text-lg">
            <input
              type="radio"
              checked={modal.value === 'yes'}
              onChange={() => setModal((m) => ({ ...m, value: 'yes' }))}
            />
            Тийм
          </label>
          <label className="flex items-center gap-3 text-lg">
            <input
              type="radio"
              checked={modal.value === 'no'}
              onChange={() => setModal((m) => ({ ...m, value: 'no' }))}
            />
            Үгүй
          </label>
        </div>
        <button
          onClick={saveFeatured}
          className="w-full rounded-md bg-gray-900 text-white py-3 text-lg"
        >
          Хадгалах
        </button>
      </Modal>

      {/* Add Ticket Modal */}
      <AddTicketModal open={addTicketModal} onClose={() => setAddTicketModal(false)} />
    </div>
  );
};

const CancelTab = () => {
  return (
    <div className="bg-white border rounded-xl p-6">
      <p className="text-gray-500">Цуцлах хүсэлтүүд энд гарна.</p>
    </div>
  );
};

export default AdminDashboardPage;

// Modal component inside this file for simplicity
const Modal = ({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl rounded-xl border bg-white p-6">
        {children}
      </div>
    </div>
  );
};


