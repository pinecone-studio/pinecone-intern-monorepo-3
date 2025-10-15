// EventCard-ийн utility функцууд
import type { TicketCategory } from '@/types/Event.type';

export const getLowestPrice = (categories: TicketCategory[]): number | undefined =>
  categories.length === 0
    ? undefined
    : categories.reduce((min, t) => (t.unitPrice < min ? t.unitPrice : min), Number.POSITIVE_INFINITY);

export const formatDateTime = (dateStr?: string, timeStr?: string): string => {
  if (!dateStr) return '';
  // Compose to local Date using provided date and time (fallback 00:00)
  const iso = `${dateStr}T${timeStr ?? '00:00'}:00`;
  const dt = new Date(iso);
  try {
    const tz = 'Asia/Ulaanbaatar';
    const mm = new Intl.DateTimeFormat('en-US', { timeZone: tz, month: '2-digit' }).format(dt);
    const dd = new Intl.DateTimeFormat('en-US', { timeZone: tz, day: '2-digit' }).format(dt);
    const hh = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: '2-digit', hour12: false }).format(dt);
    const min = new Intl.DateTimeFormat('en-US', { timeZone: tz, minute: '2-digit' }).format(dt);
    return `${mm}.${dd} ${hh}:${min}`;
  } catch {
    return `${dateStr}${timeStr ? ` ${timeStr}` : ''}`;
  }
};
