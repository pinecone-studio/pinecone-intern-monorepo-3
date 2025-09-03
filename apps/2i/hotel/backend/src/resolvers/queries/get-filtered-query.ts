// import { HotelModel } from '../../models/hotel-model';

// export const getFiltered = async (_: unknown, args: { rooms: string; roomType: string; locations: string; starRating: string }) => {
//   const { rooms, roomType, locations, starRating } = args;

//   const query = {
//     ...(rooms && { rooms: { $in: [rooms] } }),
//     ...(roomType && { roomType }),
//     ...(locations && { location: locations }),
//     ...(starRating && { starRating }),
//   };

//   const filteredHotels = await HotelModel.find(query).populate('rooms');

//   return filteredHotels.map((hotel) => ({
//     id: hotel._id,
//     hotelName: hotel.hotelName,
//     location: hotel.location,
//     starRating: hotel.starRating,
//     roomType: hotel.roomType,
//     rooms: hotel.rooms.map((room: any) => ({
//       id: room._id,
//       roomNumber: room.roomNumber,
//       pricePerNight: room.pricePerNight,
//       amenities: room.amenities,
//     })),
//   }));
// };
import { HotelModel } from '../../models/hotel-model';

interface RoomType {
  _id: string;
  roomNumber: string;
  pricePerNight: number;
  amenities: string[];
}

interface HotelType {
  _id: string;
  hotelName: string;
  location: string;
  starRating: string;
  roomType: string;
  rooms: RoomType[];
}

interface GetFilteredArgs {
  rooms: string;
  roomType: string;
  locations: string;
  starRating: string;
}

const buildQuery = (args: GetFilteredArgs) => {
  const query: Record<string, unknown> = {};

  if (args.rooms) {
    query.rooms = { $in: [args.rooms] };
  }

  if (args.roomType) {
    query.roomType = args.roomType;
  }

  if (args.locations) {
    query.location = args.locations;
  }

  if (args.starRating) {
    query.starRating = args.starRating;
  }

  return query;
};

const transformHotel = (hotel: HotelType) => ({
  id: hotel._id,
  hotelName: hotel.hotelName,
  location: hotel.location,
  starRating: hotel.starRating,
  roomType: hotel.roomType,
  rooms: hotel.rooms.map((room) => ({
    id: room._id,
    roomNumber: room.roomNumber,
    pricePerNight: room.pricePerNight,
    amenities: room.amenities,
  })),
});

export const getFiltered = async (_: unknown, args: GetFilteredArgs) => {
  const query = buildQuery(args);
  const hotels = (await HotelModel.find(query).populate('rooms')) as HotelType[];
  return hotels.map(transformHotel);
};
