import { RoomModel } from '../../models/room-model';

export const getRooms = async () => {
  try {
    const rooms = await RoomModel.find();
    return rooms;
  } catch (err) {
    console.log(err);
    throw new Error('Something went wrong');
  }
};
