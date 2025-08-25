import { HotelModel } from '../../models/hotel-model';

export const deleteHotel = async (_: unknown, args: { id: string }) => {
  const deletedHotel = await HotelModel.findByIdAndDelete(args.id);

  return !!deletedHotel;
};
