import { Food } from '../../../models/food.model';

export const GetAllFoods = async () => {
  try {
    const allFood = await Food.find();

    if (allFood.length !== 0) {
      return allFood;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};
