import { HotelModel } from '../../models/hotel-model';

type Args = {
  hotelId: string;
  image: string[];
};

export const uploadToCloudinary = async (_: unknown, args: Args) => {
  const { hotelId, image } = args;

  try {
    const existingHotel = await HotelModel.findById(hotelId);

    if (!existingHotel) {
      throw new Error('Hotel not found');
    }

    existingHotel.image.push(...image);
    await existingHotel.save();

    return existingHotel;
  } catch (err) {
    throw new Error(`Server error: ${err}`);
  }
};
