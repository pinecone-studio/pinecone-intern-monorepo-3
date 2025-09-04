import { HotelModel } from '../../models/hotel-model';

export const getFiltered = async (_: unknown, args: { roomType: string; locations: string; starRating: string }) => {
  const query: Record<string, unknown> = {};
  if (args.locations) {
    query.locations = args.locations;
  }

  if (args.starRating) {
    query.starRating = args.starRating;
  }

  const filteredHotels = await HotelModel.find(query).populate('rooms');

  return filteredHotels.map((hotel) => ({
    id: hotel._id,
    hotelName: hotel.hotelName,
    locations: hotel.locations,
    starRating: hotel.starRating,
    roomType: hotel.roomType,
  }));
};

// ...(locations && { location: locations }),
// ...(starRating && { starRating }),
