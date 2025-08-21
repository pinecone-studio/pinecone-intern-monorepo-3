
import { HotelModel } from "../../models/hotel-model";

export const submitUserRating = async (
  _: unknown,
  args: {
    hotelId: string;
    rating: number;
    comment?: string;
  }
) => {
  const hotel = await HotelModel.findById(args.hotelId);

  if (!hotel) {
    throw new Error("Hotel not found");
  }

  const newRating = {
    rating: args.rating,
    comment: args.comment,
    hotel:args.hotelId
    // hotel: new mongoose.Types.ObjectId(args.hotelId),
  };

  if (!Array.isArray(hotel.userRating)) {
    hotel.userRating = [];
  }

  hotel.userRating.push(newRating);
  await hotel.save();

  return hotel.userRating;
};
