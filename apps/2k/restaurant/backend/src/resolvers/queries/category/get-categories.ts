import { QueryResolvers } from '../../../generated';
import { CategoryModel } from '../../../models/category.model';

export const getCategories: QueryResolvers['getCategories'] = async () => {
  try {
    // const categories = (await CategoryModel.find().populate({
    //   path: 'food',
    //   populate: [{ path: 'category' }, { path: 'discount' }],
    // })) as any;
    // return categories;
    const categories = await CategoryModel.find();
    return categories
  } catch (error) {
     throw new Error('Failed to fetch categories');
  }
};
