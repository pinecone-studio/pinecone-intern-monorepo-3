import mongoose from 'mongoose';
import { MutationResolvers } from '../../../generated';
import { CategoryModel } from '../../../models/category.model';
import { Food } from '../../../models/food.model';

export const deleteCategory: MutationResolvers['deleteCategory'] = async (_, { categoryId }) => {
  const deletedCategory = await CategoryModel.findByIdAndDelete(categoryId);
  if (!deletedCategory) {
    throw new Error(`Category with ID ${categoryId} not found`);
  }

  const updatedFood = await Food.updateMany({ categoryId: new mongoose.Types.ObjectId(categoryId) }, { $set: { categoryId: null } });
  console.log('updatedFood', updatedFood);

  return deletedCategory;
};
