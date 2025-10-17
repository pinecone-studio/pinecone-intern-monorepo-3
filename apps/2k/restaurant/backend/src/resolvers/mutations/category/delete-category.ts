import { MutationResolvers } from '../../../generated';
import { CategoryModel } from '../../../models/category.model';

export const deleteCategory: MutationResolvers['deleteCategory'] = async (_, { categoryId }) => {
  const deletedCategory = await CategoryModel.findByIdAndDelete(categoryId);
  if (!deletedCategory) {
    throw new Error(`Category with ID ${categoryId} not found`);
  }

  return deletedCategory;
};
