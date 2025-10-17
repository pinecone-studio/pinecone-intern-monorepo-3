import { MutationResolvers } from '../../../generated';
import { CategoryModel } from '../../../models/category.model';

export const createCategory: MutationResolvers['createCategory'] = async (_, { input: { categoryName } }) => {
  if (!categoryName || categoryName.trim() === '') {
    throw new Error('categoryName is required');
  }

  const newCategory = await CategoryModel.create({ categoryName });
  if (!newCategory) {
    throw new Error('Failed to create category in DB');
  }
  return newCategory;
};
