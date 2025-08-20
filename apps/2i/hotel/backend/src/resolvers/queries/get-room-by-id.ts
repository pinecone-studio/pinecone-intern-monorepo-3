import { RoomModel } from '../../models/room-model';

export const getRoomById = async (_: unknown, { id }: { id: string }) => {
  const roomById = await RoomModel.findById(id);
  return roomById;
};
