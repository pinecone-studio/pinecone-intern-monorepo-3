import { HotelModel } from '../../models/hotel-model';

export const addHotel = async (_: unknown, args: { id: string; hotelName: string; description: string; location: string; starRating: string }) => {
  const existingHotel = await HotelModel.findOne({ _id: args.id, hotelName: args.hotelName });

  if (!existingHotel) {
    const newHotel = await HotelModel.create({
      _id: args.id,
      hotelName: args.hotelName,
      description: args.description,
      location: args.location,
      starRating: args.starRating,
    });

    return newHotel;
  }
  throw new Error('Hotel with this name already exists.');
};
