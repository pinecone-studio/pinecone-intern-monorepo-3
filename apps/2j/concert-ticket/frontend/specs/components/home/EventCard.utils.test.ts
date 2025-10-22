import { getLowestPrice, formatDateTime } from '../../../src/components/home/EventCard.utils';
import type { TicketCategory } from '../../../src/types/Event.type';

describe('EventCard.utils', () => {
  describe('getLowestPrice', () => {
    it('returns lowest price from categories', () => {
      const categories: TicketCategory[] = [
        { id: '1', type: 'VIP', unitPrice: 100000, availableQuantity: 10 },
        { id: '2', type: 'REGULAR', unitPrice: 50000, availableQuantity: 20 },
        { id: '3', type: 'GENERAL_ADMISSION', unitPrice: 75000, availableQuantity: 30 },
      ];
      expect(getLowestPrice(categories)).toBe(50000);
    });

    it('returns undefined for empty array', () => {
      expect(getLowestPrice([])).toBeUndefined();
    });

    it('handles invalid prices', () => {
      const categories: TicketCategory[] = [
        { id: '1', type: 'VIP', unitPrice: NaN, availableQuantity: 10 },
        { id: '2', type: 'REGULAR', unitPrice: Infinity, availableQuantity: 20 },
        { id: '3', type: 'GENERAL_ADMISSION', unitPrice: 50000, availableQuantity: 30 },
      ];
      expect(getLowestPrice(categories)).toBe(50000);
    });

    it('handles single category', () => {
      const categories: TicketCategory[] = [{ id: '1', type: 'VIP', unitPrice: 100000, availableQuantity: 10 }];
      expect(getLowestPrice(categories)).toBe(100000);
    });

    it('handles all invalid prices', () => {
      const categories: TicketCategory[] = [
        { id: '1', type: 'VIP', unitPrice: NaN, availableQuantity: 10 },
        { id: '2', type: 'REGULAR', unitPrice: Infinity, availableQuantity: 20 },
      ];
      expect(getLowestPrice(categories)).toBeUndefined();
    });
  });

  describe('formatDateTime', () => {
    it('formats date with time', () => {
      const result = formatDateTime('2024-12-25', '19:00');
      expect(result).toMatch(/\d{2}\.\d{2}/);
    });

    it('formats date without time', () => {
      const result = formatDateTime('2024-12-25');
      expect(result).toMatch(/\d{2}\.\d{2}/);
    });

    it('returns empty string for no date', () => {
      expect(formatDateTime()).toBe('');
      expect(formatDateTime('')).toBe('');
    });

    it('handles timestamp format', () => {
      const result = formatDateTime('1735135200000');
      expect(result).toMatch(/\d{2}\.\d{2}/);
    });

    it('returns "Invalid date" for invalid format', () => {
      const invalid = 'invalid-date';
      const result = formatDateTime(invalid);
      expect(result).toBe('Invalid date');
    });

    it('handles ISO string format with Z', () => {
      const isoDate = '2024-12-25T19:00:00Z';
      const result = formatDateTime(isoDate);
      expect(result).toMatch(/\d{2}\.\d{2}/);
    });

    it('handles date format error and returns "Date error"', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();

      const problematicDate = {
        toString: () => {
          throw new Error('Date conversion error');
        },
      };
      const result = formatDateTime(problematicDate as any);
      expect(result).toBe('Date error');
      expect(consoleError).toHaveBeenCalled();

      consoleError.mockRestore();
    });

    it('handles 10-digit unix timestamp', () => {
      const unixTimestamp = '1703520000'; // 10 digits (seconds)
      const result = formatDateTime(unixTimestamp);
      expect(result).toMatch(/\d{2}\.\d{2}/);
    });

    it('handles 13-digit unix timestamp', () => {
      const unixTimestamp = '1703520000000'; // 13 digits (milliseconds)
      const result = formatDateTime(unixTimestamp);
      expect(result).toMatch(/\d{2}\.\d{2}/);
    });
  });
});
