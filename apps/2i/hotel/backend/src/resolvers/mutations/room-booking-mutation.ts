import { BookingModel } from '../../models/room-booking-model';
import { RoomModel } from '../../models/room-model';
import { HotelModel } from '../../models/hotel-model';

export const roomBooking = async (
  _: unknown,
  args: {
    userId: string;
    hotelName: string;
    roomNumber: string;
    checkIn: string;
    checkOut: string;
  }
) => {
  const existingHotel = await HotelModel.findById(args.hotelName);
  if (!existingHotel) {
    throw new Error('Hotel not found');
  }

  const existingRoom = await RoomModel.findById(args.roomNumber);
  if (!existingRoom) {
    throw new Error('Room not found');
  }

  const newBooking = new BookingModel({
    userId: args.userId,
    hotelName: args.hotelName,
    roomNumber: args.roomNumber,
    checkIn: args.checkIn,
    checkOut: args.checkOut,
  });

  await newBooking.save();

  return newBooking;
};
