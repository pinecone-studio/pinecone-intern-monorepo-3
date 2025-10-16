import { model, models, Schema } from 'mongoose';

type FoodOrderItemType = {
  food: Schema.Types.ObjectId;
  quantity: number;
};

const foodOrderItem = new Schema<FoodOrderItemType>({
  food: { type: Schema.Types.ObjectId, ref: 'FoodRes', required: true },
  quantity: { type: Number, required: true },
});

const foodOrderSchema = new Schema(
  {
    userId: { type: String, required: true },
    tableId: { type: String, required: true },
    orderNumber: { type: Number, required: true },
    totalPrice: { type: Number, require: true },
    status: {
      type: String,
      enum: ['PENDING', 'INPROGRESS', 'COMPLETED', 'SERVED'],
      default: 'PENDING',
    },
    serveType: {
      type: String,
      enum: ['IN', 'GO'],
      default: 'IN',
    },
    foodOrderItems: [{ type: foodOrderItem, require: true }],
  },
  { timestamps: true }
);

export const FoodOrder = models.FoodOrderRes || model('FoodOrderRes', foodOrderSchema);
