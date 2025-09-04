import { RoomModel } from '../../models/room-model';

interface AmenitiesFilter {
  bathroom?: string[];
  foodAndDrink?: string[];
  technology?: string[];
  accessibility?: string[];
  bedroom?: string[];
  more?: string[];
}

interface GetFilterRoomArgs {
  roomType?: string;
  amenities?: AmenitiesFilter;
}

const buildQuery = (args: GetFilterRoomArgs): Record<string, unknown> => {
  const query: Record<string, unknown> = {
    ...(args.roomType && { roomType: args.roomType }),
    ...Object.entries(args.amenities || {}).reduce((acc, [key, values]) => {
      if (Array.isArray(values) && values.length > 0) {
        acc[`amenities.${key}`] = { $all: values };
      }
      return acc;
    }, {} as Record<string, unknown>),
  };

  return query;
};

export const getFilterRoom = async (_: unknown, args: GetFilterRoomArgs) => {
  const query = buildQuery(args);

  const filteredRooms = await RoomModel.find(query);

  return filteredRooms.map((room) => ({
    roomType: room.roomType,
    amenities: room.amenities,
  }));
};
