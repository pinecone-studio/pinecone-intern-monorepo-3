// Event төрлүүдийг нэгтгэсэн файл
export type Money = number;

export type TicketCategoryType = 'VIP' | 'REGULAR' | 'GENERAL_ADMISSION';

export interface TicketCategory {
  id: string;
  type: TicketCategoryType;
  unitPrice: Money;
  availableQuantity: number;
}

export interface Artist {
  id: string;
  name: string;
  image?: string | null;
}

export interface EventItem {
  id: string;
  name: string;
  venue: string;
  date: string; // ISO date
  time: string; // HH:mm
  image?: string | null;
  mainArtist: Artist;
  ticketCategories: TicketCategory[];
}

export interface SearchResult {
  concerts: EventItem[];
  totalCount: number;
  hasMore: boolean;
}


