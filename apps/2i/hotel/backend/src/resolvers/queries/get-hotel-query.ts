import { HotelModel } from '../../models/hotel-model';
import { connectToDb } from '../../utils/connect-to-db';

export const getHotel = async () => {
  const newHotel = await HotelModel.find();

  return newHotel;
};
