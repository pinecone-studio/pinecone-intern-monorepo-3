import { Resolvers } from '../generated/resolvers-types';
// import { UserController } from '../controllers/user.controller';

export const User: Resolvers['User'] = {
  // User type-ийн field-уудыг resolve хийх
  id: (parent) => parent._id?.toString() || parent.id,
  email: (parent) => parent.email,
  username: (parent) => parent.username || parent.name || null,
  phoneNumber: (parent) => parent.phoneNumber || parent.phone || null,
  address: (parent) => parent.address || null,
  role: (parent) => parent.role || 'USER',
  createdAt: (parent) => parent.createdAt?.toISOString() || new Date().toISOString(),
  updatedAt: (parent) => parent.updatedAt?.toISOString() || new Date().toISOString(),
  bookings: () => [], // Bookings-ийг дараа нь implement хийх
};
