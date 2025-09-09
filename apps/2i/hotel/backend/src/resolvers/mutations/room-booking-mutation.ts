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
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    cardNumber: string;
  }
) => {
  const existingHotel = await HotelModel.findById(args.hotelName);
  if (!existingHotel) throw new Error('Hotel not found');

  const existingRoom = await RoomModel.findById(args.roomNumber);
  if (!existingRoom) throw new Error('Room not found');

  const overlappingBooking = await BookingModel.findOne({
    roomNumber: args.roomNumber,
    $or: [
      {
        checkIn: { $lt: new Date(args.checkOut) },
        checkOut: { $gt: new Date(args.checkIn) },
      },
    ],
  });

  if (overlappingBooking) {
    throw new Error('This room is already booked for the selected dates.');
  }

  const checkInDate = new Date(args.checkIn);
  const checkOutDate = new Date(args.checkOut);
  const nights = Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

  const pricePerNight = existingRoom.pricePerNight;
  const taxes = pricePerNight * nights * 0.1;
  const totalPrice = pricePerNight * nights + taxes;

  const newBooking = new BookingModel({
    userId: args.userId,
    hotelName: args.hotelName,
    roomNumber: args.roomNumber,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    nights,
    pricePerNight,
    taxes,
    totalPrice,
    email: args.email,
    firstName: args.firstName,
    lastName: args.lastName,
    phoneNumber: args.phoneNumber,
    cardNumber: args.cardNumber,
  });

  await newBooking.save();

  const populatedBooking = await BookingModel.findById(newBooking._id).populate('userId').populate('hotelName').populate('roomNumber').exec();

  return {
    ...populatedBooking.toObject(),
    user: populatedBooking.userId,
    hotel: populatedBooking.hotelName,
    room: populatedBooking.roomNumber,
  };
};

//
