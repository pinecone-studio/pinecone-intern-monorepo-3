import { BookingModel } from '../../models/room-booking-model';
import mongoose from 'mongoose';

export const getBooking = async (
  _: unknown,
  args: {
    userId: string;
    hotelName: string;
    roomNumber: string;
    checkIn: string;
    checkOut: string;
  }
) => {
  const userId = new mongoose.Types.ObjectId(args.userId);
  const hotelName = new mongoose.Types.ObjectId(args.hotelName);
  const roomNumber = new mongoose.Types.ObjectId(args.roomNumber);

  const checkInStart = new Date(new Date(args.checkIn).setHours(0, 0, 0, 0));
  const checkInEnd = new Date(new Date(args.checkIn).setHours(23, 59, 59, 999));
  const checkOutStart = new Date(new Date(args.checkOut).setHours(0, 0, 0, 0));
  const checkOutEnd = new Date(new Date(args.checkOut).setHours(23, 59, 59, 999));

  const existingBooking = await BookingModel.findOne({
    userId,
    hotelName,
    roomNumber,
    checkIn: { $gte: checkInStart, $lte: checkInEnd },
    checkOut: { $gte: checkOutStart, $lte: checkOutEnd },
  })
    .populate('hotelName')
    .populate('roomNumber');

  if (!existingBooking) {
    throw new Error('No booking found');
  }

  return existingBooking;
};
