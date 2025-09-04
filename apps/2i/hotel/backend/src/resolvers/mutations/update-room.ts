import { RoomModel, RoomType } from '../../models/room-model';

export const updateRoom = async (_: unknown, args: { id: string; input: Partial<RoomType> }) => {
  const updated = await RoomModel.findByIdAndUpdate(
    args.id,
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
