import { Resolvers } from '../generated/resolvers-types';
import { TicketCategoryController } from '../controllers/ticket-category.controller';

export const Concert: Resolvers['Concert'] = {
  // Concert-ийн ticketCategories field-г resolve хийх
  ticketCategories: async (parent) => {
    try {
      // MongoDB-с ирсэн parent нь _id field-тэй байдаг
      const concertId = parent._id?.toString() || parent.id;
      const categories = await TicketCategoryController.getConcertTicketCategories(concertId);
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
