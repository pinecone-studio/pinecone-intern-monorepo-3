import { Resolvers } from '../generated/resolvers-types';
import { ConcertController } from '../controllers/concert.controller';
import { UserController } from '../controllers/user.controller';
import { ArtistController } from '../controllers/artist.controller';
import { BookingController } from '../controllers/booking.controller';
import { TicketCategoryController } from '../controllers/ticket-category.controller';
import { register, login } from '../services/auth.service';
import { PasswordResetService } from '../services/password-reset.service';

export const Mutation: Resolvers['Mutation'] = {
  register: async (_parent, args) => {
    return await register(args.input);
  },
  login: async (_parent, args) => {
    return await login(args.input);
  },
  logout: async () => true,
  forgotPassword: async (_parent, args) => {
    console.log('=== FORGOT PASSWORD CALLED ===');
    console.log('Email:', args.email);
    try {
      console.log('PasswordResetService:', typeof PasswordResetService);
      console.log('requestPasswordReset method:', typeof PasswordResetService.requestPasswordReset);
      const success = await PasswordResetService.requestPasswordReset(args.email);
      console.log('Success:', success);
      console.log('=== END FORGOT PASSWORD ===');
      return success;
    } catch (error) {
      console.error('Error in forgotPassword resolver:', error);
      console.error('Error stack:', error.stack);
      return false;
    }
  },
  verifyResetCode: async (_parent, args) => {
    try {
      const isValid = await PasswordResetService.verifyResetCode(args.email, args.code);
      return isValid;
    } catch (error) {
      throw new Error('Буруу код байна');
    }
  },
  resetPassword: async (_parent, args) => {
    try {
      const success = await PasswordResetService.setNewPassword(args.email, args.code, args.newPassword);
      if (success) {
        return true;
      } else {
        throw new Error('Буруу код байна');
      }
    } catch (error) {
      throw new Error('Буруу код байна');
    }
  },

  createConcert: async (_parent, args, ctx) => {
    if (!ctx.user || ctx.user.role !== 'ADMIN') {
      throw new Error('Админ эрх шаардлагатай');
    }
    return await ConcertController.createConcert(args.input);
  },
  updateConcert: async (_parent, args, ctx) => {
    if (!ctx.user || ctx.user.role !== 'ADMIN') {
      throw new Error('Админ эрх шаардлагатай');
    }
    return await ConcertController.updateConcert(args.id, args.input);
  },
  deleteConcert: async (_parent, args, ctx) => {
    if (!ctx.user || ctx.user.role !== 'ADMIN') {
      throw new Error('Админ эрх шаардлагатай');
    }
    return await ConcertController.deleteConcert(args.id);
  },
  createArtist: async (_parent, args, ctx) => {
    if (!ctx.user || ctx.user.role !== 'ADMIN') {
      throw new Error('Админ эрх шаардлагатай');
    }
    return await ArtistController.createArtist(args.input);
  },
  updateArtist: async (_parent, args, ctx) => {
    if (!ctx.user || ctx.user.role !== 'ADMIN') {
      throw new Error('Админ эрх шаардлагатай');
    }
    return await ArtistController.updateArtist(args.id, args.input);
  },
  deleteArtist: async (_parent, args, ctx) => {
    if (!ctx.user || ctx.user.role !== 'ADMIN') {
      throw new Error('Админ эрх шаардлагатай');
    }
    return await ArtistController.deleteArtist(args.id);
  },
  createBooking: async (_parent, args, ctx) => {
    if (!ctx.user) {
      throw new Error('Нэвтрэх шаардлагатай');
    }
    return await BookingController.createBooking(ctx.user.id, args.input);
  },
  cancelBooking: async (_parent, args, ctx) => {
    if (!ctx.user) {
      throw new Error('Нэвтрэх шаардлагатай');
    }
    return await BookingController.cancelBooking(args.id, ctx.user.id);
  },
  requestCancellation: async (_parent, args, ctx) => {
    if (!ctx.user) {
      throw new Error('Нэвтрэх шаардлагатай');
    }
    return await BookingController.requestCancellation(args.id, ctx.user.id);
  },
  updateUserProfile: async (_parent, args, ctx) => {
    if (!ctx.user) {
      throw new Error('Нэвтрэх шаардлагатай');
    }
    return await UserController.updateUserProfile(ctx.user.id, args.input);
  },
  updateTicketQuantity: async (_parent, args, ctx) => {
    if (!ctx.user || ctx.user.role !== 'ADMIN') {
      throw new Error('Админ эрх шаардлагатай');
    }
    return await TicketCategoryController.updateTicketQuantity(args.ticketCategoryId, args.newQuantity);
  },
  updateTicketPrice: async (_parent, args, ctx) => {
    if (!ctx.user || ctx.user.role !== 'ADMIN') {
      throw new Error('Админ эрх шаардлагатай');
    }
    return await TicketCategoryController.updateTicketPrice(args.ticketCategoryId, args.newPrice);
  },
};
