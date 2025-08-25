import mongoose, { Schema } from 'mongoose';

type HotelType = {
  _id: Schema.Types.ObjectId;
  hotelName: string;
  description: string;
  rooms: Schema.Types.ObjectId[];
  location: string;
  starRating: string;
  userRating?: UserRatingType[];
  image?: string[];
};

export type UserRatingType = {
  hotel?: Schema.Types.ObjectId;
  // userId?: String,
  rating?: number;
  comment?: string;
};

const userRatingSchema = new mongoose.Schema<UserRatingType>(
  {
    // user: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    rating: { type: Number, required: false },
    hotel: { type: Schema.Types.ObjectId, ref: 'Hotel', required: false },
    comment: { type: String, required: false },
  },
  {
    _id: false,
  }
);

const hotelSchema = new mongoose.Schema<HotelType>(
  {
    hotelName: { type: String, required: true },
    description: { type: String, required: false },
    rooms: [{ type: Schema.Types.ObjectId, ref: 'Rooms' }],
    location: { type: String, required: true },
    starRating: { type: String, required: true },
    userRating: [userRatingSchema],
    image: [{ type: String, require: true }],
  },
  { timestamps: true }
);

export const HotelModel = mongoose.models.Hotel || mongoose.model<HotelType>('Hotel', hotelSchema);
