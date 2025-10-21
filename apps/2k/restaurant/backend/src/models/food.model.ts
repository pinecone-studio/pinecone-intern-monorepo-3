import { model, models, Schema } from 'mongoose';

// const DiscountSchema = new Schema({
//   value: { type: Number, default: 0 },
//   startDate: { type: Date },
//   endDate: { type: Date },
// });

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
  // categoryId: Schema.Types.ObjectId;
  // categoryId: string;
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
    // discount: { type: DiscountSchema },

    // categoryId: {
    //   type: String,
    //   required: true,
    // },

    // { timestamps: true },
  },
  { timestamps: true }
);

// export const Food = model<FoodSchemaType>("FoodRes", foodSchema);

export const Food = models.FoodRes || model('FoodRes', foodSchema);
