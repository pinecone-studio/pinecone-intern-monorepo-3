import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { AddFoodToCategory } from './FoodMenu/AddFoodToCategory';
import { Category, useAllFoodQuery } from '@/generated';
import { CategoryFoodItemCard } from './FoodMenu/CategoryFoodItemCard';
import { EmptyState } from './EmptyState';

const discounts = ['shine', 'ulirliin'];

export const MenuFood = ({ categories }: { categories: Category[] }) => {
  const [activeCategoryId, setActiveCategoryId] = useState('');
  const { data: AllFood, refetch: refetchAllFood } = useAllFoodQuery();

  console.log('categories', categories);

  useEffect(() => {
    setActiveCategoryId(categories[0]?.categoryId || '');
  }, [categories]);

  const allitems = [...categories, ...discounts];

  const uncategorizedFood = AllFood?.allFood?.filter((food) => food.categoryId === null || food.categoryId === '');

  const filteredFoodsByCategory = AllFood?.allFood?.filter((food) => food.categoryId === activeCategoryId);

  return (
    <Card className="border-gray-200 shadow-sm">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-200">
        <CardTitle className="text-xl font-bold text-[#441500]">Цэс</CardTitle>
        <AddFoodToCategory filteredCategoryFood={uncategorizedFood} activeCategory={activeCategoryId} refetchAllFood={refetchAllFood} />
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Категори товчнууд */}
        <div className="flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.categoryId}
              onClick={() => setActiveCategoryId(category.categoryId)}
              className={`flex-shrink-0 px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                activeCategoryId === category.categoryId ? 'bg-[#441500] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.categoryName}
            </button>
          ))}
        </div>

        {/* Food card */}

        {/* Food card */}
        {filteredFoodsByCategory && filteredFoodsByCategory.length > 0 ? (
          filteredFoodsByCategory.map((food) => <CategoryFoodItemCard key={food.id} food={food} refetchAllFood={refetchAllFood} />)
        ) : (
          <EmptyState />
        )}
      </CardContent>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </Card>
  );
};
