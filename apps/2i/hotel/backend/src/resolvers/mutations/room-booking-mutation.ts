// import { BookingModel } from '../../models/room-booking-model';
// import { RoomModel } from '../../models/room-model';
// import { HotelModel } from '../../models/hotel-model';
// import { UserModel } from '../../models/user-model';

// export const roomBooking = async (
//   _: unknown,
//   args: {
//     userId: string;
//     hotelName: string;
//     roomNumber: string;
//     checkIn: string;
//     checkOut: string;
//   }
// ) => {
//   const existingUser = await UserModel.findById(args.userId);
//   if (!existingUser) throw new Error('User not found');

//   const existingHotel = await HotelModel.findOne({ hotelName: args.hotelName });
//   if (!existingHotel) throw new Error('Hotel not found');

//   const existingRoom = await RoomModel.findOne({ roomNumber: args.roomNumber });
//   if (!existingRoom) throw new Error('Room not found');

//   const checkIn = new Date(args.checkIn);
//   const checkOut = new Date(args.checkOut);

//   const overlappingBooking = await BookingModel.findOne({
//     roomNumber: existingRoom._id,
//     checkIn: { $lt: checkOut },
//     checkOut: { $gt: checkIn },
//   });

//   if (overlappingBooking) {
//     throw new Error('This room is already booked for the selected dates.');
//   }

//   const nights = Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
//   const pricePerNight = existingRoom.pricePerNight;
//   const taxes = pricePerNight * nights * 0.1;
//   const totalPrice = pricePerNight * nights + taxes;

//   const newBooking = new BookingModel({
//     userId: existingUser._id,
//     hotelName: existingHotel._id,
//     roomNumber: existingRoom._id,
//     checkIn,
//     checkOut,
//     nights,
//     pricePerNight,
//     taxes,
//     totalPrice,
//   });

//   await newBooking.save();

//   const populatedBooking = await BookingModel.findById(newBooking._id).populate('userId').populate('hotelName').populate('roomNumber');

//   return populatedBooking;
// };

import { BookingModel } from '../../models/room-booking-model';
import { RoomModel } from '../../models/room-model';
import { HotelModel } from '../../models/hotel-model';
import { UserModel } from '../../models/user-model';

async function getUser(userId: string) {
  const user = await UserModel.findById(userId);
  if (!user) throw new Error('User not found');
  return user;
}

async function getHotel(hotelName: string) {
  const hotel = await HotelModel.findOne({ hotelName });
  if (!hotel) throw new Error('Hotel not found');
  return hotel;
}

async function getRoom(roomNumber: string) {
  const room = await RoomModel.findOne({ roomNumber });
  if (!room) throw new Error('Room not found');
  return room;
}

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
  const existingUser = await getUser(args.userId);
  const existingHotel = await getHotel(args.hotelName);
  const existingRoom = await getRoom(args.roomNumber);

  const checkIn = new Date(args.checkIn);
  const checkOut = new Date(args.checkOut);

  const overlappingBooking = await BookingModel.findOne({
    roomNumber: existingRoom._id,
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
  });

  if (overlappingBooking) {
    throw new Error('This room is already booked for the selected dates.');
  }

  const nights = Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  const pricePerNight = existingRoom.pricePerNight;
  const taxes = pricePerNight * nights * 0.1;
  const totalPrice = pricePerNight * nights + taxes;

  const newBooking = new BookingModel({
    userId: existingUser._id,
    hotelName: existingHotel._id,
    roomNumber: existingRoom._id,
    checkIn,
    checkOut,
    nights,
    pricePerNight,
    taxes,
    totalPrice,
  });

  await newBooking.save();

  const populatedBooking = await BookingModel.findById(newBooking._id).populate('userId').populate('hotelName').populate('roomNumber');

  return populatedBooking;
};
