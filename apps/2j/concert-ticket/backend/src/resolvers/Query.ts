import { Resolvers } from '../generated/resolvers-types';
import { ConcertController } from '../controllers/concert.controller';
import { UserController } from '../controllers/user.controller';
import { ArtistController } from '../controllers/artist.controller';
import { BookingController } from '../controllers/booking.controller';
import { TicketCategoryController } from '../controllers/ticket-category.controller';

export const Query: Resolvers['Query'] = {
  // Концертуудыг хайх
  concerts: async (_parent, args) => {
    return await ConcertController.getConcerts(args.filter, args.pagination);
  },

  // Нэг концертыг ID-аар олох
  concert: async (_parent, args) => {
    return await ConcertController.getConcertById(args.id);
  },
  myBookings: async (_parent, _args, ctx) => {
    if (!ctx.user) {
      throw new Error('UNAUTHENTICATED');
    }
    return await BookingController.getUserBookings(ctx.user.id);
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
    return await TicketCategoryController.checkTicketAvailability(args.concertId, args.ticketCategoryId);
  },
  searchSuggestions: async (_parent, args) => {
    return await ConcertController.getSearchSuggestions(args.query);
  },

  // Хэрэглэгчийн профайл авах
  myProfile: async (_parent, _args, ctx) => {
    if (!ctx.user) {
      throw new Error('UNAUTHENTICATED');
    }
    return await UserController.getUserProfile(ctx.user.id);
  },
};
