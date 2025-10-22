import { Resolvers } from '../generated/resolvers-types';

export const Booking: Resolvers['Booking'] = {
  // Booking type-ийн field-уудыг resolve хийх
  id: (parent) => {
    if (parent._id) {
      return parent._id.toString();
    }
    if (parent.id) {
      return parent.id.toString();
    }
    return '';
  },
  user: (parent) => parent.user,
  concert: (parent) => parent.concert,
  ticketCategory: (parent) => parent.ticketCategory,
  quantity: (parent) => parent.quantity,
  unitPrice: (parent) => parent.unitPrice,
  totalPrice: (parent) => parent.totalPrice,
  bookingDate: (parent) => parent.bookingDate?.toISOString() || new Date().toISOString(),
  status: (parent) => parent.status,
  paymentStatus: (parent) => parent.paymentStatus,
  canCancel: (parent) => parent.canCancel,
  cancellationDeadline: (parent) => parent.cancellationDeadline?.toISOString() || new Date().toISOString(),
};
