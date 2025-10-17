// EventCard-ийн utility функцууд
import type { TicketCategory } from '@/types/Event.type';

// eslint-disable-next-line complexity
export const getLowestPrice = (categories: TicketCategory[]): number | undefined => {
  let min: number | undefined;
  for (const c of categories) {
    const p = c.unitPrice;
    if (typeof p !== 'number' || !Number.isFinite(p)) continue;
    if (min === undefined || p < min) min = p;
  }
  return min;
};

// Хүчинтэй огноо эсэхийг шалгах функц
const isValidDate = (date: Date): boolean => !isNaN(date.getTime());

// Огноо форматлах функц
const formatDatePart = (date: Date, tz: string, part: string): string => {
  return new Intl.DateTimeFormat('en-US', { timeZone: tz, [part]: '2-digit' }).format(date);
};

// Огноо форматлах үндсэн логик - Figma дагуу зөвхөн сар.өдөр
const formatValidDate = (date: Date): string => {
  const tz = 'Asia/Ulaanbaatar';
  const mm = formatDatePart(date, tz, 'month');
  const dd = formatDatePart(date, tz, 'day');
  return `${mm}.${dd}`;
};

// eslint-disable-next-line complexity
export const formatDateTime = (dateStr?: string, timeStr?: string): string => {
  if (!dateStr) return '';
  
  let dt: Date;
  
  // Timestamp эсэхийг шалгах (тоон утга)
  if (/^\d+$/.test(dateStr)) {
    dt = new Date(parseInt(dateStr));
  } else {
    // ISO date эсвэл бусад формат
    const iso = `${dateStr}T${timeStr ?? '00:00'}:00`;
    dt = new Date(iso);
  }
  
  if (!isValidDate(dt)) {
    console.warn('Invalid date format:', { dateStr, timeStr });
    return dateStr;
  }
  
  return formatValidDate(dt);
};
