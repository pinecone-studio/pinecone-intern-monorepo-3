import { Resolvers } from '../generated/resolvers-types';

export const Mutation: Resolvers['Mutation'] = {
  register: async (_p, _a, _c) => {
    return { token: 'TODO', user: { id: '0', email: '', role: 'USER', createdAt: '', updatedAt: '' } } as any;
  },
  login: async (_p, _a, _c) => {
    return { token: 'TODO', user: { id: '0', email: '', role: 'USER', createdAt: '', updatedAt: '' } } as any;
  },
  forgotPassword: async () => {
    return 'SENT';
  },
  resetPassword: async () => {
    return { token: 'TODO', user: { id: '0', email: '', role: 'USER', createdAt: '', updatedAt: '' } } as any;
  },
  logout: async () => true,

  createConcert: async () => {
    return {
      id: '0',
      name: '',
      venue: '',
      date: '',
      time: '',
      mainArtist: { id: '0', name: '' },
      otherArtists: [],
      isActive: true,
      ticketCategories: [],
      totalAvailableTickets: 0,
    } as any;
  },
  updateConcert: async () => {
    return {
      id: '0',
      name: '',
      venue: '',
      date: '',
      time: '',
      mainArtist: { id: '0', name: '' },
      otherArtists: [],
      isActive: true,
      ticketCategories: [],
      totalAvailableTickets: 0,
    } as any;
  },
  deleteConcert: async () => true,

  createArtist: async () => ({ id: '0', name: '' } as any),
  updateArtist: async () => ({ id: '0', name: '' } as any),
  deleteArtist: async () => true,

  createBooking: async () => {
    return {
      id: '0',
      user: { id: '0', email: '', role: 'USER', createdAt: '', updatedAt: '' },
      concert: { id: '0', name: '', venue: '', date: '', time: '', mainArtist: { id: '0', name: '' }, otherArtists: [], isActive: true, ticketCategories: [], totalAvailableTickets: 0 },
      ticketCategory: { id: '0', type: 'REGULAR', totalQuantity: 0, availableQuantity: 0, unitPrice: 0 },
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      bookingDate: '',
      status: 'PENDING',
      paymentStatus: 'PENDING',
      canCancel: true,
      cancellationDeadline: '',
    } as any;
  },
  cancelBooking: async () => ({ id: '0' } as any),
  requestCancellation: async () => ({ id: '0' } as any),

  updateUserProfile: async () => ({ id: '0', email: '', role: 'USER', createdAt: '', updatedAt: '' } as any),
  updateTicketQuantity: async () => ({ id: '0', type: 'REGULAR', totalQuantity: 0, availableQuantity: 0, unitPrice: 0 } as any),
  updateTicketPrice: async () => ({ id: '0', type: 'REGULAR', totalQuantity: 0, availableQuantity: 0, unitPrice: 0 } as any),
};
