import { HotelModel } from '../../models/hotel-model';

export const getFiltered = async (_: unknown, args: { roomType: string; locations: string; starRating: string }) => {
  const { roomType, locations, starRating } = args;

  const query = {
    ...(roomType && { roomType }),
    ...(locations && { location: locations }),
    ...(starRating && { starRating }),
  };

  const filteredHotels = await HotelModel.find(query).populate('rooms');

  return filteredHotels.map((hotel) => ({
    id: hotel._id,
    hotelName: hotel.hotelName,
    location: hotel.location,
    starRating: hotel.starRating,
    roomType: hotel.roomType,
  }));
};
