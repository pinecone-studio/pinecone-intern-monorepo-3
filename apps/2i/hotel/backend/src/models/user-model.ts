import { model, models, Schema } from 'mongoose';

type UserType = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  phoneNumber?: string;
  emergencyNumber: EmergencyNumberType;
  bookingRoom: Schema.Types.ObjectId;
};

type EmergencyNumberType = {
  phoneNumber: string;
  relation: string;
};

const emergencyNumberSchema = new Schema<EmergencyNumberType>({
  phoneNumber: { type: String, required: false },
  relation: { type: String, required: false },
});

const UserSchema = new Schema<UserType>(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    birthDate: { type: String, required: false },
    phoneNumber: { type: String, required: false },
    emergencyNumber: emergencyNumberSchema,
    bookingRoom: { type: Schema.Types.ObjectId, required: false, ref: 'BookingModel' },
  },
  { timestamps: true }
);

export const UserModel = models.Users || model<UserType>('Users', UserSchema);
