import { model, models, Schema } from 'mongoose';

export type FoodSchemaType = {
  _id: Schema.Types.ObjectId;
  name: string;
  price: number;
  image: string;
  available: boolean;
  // discount: {
  //   value: number;
  //   startDate: Date;
  //   endDate: Date;
  // };
  categoryId: Schema.Types.ObjectId;
};

const foodSchema = new Schema<FoodSchemaType>(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      require: true,
    },
    available: {
      type: Boolean,
      require: true,
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref:"Category",
      required: false,
    },
  },
  { timestamps: true }
);

export const Food = models.FoodRes || model('FoodRes', foodSchema);