import { BookingModel } from '../../models/room-booking-model';

export const getBooking = async () => {
  const bookings = await BookingModel.find().populate('hotelName').populate('roomNumber');

  if (!bookings || bookings.length === 0) {
    throw new Error('No booking found');
  }

  return bookings.map((booking) => ({
    _id: booking._id,
    user: booking.userId,
    hotel: booking.hotelName,
    room: booking.roomNumber,
    checkIn: booking.checkIn?.toISOString(),
    checkOut: booking.checkOut?.toISOString(),
    nights: booking.nights,
    pricePerNight: booking.pricePerNight,
    taxes: booking.taxes,
    totalPrice: booking.totalPrice,
  }));
};
