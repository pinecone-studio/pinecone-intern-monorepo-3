import { model, models, Schema } from 'mongoose';

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

export type RoomType = {
  _id: Schema.Types.ObjectId;
  hotelName: Schema.Types.ObjectId;
  roomNumber: string;
  roomType: string;
  pricePerNight: number;
  roomImgs: string[];
  roomInfos: string[];

  amenities: AmenitiesType;
};

const Rooms = new Schema(
  {
    hotelName: { type: Schema.Types.ObjectId, required: true, ref: 'Hotel' },
    roomNumber: { type: String, required: true },
    roomType: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    roomImgs: [{ type: String, required: true }],
    roomInfos: [{ type: String, required: true }],
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
  },
  { timestamps: true }
);

export const RoomModel = models.Rooms || model<RoomType>('Rooms', Rooms);
