import mongoose, { model, models, Schema, Types } from 'mongoose';

export type DiscountType = {
  _id: Types.ObjectId;
  discountName: string;
  discountRate: number;
  startDate: Date;
  endDate: Date;
  food: Types.ObjectId[];
};
const DiscountSchema = new mongoose.Schema<DiscountType>(
  {
    discountName: {
      type: String,
      required: true,
    },
    discountRate: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    food: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Food',
        required: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);
export const DiscountModel = models.Discount || model<DiscountType>('Discount', DiscountSchema);