import { Pen } from 'lucide-react';
import { DeleteFood } from './DeleteFoodCategory';
import { AllFoodQuery, Category, FoodType } from '@/generated';
import { ApolloQueryResult } from '@apollo/client';

export const CategoryFoodItemCard = ({ food, refetchAllFood }: { food: FoodType; refetchAllFood: () => Promise<ApolloQueryResult<AllFoodQuery>> }) => {
  const statusText = food.available ? 'идэвхитэй' : 'идэвхгүй';
  const statusColor = food.available ? 'bg-green-400' : 'bg-red-400';

  return (
    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-4">
        <img src={food.image ?? ''} alt={food.name ?? ''} className="w-20 h-20 rounded-xl object-cover border border-gray-100" />
        <div className="flex flex-col justify-center leading-snug gap-1">
          <p className="text-base font-semibold text-gray-900 tracking-tight">{food.name}</p>
          <p className="text-lg font-bold text-[#441500]">{food.price?.toLocaleString()}₮</p>
          <p className="text-sm font-medium text-gray-500 flex items-center">
            <span className={`inline-block w-2 h-2 ${statusColor} rounded-full mr-1.5`}></span>
            {statusText}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {/* <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-all">
          <Pen className="w-4 h-4" />
        </button> */}
        <DeleteFood foodId={food.id} categoryId={food.categoryId ?? ''} refetchAllFood={refetchAllFood} />
      </div>
    </div>
  );
};
