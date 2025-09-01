import { BookingModel } from '../../models/room-booking-model';

export const getBooking = async (
  _: unknown,
  args: { userId: string; hotelName: string; roomNumber: string; checkIn: Date; checkOut: Date; nights: Number; pricePerNight: Number; taxes: Number; totalPrice: Number }
) => {
  const existingBooking = await BookingModel.findOne({ userId: args.userId, hotelName: args.hotelName, roomNumber: args.roomNumber, checkIn: args.checkIn, checkOut: args.checkOut })
    .populate('hotel')
    .populate('room');

  if (!existingBooking) {
    throw new Error('No booking found');
  }

  return existingBooking;
};
