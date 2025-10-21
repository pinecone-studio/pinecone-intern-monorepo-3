import type { TicketCategory } from '@/types/Event.type';

const isValidPrice = (price: number): boolean => typeof price === 'number' && Number.isFinite(price);

export const getLowestPrice = (categories: TicketCategory[]): number | undefined => {
  const validPrices = categories.map((c) => c.unitPrice).filter(isValidPrice);
  return validPrices.length > 0 ? Math.min(...validPrices) : undefined;
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

const parseDate = (dateStr: string, timeStr?: string): Date => {
  if (/^\d+$/.test(dateStr)) {
    return new Date(parseInt(dateStr));
  }
  const iso = `${dateStr}T${timeStr ?? '00:00'}:00`;
  return new Date(iso);
};

export const formatDateTime = (dateStr?: string, timeStr?: string): string => {
  if (!dateStr) return '';
  const dt = parseDate(dateStr, timeStr);
  if (!isValidDate(dt)) {
    console.warn('Invalid date format:', { dateStr, timeStr });
    return dateStr;
  }
  return formatValidDate(dt);
};
