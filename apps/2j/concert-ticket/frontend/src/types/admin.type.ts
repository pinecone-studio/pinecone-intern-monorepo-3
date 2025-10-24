// Admin хуудасны TypeScript types

export type TabType = 'concerts' | 'orders';

export interface AdminState {
  activeTab: TabType;
  currentPage: number;
  pageSize: number;
  showFeaturedModal: boolean;
  selectedConcertForFeatured: string | null;
  featuredConcerts: Set<string>;
  searchQuery: string;
  debouncedSearchQuery: string;
  showAddTicketModal: boolean;
  showEditConcertModal: boolean;
  selectedConcert: ConcertForAdmin | null;
}

export interface ConcertForAdmin {
  id: string;
  name: string;
  description?: string | null;
  venue: string;
  date: string;
  time: string;
  image?: string | null;
  isActive: boolean;
  mainArtist?: {
    id: string;
    name: string;
    image?: string | null;
  } | null;
  otherArtists?: Array<{
    id: string;
    name: string;
    image?: string | null;
  }> | null;
  ticketCategories: Array<{
    id: string;
    type: string;
    totalQuantity: number;
    availableQuantity: number;
    unitPrice: number;
    discountedPrice?: number | null;
    discountPercentage?: number | null;
    description?: string | null;
    features?: string[] | null;
  }>;
  totalAvailableTickets: number;
}

export interface FormData {
  name: string;
  description: string;
  venue: string;
  date: string;
  time: string;
  image: string;
  mainArtistName: string;
  vipQuantity: string;
  vipPrice: string;
  regularQuantity: string;
  regularPrice: string;
  generalQuantity: string;
  generalPrice: string;
}

export interface ImageUploadState {
  selectedFile: File | null;
  previewUrl: string | null;
  isUploading: boolean;
  uploadError: string | null;
}

export interface ValidationErrors {
  [key: string]: string;
}
