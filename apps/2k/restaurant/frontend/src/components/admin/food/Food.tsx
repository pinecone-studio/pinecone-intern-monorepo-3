import { useAllFoodQuery } from '@/generated';
import { AddFoodDialog } from './AddFoodDialog';
import { FoodItemCard } from './FoodCardItem';

const FoodItemCardSkeleton = () => (
  <div className="flex items-center justify-between border border-gray-200 rounded-xl p-4 animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-20 h-20 bg-gray-200 rounded-xl" />
      <div className="flex flex-col gap-2">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-6 w-16 bg-gray-200 rounded" />
        <div className="h-3 w-20 bg-gray-200 rounded" />
      </div>
    </div>
    <div className="flex gap-2">
      <div className="h-8 w-8 bg-gray-200 rounded" />
      <div className="h-8 w-8 bg-gray-200 rounded" />
    </div>
  </div>
);

export const Food = () => {
  const { data, loading, error, refetch: reFetchAdminFood } = useAllFoodQuery();

  console.log('data', data);

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-red-600">Error: {error.message}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex w-full max-w-[600px] flex-col gap-6 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Хоол</h2>
        </div>
        <div className="flex flex-col gap-5 mt-4">
          {[...Array(5)].map((_, i) => (
            <FoodItemCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  const foods = data?.allFood ?? [];
  return (
    <div className="flex w-full max-w-[600px] flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Хоол</h2>
        <AddFoodDialog reFetchAdminFood={reFetchAdminFood} />
      </div>

      {/* Food grid */}
      <div className="flex flex-col gap-5 mt-4">
        {foods?.map((food) => (
          <FoodItemCard key={food.id} food={food} reFetchAdminFood={reFetchAdminFood} />
        ))}
      </div>
    </div>
  );
};
