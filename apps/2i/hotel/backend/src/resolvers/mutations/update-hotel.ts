import { HotelModel, HotelType } from '../../models/hotel-model';

export const updateHotel = async (_: unknown, args: { id: string; input: Partial<HotelType> }) => {
  const updated = await HotelModel.findByIdAndUpdate(
    args.id,
    {
      $set: args.input,
    },
    { new: true }
  );
  if (!updated) {
    throw new Error('Hotel not found');
  }
  return { message: 'Successfully updated' };
};
