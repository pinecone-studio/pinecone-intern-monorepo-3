import { Resolvers } from '../generated/resolvers-types';

// Хөнгөлөлтийн хувийг тооцоолох helper функц
const calculateDiscountPercentage = (concertDate: string): number => {
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

export const TicketCategory: Resolvers['TicketCategory'] = {
  // Хөнгөлөлттэй үнийг тооцоолох resolver
  discountedPrice: (parent, args, context) => {
    // Concert мэдээлэл context-ээс авах
    const concert = context.concert;
    if (!concert || !concert.date) {
      return parent.unitPrice;
    }
    
    const discountPercentage = calculateDiscountPercentage(concert.date);
    if (discountPercentage > 0) {
      return Math.round(parent.unitPrice * (1 - discountPercentage / 100));
    }
    return parent.unitPrice;
  },
  
  // Хөнгөлөлтийн хувийг буцаах resolver
  discountPercentage: (parent, args, context) => {
    const concert = context.concert;
    if (!concert || !concert.date) {
      return 0;
    }
    return calculateDiscountPercentage(concert.date);
  },
};
