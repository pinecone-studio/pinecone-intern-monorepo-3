// updateFood.ts
import { Food } from '../../../models/food.model';

type FoodType = {
  name: string;
  image: string;
  price: number;
  id: string;
  available: boolean;
};

export const updateFood = async (_: unknown, { name, image, price, id, available }: FoodType) => {
  try {
    if (!id) return;

    const food = await Food.findById(id);

    if(!food) return;

    await Food.findByIdAndUpdate(id, { name, available, image, price }, { new: true });

    return {
      id,
      name,
      available,
      image,
      price,
    };
  } catch (error) {
    console.log('Error updating food:', error);
  }
};
