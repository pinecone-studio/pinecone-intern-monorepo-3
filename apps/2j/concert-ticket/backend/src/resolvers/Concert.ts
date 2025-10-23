import { Resolvers } from '../generated/resolvers-types';
import { TicketCategoryController } from '../controllers/ticket-category.controller';

export const Concert: Resolvers['Concert'] = {
  // Concert-ийн date field-г resolve хийх
  date: (parent) => {
    return parent.date?.toISOString() || new Date().toISOString();
  },

  // Concert-ийн ticketCategories field-г resolve хийх
  ticketCategories: async (parent, args, context) => {
    try {
      // MongoDB-с ирсэн parent нь _id field-тэй байдаг
      const concertId = parent._id?.toString() || parent.id;
      const categories = await TicketCategoryController.getConcertTicketCategories(concertId);
      
      // Concert мэдээлэлийг context-д дамжуулах (хөнгөлөлтийн тооцоололд ашиглах)
      if (categories && categories.length > 0) {
        context.concert = {
          id: concertId,
          date: parent.date?.toISOString() || new Date().toISOString()
        };
      }
      
      // Хэрэв categories байхгүй бол хоосон array буцаах
      return categories || [];
    } catch (error) {
      console.error('TicketCategories resolve error:', error);
      // Асуудал гарвал хоосон array буцаах
      return [];
    }
  },

  // Concert-ийн totalAvailableTickets field-г resolve хийх
  totalAvailableTickets: async (parent) => {
    try {
      // MongoDB-с ирсэн parent нь _id field-тэй байдаг
      const concertId = parent._id?.toString() || parent.id;
      const ticketCategories = await TicketCategoryController.getConcertTicketCategories(concertId);
      return ticketCategories.reduce((total, category) => total + category.availableQuantity, 0);
    } catch (error) {
      console.error('TotalAvailableTickets resolve error:', error);
      return 0;
    }
  },
};
