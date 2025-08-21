import { HotelModel } from '../../models/hotel-model';

export const getHotel = async () => {
  const newHotel = await HotelModel.find();

  return newHotel;
};
