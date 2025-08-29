import { HotelModel } from '../../models/hotel-model';

export const addHotel = async (_: unknown, args: { hotelName: string; description: string; starRating: string; phoneNumber: string }) => {
  const existingHotel = await HotelModel.findOne({ hotelName: args.hotelName });

  if (!existingHotel) {
    const newHotel = await HotelModel.create({
      phoneNumber: args.phoneNumber,
      hotelName: args.hotelName,
      description: args.description,
      starRating: args.starRating,
    });

    return newHotel;
  }
  throw new Error('Hotel with this name already exists.');
};
