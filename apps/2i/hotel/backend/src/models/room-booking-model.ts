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
  email: string;

  firstName: string;
  lastName: string;

  phoneNumber: string;
  cardNumber: string;
};

const RoomBookingSchema = new Schema<BookingType>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    hotelName: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
    roomNumber: { type: Schema.Types.ObjectId, ref: 'Rooms', required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    nights: { type: Number, required: false },
    pricePerNight: { type: Number, required: false },
    taxes: { type: Number, required: false },
    totalPrice: { type: Number, required: false },
    email: { type: String, required: false, ref: 'Users' },
    firstName: { type: String, required: true, ref: 'Users' },
    lastName: { type: String, required: true, ref: 'Users' },
    phoneNumber: { type: String, required: true, ref: 'Users' },
    cardNumber: { type: String, required: false },
  },
  { timestamps: true }
);

export const BookingModel = models.BookingModel || model<BookingType>('BookingModel', RoomBookingSchema);
