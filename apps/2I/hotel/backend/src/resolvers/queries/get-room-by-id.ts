import { RoomModel } from '../../models/room-model';

export const getRoomById = async (_: unknown, { id }: { id: string }) => {
  try {
    const roomById = await RoomModel.findById(id);
    return roomById;
  } catch (err) {
    throw new Error('Something went wrong');
  }
};
