// EventCard-ийн utility функцууд
import type { TicketCategory } from '@/types/Event.type';

export const getLowestPrice = (categories: TicketCategory[]): number | undefined =>
  categories.length === 0
    ? undefined
    : categories.reduce((min, t) => (t.unitPrice < min ? t.unitPrice : min), Number.POSITIVE_INFINITY);

// Хүчинтэй огноо эсэхийг шалгах функц
const isValidDate = (date: Date): boolean => !isNaN(date.getTime());

// Огноо форматлах функц
const formatDatePart = (date: Date, tz: string, part: string): string => {
  return new Intl.DateTimeFormat('en-US', { timeZone: tz, [part]: '2-digit' }).format(date);
};

// Огноо форматлах үндсэн логик
const formatValidDate = (date: Date): string => {
  const tz = 'Asia/Ulaanbaatar';
  const mm = formatDatePart(date, tz, 'month');
  const dd = formatDatePart(date, tz, 'day');
  const hh = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: '2-digit', hour12: false }).format(date);
  const min = formatDatePart(date, tz, 'minute');
  return `${mm}.${dd} ${hh}:${min}`;
};

export const formatDateTime = (dateStr?: string, timeStr?: string): string => {
  if (!dateStr) return '';
  
  const iso = `${dateStr}T${timeStr ?? '00:00'}:00`;
  const dt = new Date(iso);
  
  if (!isValidDate(dt)) {
    console.warn('Invalid date format:', { dateStr, timeStr, iso });
    return dateStr;
  }
  
  return formatValidDate(dt);
};
