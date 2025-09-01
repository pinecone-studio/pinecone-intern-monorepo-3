import { model, models, Schema } from 'mongoose';

type BookingType = {
  _id: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  hotelName: Schema.Types.ObjectId;
  roomNumber: Schema.Types.ObjectId;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  pricePerNight: number;
  taxes: number;
  totalPrice: number;
};

const RoomBookingSchema = new Schema<BookingType>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    hotelName: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
    roomNumber: { type: Schema.Types.ObjectId, ref: 'Rooms', required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    nights: { type: Number, required: false },
    pricePerNight: { type: Number, required: false },
    taxes: { type: Number, required: false },
    totalPrice: { type: Number, required: false },
  },
  { timestamps: true }
);

export const BookingModel = models.BookingModel || model<BookingType>('BookingModel', RoomBookingSchema);
