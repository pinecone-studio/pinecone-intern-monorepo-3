import { model, models, Schema } from 'mongoose';

type BookingType = {
  _id: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  hotelName: Schema.Types.ObjectId;
  roomNumber: Schema.Types.ObjectId;
  checkIn: Date;
  checkOut: Date;
};

const RoomBookingSchema = new Schema<BookingType>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    hotelName: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
    roomNumber: { type: Schema.Types.ObjectId, ref: 'Rooms', required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
  },
  { timestamps: true }
);

export const BookingModel = models.BookingModel || model<BookingType>('Booking', RoomBookingSchema);
