import type { TicketCategory } from '@/types/Event.type';

const isValidPrice = (price: number): boolean => typeof price === 'number' && Number.isFinite(price);

export const getLowestPrice = (categories: TicketCategory[]): number | undefined => {
  const validPrices = categories.map((c) => c.unitPrice).filter(isValidPrice);
  return validPrices.length > 0 ? Math.min(...validPrices) : undefined;
};

export const getLowestDiscountedPrice = (categories: TicketCategory[]): number | undefined => {
  const validPrices = categories.map((c) => c.discountedPrice || c.unitPrice).filter(isValidPrice);
  return validPrices.length > 0 ? Math.min(...validPrices) : undefined;
};

export const hasDiscount = (categories: TicketCategory[]): boolean => {
  return categories.some((c) => c.discountPercentage && c.discountPercentage > 0);
};

export const getMaxDiscount = (categories: TicketCategory[]): number => {
  const discounts = categories
    .map((c) => c.discountPercentage)
    .filter((d) => d && d > 0) as number[];
  return discounts.length > 0 ? Math.max(...discounts) : 0;
};

// Concert огнооноос хөнгөлөлтийн хувийг тооцоолох
export const calculateDiscountFromDate = (concertDate: string): number => {
  const concert = new Date(concertDate);
  const now = new Date();
  const daysUntilConcert = Math.ceil((concert.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilConcert >= 60) {
    return 20; // 60+ хоног = 20% хөнгөлөлт
  } else if (daysUntilConcert >= 30) {
    return 10; // 30-59 хоног = 10% хөнгөлөлт
  }
  return 0; // 30 хоногоос бага = хөнгөлөлтгүй
};

const isValidDate = (date: Date): boolean => !isNaN(date.getTime());

const formatDatePart = (date: Date, tz: string, part: string): string => {
  return new Intl.DateTimeFormat('en-US', { timeZone: tz, [part]: '2-digit' }).format(date);
};

const formatValidDate = (date: Date): string => {
  const tz = 'Asia/Ulaanbaatar';
  const mm = formatDatePart(date, tz, 'month');
  const dd = formatDatePart(date, tz, 'day');
  return `${mm}.${dd}`;
};

const parseTimestamp = (timestamp: string): Date => {
  const ts = parseInt(timestamp, 10);
  const ms = String(ts).length === 10 ? ts * 1000 : ts;
  return new Date(ms);
};

// eslint-disable-next-line complexity
const parseDate = (dateStr: string, timeStr?: string): Date => {
  if (/^\d{10,13}$/.test(dateStr)) return parseTimestamp(dateStr);
  if (dateStr.includes('T') && dateStr.includes('Z')) return new Date(dateStr);
  const iso = `${dateStr}T${timeStr ?? '00:00'}:00`;
  return new Date(iso);
};

export const formatDateTime = (dateStr?: string, timeStr?: string): string => {
  if (!dateStr) return '';
  try {
    const dt = parseDate(dateStr, timeStr);
    if (!isValidDate(dt)) {
      console.warn('Invalid date format:', { dateStr, timeStr, parsedDate: dt });
      return 'Invalid date';
    }
    return formatValidDate(dt);
  } catch (error) {
    console.error('Date formatting error:', error, { dateStr, timeStr });
    return 'Date error';
  }
};
