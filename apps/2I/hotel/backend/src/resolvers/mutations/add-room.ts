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
    const exists = await RoomModel.findOne({ roomNumber: args.roomNumber });
    if (exists) {
      throw new Error('This room already added');
    }
    return await RoomModel.create({ ...args });
  } catch (err: any) {
    if (err.message === 'This room already added') {
      throw err;
    }

    throw new Error('Something went wrong');
  }
};
