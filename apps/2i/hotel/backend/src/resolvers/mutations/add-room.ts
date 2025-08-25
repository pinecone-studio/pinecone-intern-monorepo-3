import { HotelModel } from '../../models/hotel-model';
import { RoomModel } from '../../models/room-model';

type AddRoomArgs = {
  hotelName: string;
  roomNumber: string;
  roomType: string;
  pricePerNight: number;
  roomImgs: string[];
  roomInfos: string[];
  amenities: {
    bathroom: string[];
    foodAndDrink: string[];
    technology: string[];
    accessibility: string[];
    bedroom: string[];
    more: string[];
  };
};

export const addRoom = async (_: unknown, args: AddRoomArgs) => {
  try {
    const exists = await RoomModel.findOne({
      hotelName: args.hotelName,
      roomNumber: args.roomNumber,
    });

    if (exists) {
      throw new Error('This room already added');
    }

    const newRoom = await RoomModel.create(args);

    await HotelModel.findOneAndUpdate({ _id: args.hotelName }, { $push: { rooms: newRoom._id } });

    return { message: 'Succesfully added room in this hotel' };
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }

    throw new Error('Something wrong happen');
  }
};
