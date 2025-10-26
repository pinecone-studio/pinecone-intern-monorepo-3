import { Category, GetCategoriesQuery } from '@/generated';
import { AddCategoryDialog } from './CategoryAddUpdate';
import { DeleteCategory } from './DeleteCategory';
import { ApolloQueryResult } from '@apollo/client';

export const ItemCard = ({ category, refetchCategory }: { category: Category; refetchCategory: () => Promise<ApolloQueryResult<GetCategoriesQuery>> }) => {
  return (
    <div className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3 bg-white hover:bg-gray-50 transition-all duration-200">
      <p className="text-[15px] font-medium text-gray-800">{category.categoryName}</p>

      <div className="flex items-center gap-1.5">
        <AddCategoryDialog isUpdate={true} refetchCategory={refetchCategory} category={category} />
        <DeleteCategory category={category} refetchCategory={refetchCategory} />
      </div>
    </div>
  );
};
