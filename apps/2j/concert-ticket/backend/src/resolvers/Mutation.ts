import { Resolvers } from '../generated/resolvers-types';
import { ConcertController } from '../controllers/concert.controller';
import { UserController } from '../controllers/user.controller';
import { ArtistController } from '../controllers/artist.controller';
import { BookingController } from '../controllers/booking.controller';
import { TicketCategoryController } from '../controllers/ticket-category.controller';
import { register, login } from '../services/auth.service';
import { PasswordResetService } from '../services/password-reset.service';

export const Mutation: Resolvers['Mutation'] = {
  // ----------------------
  // 🔐 AUTHENTICATION
  // ----------------------
  register: async (_parent, args) => {
    return await register(args.input);
  },
  login: async (_parent, args) => {
    return await login(args.input);
  },
  logout: async () => true,

  forgotPassword: async (_parent, args) => {
    try {
      return await PasswordResetService.requestPasswordReset(args.email);
    } catch (error) {
      console.error('Error in forgotPassword:', error);
      return false;
    }
  },
  verifyResetCode: async (_parent, args) => {
    try {
      return await PasswordResetService.verifyResetCode(args.email, args.code);
    } catch {
      throw new Error('Буруу код байна');
    }
  },
  resetPassword: async (_parent, args) => {
    try {
      const success = await PasswordResetService.setNewPassword(
        args.email,
        args.code,
        args.newPassword
      );
      if (!success) throw new Error('Буруу код байна');
      return true;
    } catch {
      throw new Error('Буруу код байна');
    }
  },

  // ----------------------
  // 👤 USER
  // ----------------------
  updateUserProfile: async (_parent, args, ctx) => {
    const userId = ctx.user?.id || '68e75deab6cd9759bc4033d7';
    if (!userId) throw new Error('Нэвтрэх шаардлагатай эсвэл хэрэглэгчийн ID байхгүй.');
    return await UserController.updateUserProfile(userId, args.input);
  },

  // ----------------------
  // 🎤 ARTIST (ADMIN)
  // ----------------------
  createArtist: async (_parent, args, ctx) => {
    if (ctx.user?.role !== 'ADMIN') throw new Error('Админ эрх шаардлагатай');
    return await ArtistController.createArtist(args.input);
  },
  updateArtist: async (_parent, args, ctx) => {
    if (ctx.user?.role !== 'ADMIN') throw new Error('Админ эрх шаардлагатай');
    return await ArtistController.updateArtist(args.id, args.input);
  },
  deleteArtist: async (_parent, args, ctx) => {
    if (ctx.user?.role !== 'ADMIN') throw new Error('Админ эрх шаардлагатай');
    return await ArtistController.deleteArtist(args.id);
  },

  // ----------------------
  // 🎫 CONCERT (ADMIN)
  // ----------------------
  createConcert: async (_parent, args, ctx) => {
    if (ctx.user?.role !== 'ADMIN') throw new Error('Админ эрх шаардлагатай');
    return await ConcertController.createConcert(args.input);
  },
  updateConcert: async (_parent, args, ctx) => {
    if (ctx.user?.role !== 'ADMIN') throw new Error('Админ эрх шаардлагатай');
    return await ConcertController.updateConcert(args.id, args.input);
  },
  deleteConcert: async (_parent, args, ctx) => {
    if (ctx.user?.role !== 'ADMIN') throw new Error('Админ эрх шаардлагатай');
    return await ConcertController.deleteConcert(args.id);
  },

  // ----------------------
  // 📦 BOOKINGS
  // ----------------------
  createBooking: async (_parent, args, ctx) => {
    const userId = ctx.user?.id || '68e75deab6cd9759bc4033d7';
    if (!userId) throw new Error('Нэвтрэх шаардлагатай эсвэл хэрэглэгчийн ID байхгүй.');
    return await BookingController.createBooking(userId, args.input);
  },
  updateBookingPaymentStatus: async (_parent, args, ctx) => {
    const userId = ctx.user?.id || '68e75deab6cd9759bc4033d7';
    if (!userId) throw new Error('Нэвтрэх шаардлагатай эсвэл хэрэглэгчийн ID байхгүй.');
    return await BookingController.updateBookingPaymentStatus(args.id, args.paymentStatus);
  },
  cancelBooking: async (_parent, args, ctx) => {
    const userId = ctx.user?.id || '68e75deab6cd9759bc4033d7';
    return await BookingController.cancelBooking(args.id, userId);
  },
  requestCancellation: async (_parent, args, ctx) => {
    const userId = ctx.user?.id || '68e75deab6cd9759bc4033d7';
    return await BookingController.requestCancellation(args.id, userId);
  },

  // ----------------------
  // 🎟️ TICKET MANAGEMENT (ADMIN)
  // ----------------------
  updateTicketQuantity: async (_parent, args, ctx) => {
    if (ctx.user?.role !== 'ADMIN') throw new Error('Админ эрх шаардлагатай');
    return await TicketCategoryController.updateTicketQuantity(args.ticketCategoryId, args.newQuantity);
  },
  updateTicketPrice: async (_parent, args, ctx) => {
    if (ctx.user?.role !== 'ADMIN') throw new Error('Админ эрх шаардлагатай');
    return await TicketCategoryController.updateTicketPrice(args.ticketCategoryId, args.newPrice);
  },
};
