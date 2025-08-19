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
    const isExistingRoom = await RoomModel.findOne({ hotelName: args.hotelName, roomNumber: args.roomNumber }).lean();
    if (isExistingRoom) {
      throw new Error('This room already added');
    }
    return await RoomModel.create({ ...args });
  } catch (err: any) {
    if (err?.code === 11000) {
      throw new Error('This room already added');
    }
    console.error('addRoom error', err);
    throw new Error('Something went wrong');
  }
};
