import { Resolvers } from '../generated/resolvers-types';
import { ConcertController } from '../controllers/concert.controller';
import { UserController } from '../controllers/user.controller';
import { ArtistController } from '../controllers/artist.controller';
import { BookingController } from '../controllers/booking.controller';
import { TicketCategoryController } from '../controllers/ticket-category.controller';
import { AuthController } from '../controllers/auth.controller';

export const Mutation: Resolvers['Mutation'] = {
  // Хэрэглэгч бүртгэх
  register: async (_parent, args, _ctx) => {
    return await AuthController.register(args.input);
  },

  // Хэрэглэгч нэвтрэх
  login: async (_parent, args, _ctx) => {
    return await AuthController.login(args.input);
  },

  // Нууц үг мартсан тохиолдолд
  forgotPassword: async (_parent, args, _ctx) => {
    return await AuthController.forgotPassword(args.email);
  },

  // Нууц үг сэргээх
  resetPassword: async (_parent, args, _ctx) => {
    return await AuthController.resetPassword(args.input);
  },

  // Гарах
  logout: async () => true,

  // Концерт үүсгэх (админ хэрэглэгчдэд зориулсан)
  createConcert: async (_parent, args, ctx) => {
    if (!ctx.user || ctx.user.role !== 'ADMIN') {
      throw new Error('Админ эрх шаардлагатай');
    }
    return await ConcertController.createConcert(args.input);
  },

  // Концерт засах (админ хэрэглэгчдэд зориулсан)
  updateConcert: async (_parent, args, ctx) => {
    if (!ctx.user || ctx.user.role !== 'ADMIN') {
      throw new Error('Админ эрх шаардлагатай');
    }
    return await ConcertController.updateConcert(args.id, args.input);
  },

  // Концерт устгах (админ хэрэглэгчдэд зориулсан)
  deleteConcert: async (_parent, args, ctx) => {
    if (!ctx.user || ctx.user.role !== 'ADMIN') {
      throw new Error('Админ эрх шаардлагатай');
    }
    return await ConcertController.deleteConcert(args.id);
  },

  // Дуучин үүсгэх (админ хэрэглэгчдэд зориулсан)
  createArtist: async (_parent, args, ctx) => {
    if (!ctx.user || ctx.user.role !== 'ADMIN') {
      throw new Error('Админ эрх шаардлагатай');
    }
    return await ArtistController.createArtist(args.input);
  },

  // Дуучны мэдээлэл засах (админ хэрэглэгчдэд зориулсан)
  updateArtist: async (_parent, args, ctx) => {
    if (!ctx.user || ctx.user.role !== 'ADMIN') {
      throw new Error('Админ эрх шаардлагатай');
    }
    return await ArtistController.updateArtist(args.id, args.input);
  },

  // Дуучин устгах (админ хэрэглэгчдэд зориулсан)
  deleteArtist: async (_parent, args, ctx) => {
    if (!ctx.user || ctx.user.role !== 'ADMIN') {
      throw new Error('Админ эрх шаардлагатай');
    }
    return await ArtistController.deleteArtist(args.id);
  },

  // Захиалга үүсгэх
  createBooking: async (_parent, args, ctx) => {
    if (!ctx.user) {
      throw new Error('Нэвтрэх шаардлагатай');
    }
    return await BookingController.createBooking(ctx.user.id, args.input);
  },

  // Захиалга цуцлах
  cancelBooking: async (_parent, args, ctx) => {
    if (!ctx.user) {
      throw new Error('Нэвтрэх шаардлагатай');
    }
    return await BookingController.cancelBooking(args.id, ctx.user.id);
  },

  // Цуцлах хүсэлт илгээх
  requestCancellation: async (_parent, args, ctx) => {
    if (!ctx.user) {
      throw new Error('Нэвтрэх шаардлагатай');
    }
    return await BookingController.requestCancellation(args.id, ctx.user.id);
  },

  // Хэрэглэгчийн мэдээлэл засах
  updateUserProfile: async (_parent, args, ctx) => {
    if (!ctx.user) {
      throw new Error('Нэвтрэх шаардлагатай');
    }
    return await UserController.updateUserProfile(ctx.user.id, args.input);
  },

  // Тасалбарын тоо өөрчлөх (админ хэрэглэгчдэд зориулсан)
  updateTicketQuantity: async (_parent, args, ctx) => {
    if (!ctx.user || ctx.user.role !== 'ADMIN') {
      throw new Error('Админ эрх шаардлагатай');
    }
    return await TicketCategoryController.updateTicketQuantity(args.ticketCategoryId, args.newQuantity);
  },

  // Тасалбарын үнэ өөрчлөх (админ хэрэглэгчдэд зориулсан)
  updateTicketPrice: async (_parent, args, ctx) => {
    if (!ctx.user || ctx.user.role !== 'ADMIN') {
      throw new Error('Админ эрх шаардлагатай');
    }
    return await TicketCategoryController.updateTicketPrice(args.ticketCategoryId, args.newPrice);
  },
};
