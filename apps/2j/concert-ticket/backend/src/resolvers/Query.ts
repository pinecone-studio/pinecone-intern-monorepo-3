import { Resolvers } from '../generated/resolvers-types';
import { ConcertController } from '../controllers/concert.controller';
import { UserController } from '../controllers/user.controller';
import { ArtistController } from '../controllers/artist.controller';
import { BookingController } from '../controllers/booking.controller';
import { TicketCategoryController } from '../controllers/ticket-category.controller';

export const Query: Resolvers['Query'] = {
  concerts: async (_parent, args) => {
    return await ConcertController.getConcerts(args.filter, args.pagination);
  },

  concert: async (_parent, args) => {
    return await ConcertController.getConcertById(args.id);
  },

  myBookings: async (_parent, _args, ctx) => {
    const userId = ctx.user?.id || '68e75deab6cd9759bc4033d7';
    return await BookingController.getUserBookings(userId);
  },

  user: async (_parent, args, ctx) => {
    if (!ctx.user || ctx.user.role !== 'ADMIN') {
      throw new Error('Админ эрх шаардлагатай');
    }
    return await UserController.getUserById(args.id);
  },

  users: async (_parent, args, ctx) => {
    if (!ctx.user || ctx.user.role !== 'ADMIN') {
      throw new Error('Админ эрх шаардлагатай');
    }
    return await UserController.getUsers(args.pagination);
  },

  artists: async () => {
    return await ArtistController.getArtists();
  },

  artist: async (_parent, args) => {
    return await ArtistController.getArtistById(args.id);
  },

  checkTicketAvailability: async (_parent, args) => {
    return await TicketCategoryController.checkTicketAvailability(
      args.concertId,
      args.ticketCategoryId
    );
  },

  searchSuggestions: async (_parent, args) => {
    return await ConcertController.getSearchSuggestions(args.query);
  },

  myProfile: async (_parent, _args, ctx) => {
    const userId = ctx.user?.id || '68e75deab6cd9759bc4033d7';
    return await UserController.getUserProfile(userId);
  },
};

