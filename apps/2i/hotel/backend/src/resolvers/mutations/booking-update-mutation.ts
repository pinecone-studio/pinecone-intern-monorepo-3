import { BookingModel } from '../../models/room-booking-model';

export const bookingUpdate = async (
  _: unknown,
  args: {
    userId: string;
    hotelName: string;
    roomNumber: string;
    checkIn: Date;
    checkOut: Date;
  }
) => {
  const existingBooking = await BookingModel.findOne({
    roomNumber: args.roomNumber,
    userId: args.userId,
  });

  if (existingBooking) {
    existingBooking.checkIn = args.checkIn;
    existingBooking.checkOut = args.checkOut;
    existingBooking.hotelName = args.hotelName;

    await existingBooking.save();

    return existingBooking;
  } else {
    const newBooking = await BookingModel.create({
      userId: args.userId,
      hotelName: args.hotelName,
      roomNumber: args.roomNumber,
      checkIn: args.checkIn,
      checkOut: args.checkOut,
    });

    await newBooking.save();

    return newBooking;
  }
};
