import { HotelModel } from '../../models/hotel-model';

export const getHotel = async () => {
  const newHotel = await HotelModel.find().populate('rooms');

  return newHotel;
};
