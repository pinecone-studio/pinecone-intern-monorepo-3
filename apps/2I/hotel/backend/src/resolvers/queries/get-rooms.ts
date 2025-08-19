import { RoomModel } from '../../models/room-model';

export const getRooms = async () => {
  try {
    const rooms = await RoomModel.find();
    return rooms;
  } catch (err) {
    throw new Error('Something went wrong');
  }
};
