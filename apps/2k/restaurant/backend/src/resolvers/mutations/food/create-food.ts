import { Food } from '../../../models/food.model';

type FoodType = {
  name: string;
  image: string;
  price: number;
  available: boolean;
  // categoryId:String;
  // categoryId:Schema.Types.ObjectId
};

export const createFood = async (_: unknown, { name, image, price, available }: FoodType) => {
  if (!name) return;

  const newFood = await new Food({ name, image, price, available }).save();
  return newFood;
};
