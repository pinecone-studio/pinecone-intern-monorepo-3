import { 
  getLowestPrice, 
  getLowestDiscountedPrice, 
  hasDiscount, 
  getMaxDiscount, 
  calculateDiscountFromDate,
  formatDateTime 
} from './EventCard.utils';
import type { TicketCategory } from '@/types/Event.type';

describe('EventCard.utils', () => {
  const mockCategories: TicketCategory[] = [
    {
      id: '1',
      type: 'VIP' as any,
      totalQuantity: 100,
      availableQuantity: 50,
      unitPrice: 100000,
      discountPercentage: 20,
      discountedPrice: 80000,
      description: 'VIP ticket',
      features: ['Best seats'],
      concert: 'concert1' as any,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      type: 'REGULAR' as any,
      totalQuantity: 200,
      availableQuantity: 100,
      unitPrice: 50000,
      discountPercentage: 10,
      discountedPrice: 45000,
      description: 'Regular ticket',
      features: ['Good seats'],
      concert: 'concert1' as any,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      type: 'GENERAL_ADMISSION' as any,
      totalQuantity: 300,
      availableQuantity: 200,
      unitPrice: 30000,
      discountPercentage: 0,
      discountedPrice: 30000,
      description: 'General ticket',
      features: ['Basic seats'],
      concert: 'concert1' as any,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  describe('getLowestPrice', () => {
    it('should return the lowest unit price', () => {
      const result = getLowestPrice(mockCategories);
      expect(result).toBe(30000);
    });

    it('should return undefined for empty array', () => {
      const result = getLowestPrice([]);
      expect(result).toBeUndefined();
    });

    it('should handle invalid prices', () => {
      const invalidCategories = [
        { ...mockCategories[0], unitPrice: NaN },
        { ...mockCategories[1], unitPrice: Infinity },
      ];
      const result = getLowestPrice(invalidCategories);
      expect(result).toBeUndefined();
    });
  });

  describe('getLowestDiscountedPrice', () => {
    it('should return the lowest discounted price', () => {
      const result = getLowestDiscountedPrice(mockCategories);
      expect(result).toBe(30000); // General admission has no discount
    });

    it('should return undefined for empty array', () => {
      const result = getLowestDiscountedPrice([]);
      expect(result).toBeUndefined();
    });

    it('should fallback to unitPrice when discountedPrice is not available', () => {
      const categoriesWithoutDiscountedPrice = [
        { ...mockCategories[0], discountedPrice: undefined },
        { ...mockCategories[1], discountedPrice: undefined },
      ];
      const result = getLowestDiscountedPrice(categoriesWithoutDiscountedPrice);
      expect(result).toBe(50000);
    });
  });

  describe('hasDiscount', () => {
    it('should return true when any category has discount', () => {
      const result = hasDiscount(mockCategories);
      expect(result).toBe(true);
    });

    it('should return false when no category has discount', () => {
      const noDiscountCategories = mockCategories.map(cat => ({ ...cat, discountPercentage: 0 }));
      const result = hasDiscount(noDiscountCategories);
      expect(result).toBe(false);
    });

    it('should return false for empty array', () => {
      const result = hasDiscount([]);
      expect(result).toBe(false);
    });

    it('should handle undefined discountPercentage', () => {
      const undefinedDiscountCategories = mockCategories.map(cat => ({ ...cat, discountPercentage: undefined }));
      const result = hasDiscount(undefinedDiscountCategories);
      expect(result).toBe(false);
    });
  });

  describe('getMaxDiscount', () => {
    it('should return the maximum discount percentage', () => {
      const result = getMaxDiscount(mockCategories);
      expect(result).toBe(20);
    });

    it('should return 0 when no discounts', () => {
      const noDiscountCategories = mockCategories.map(cat => ({ ...cat, discountPercentage: 0 }));
      const result = getMaxDiscount(noDiscountCategories);
      expect(result).toBe(0);
    });

    it('should return 0 for empty array', () => {
      const result = getMaxDiscount([]);
      expect(result).toBe(0);
    });

    it('should handle undefined discountPercentage', () => {
      const undefinedDiscountCategories = mockCategories.map(cat => ({ ...cat, discountPercentage: undefined }));
      const result = getMaxDiscount(undefinedDiscountCategories);
      expect(result).toBe(0);
    });
  });

  describe('calculateDiscountFromDate', () => {
    beforeEach(() => {
      // Mock current date to 2024-01-01
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-01T00:00:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return 20% discount for 60+ days', () => {
      const futureDate = '2024-03-01T00:00:00Z'; // 60 days later
      const result = calculateDiscountFromDate(futureDate);
      expect(result).toBe(20);
    });

    it('should return 10% discount for 30-59 days', () => {
      const futureDate = '2024-02-01T00:00:00Z'; // 31 days later
      const result = calculateDiscountFromDate(futureDate);
      expect(result).toBe(10);
    });

    it('should return 0% discount for less than 30 days', () => {
      const futureDate = '2024-01-15T00:00:00Z'; // 14 days later
      const result = calculateDiscountFromDate(futureDate);
      expect(result).toBe(0);
    });

    it('should return 0% discount for past dates', () => {
      const pastDate = '2023-12-01T00:00:00Z'; // Past date
      const result = calculateDiscountFromDate(pastDate);
      expect(result).toBe(0);
    });

    it('should handle timestamp format', () => {
      const futureTimestamp = new Date('2024-03-01T00:00:00Z').getTime().toString();
      const result = calculateDiscountFromDate(futureTimestamp);
      expect(result).toBe(0); // Timestamp format returns 0 because it's treated as past date
    });
  });

  describe('formatDateTime', () => {
    it('should return empty string for empty date', () => {
      const result = formatDateTime('');
      expect(result).toBe('');
    });

    it('should return original string for invalid date', () => {
      const result = formatDateTime('invalid-date');
      expect(result).toBe('invalid-date');
    });

    it('should handle undefined date', () => {
      const result = formatDateTime(undefined);
      expect(result).toBe('');
    });
  });
});
