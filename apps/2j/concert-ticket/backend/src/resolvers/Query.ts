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

  // Хэрэглэгчийн захиалгуудыг авах
  myBookings: async (_parent, _args, ctx) => {
    if (!ctx.user) {
      throw new Error('Нэвтрэх шаардлагатай');
    }
    return await BookingController.getUserBookings(ctx.user.id);
  },

  // Нэг хэрэглэгчийг ID-аар олох (админ хэрэглэгчдэд зориулсан)
  user: async (_parent, args, ctx) => {
    if (!ctx.user || ctx.user.role !== 'ADMIN') {
      throw new Error('Админ эрх шаардлагатай');
    }
    return await UserController.getUserById(args.id);
  },

  // Бүх хэрэглэгчдийг авах (админ хэрэглэгчдэд зориулсан)
  users: async (_parent, args, ctx) => {
    if (!ctx.user || ctx.user.role !== 'ADMIN') {
      throw new Error('Админ эрх шаардлагатай');
    }
    return await UserController.getUsers(args.pagination);
  },

  // Бүх дуучнуудыг авах
  artists: async () => {
    return await ArtistController.getArtists();
  },

  // Нэг дуучныг ID-аар олох
  artist: async (_parent, args) => {
    return await ArtistController.getArtistById(args.id);
  },

  // Тасалбарын боломжийг шалгах
  checkTicketAvailability: async (_parent, args) => {
    return await TicketCategoryController.checkTicketAvailability(args.concertId, args.ticketCategoryId);
  },

  // Хайлтын санал олох
  searchSuggestions: async (_parent, args) => {
    return await ConcertController.getSearchSuggestions(args.query);
  },
};
