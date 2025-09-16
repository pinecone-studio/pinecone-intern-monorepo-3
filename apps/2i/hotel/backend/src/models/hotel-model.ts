import { model, models, Schema } from 'mongoose';

export type HotelType = {
  _id: Schema.Types.ObjectId;
  hotelName: string;
  description: string;
  phoneNumber: string;
  about: string;
  rooms: Schema.Types.ObjectId[];
  location: string;
  languages: string[];
  starRating: string;
  userRating?: UserRatingType[];
  image?: string[];
  amenities: AmenitiesType;
  policies: {
    title: string;
    description: string;
  }[];
};
type AmenitiesType = {
  bathroom: string[];
  foodAndDrink: string[];
  technology: string[];
  accessibility: string[];
  bedroom: string[];
  wifi: Boolean;
  parking: Boolean;
  spa: Boolean;
  more: string[];
};

export type UserRatingType = {
  hotel?: Schema.Types.ObjectId;
  // userId?: String,
  rating?: number;
  comment?: string;
};

const userRatingSchema = new Schema<UserRatingType>(
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

const hotelSchema = new Schema<HotelType>(
  {
    hotelName: { type: String, required: true },
    description: { type: String, required: true },
    about: { type: String, required: false },
    languages: [{ type: String, required: false }],
    phoneNumber: { type: String, required: true },
    rooms: [{ type: Schema.Types.ObjectId, ref: 'Rooms' }],
    amenities: {
      bathroom: [{ type: String, required: true }],
      foodAndDrink: [{ type: String, required: true }],
      technology: [{ type: String, required: true }],
      accessibility: [{ type: String, required: true }],
      bedroom: [{ type: String, required: true }],
      wifi: { type: Boolean, required: false },
      parking: { type: Boolean, required: false },
      spa: { type: Boolean, required: false },
      more: [{ type: String, required: true }],
    },
    policies: [
      {
        title: { type: String, required: false },
        description: { type: String, required: false },
      },
    ],
    location: { type: String, required: false },
    starRating: { type: String, required: true },
    userRating: [userRatingSchema],
    image: [{ type: String, require: false }],
  },
  { timestamps: true }
);

export const HotelModel = models.Hotel || model<HotelType>('Hotel', hotelSchema);
