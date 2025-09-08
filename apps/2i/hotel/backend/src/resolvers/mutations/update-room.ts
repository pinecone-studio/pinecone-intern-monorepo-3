import { RoomModel, RoomType } from '../../models/room-model';

export const updateRoom = async (_: unknown, args: { roomId: string; input: Partial<RoomType> }) => {
  const updated = await RoomModel.findByIdAndUpdate(
    args.roomId,
    {
      $set: args.input,
    },
    { new: true }
  );
  if (!updated) {
    throw new Error('Room not found');
  }
  return { message: 'Successfully updated' };
};
