import {
  getLowestPrice,
  getLowestDiscountedPrice,
  hasDiscount,
  getMaxDiscount,
  calculateDiscountFromDate,
  formatDateTime,
} from '../../../src/components/home/EventCard.utils';
import type { TicketCategory } from '../../../src/types/Event.type';

describe('EventCard.utils', () => {
  const mockCategories: TicketCategory[] = [
    { type: 'VIP', totalQuantity: 100, unitPrice: 50000, discountPercentage: 10 },
    { type: 'Regular', totalQuantity: 200, unitPrice: 30000, discountPercentage: 5 },
    { type: 'General', totalQuantity: 300, unitPrice: 20000 },
  ];

  describe('getLowestPrice', () => {
    it('хамгийн бага үнийг буцаана', () => {
      const result = getLowestPrice(mockCategories);
      expect(result).toBe(20000);
    });

    it('хоосон массив үед undefined буцаана', () => {
      const result = getLowestPrice([]);
      expect(result).toBeUndefined();
    });

    it('хүчинтэй бус үнэтэй категориуд үед undefined буцаана', () => {
      const invalidCategories = [
        { type: 'VIP', totalQuantity: 100, unitPrice: NaN },
        { type: 'Regular', totalQuantity: 200, unitPrice: Infinity },
      ];
      const result = getLowestPrice(invalidCategories);
      expect(result).toBeUndefined();
    });
  });

  describe('getLowestDiscountedPrice', () => {
    it('хөнгөлөлттэй хамгийн бага үнийг буцаана', () => {
      const result = getLowestDiscountedPrice(mockCategories);
      expect(result).toBe(20000); // General category has no discount
    });

    it('хоосон массив үед undefined буцаана', () => {
      const result = getLowestDiscountedPrice([]);
      expect(result).toBeUndefined();
    });
  });

  describe('hasDiscount', () => {
    it('хөнгөлөлт байгаа үед true буцаана', () => {
      const result = hasDiscount(mockCategories);
      expect(result).toBe(true);
    });

    it('хөнгөлөлт байхгүй үед false буцаана', () => {
      const noDiscountCategories = [
        { type: 'VIP', totalQuantity: 100, unitPrice: 50000 },
        { type: 'Regular', totalQuantity: 200, unitPrice: 30000 },
      ];
      const result = hasDiscount(noDiscountCategories);
      expect(result).toBe(false);
    });
  });

  describe('getMaxDiscount', () => {
    it('хамгийн их хөнгөлөлтийн хувийг буцаана', () => {
      const result = getMaxDiscount(mockCategories);
      expect(result).toBe(10);
    });

    it('хөнгөлөлт байхгүй үед 0 буцаана', () => {
      const noDiscountCategories = [
        { type: 'VIP', totalQuantity: 100, unitPrice: 50000 },
        { type: 'Regular', totalQuantity: 200, unitPrice: 30000 },
      ];
      const result = getMaxDiscount(noDiscountCategories);
      expect(result).toBe(0);
    });
  });

  describe('calculateDiscountFromDate', () => {
    it('60+ хоног үлдсэн үед 20% хөнгөлөлт буцаана', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 70);
      const result = calculateDiscountFromDate(futureDate.toISOString().split('T')[0]);
      expect(result).toBe(20);
    });

    it('30-59 хоног үлдсэн үед 10% хөнгөлөлт буцаана', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 45);
      const result = calculateDiscountFromDate(futureDate.toISOString().split('T')[0]);
      expect(result).toBe(10);
    });

    it('30 хоногоос бага үлдсэн үед 0% хөнгөлөлт буцаана', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 15);
      const result = calculateDiscountFromDate(futureDate.toISOString().split('T')[0]);
      expect(result).toBe(0);
    });
  });

  describe('formatDateTime', () => {
    it('зөв огноо форматлана', () => {
      const result = formatDateTime('2024-01-15', '19:00');
      expect(result).toMatch(/^\d{2}\.\d{2}$/);
    });

    it('хоосон огноо үед хоосон string буцаана', () => {
      const result = formatDateTime('', '19:00');
      expect(result).toBe('');
    });

    it('хүчинтэй бус огноо үед алдааны мессеж буцаана', () => {
      const result = formatDateTime('invalid-date');
      expect(result).toBe('Invalid date');
    });
  });
});
