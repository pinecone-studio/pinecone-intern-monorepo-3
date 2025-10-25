import { Trash } from 'lucide-react';
import { AddFoodDialog } from './AddFoodDialog';
import { AllFoodQuery, FoodType } from '@/generated';
import { EditFoodDialog } from './UpdateFoodDialog';
import { ApolloQueryResult } from '@apollo/client';
import { DeleteFood } from './DeleteFoodDialog';

interface FoodItem {
  id: number;
  name: string;
  price: string;
  status: 'идэвхитэй' | 'идэвхгүй';
  image: string;
}

export const FoodItemCard = ({ food, reFetchAdminFood }: { food: FoodType; reFetchAdminFood: () => Promise<ApolloQueryResult<AllFoodQuery>> }) => {
  return (
    <div className="flex flex-col w-64 bg-white rounded-2xl p-4 shadow-md">
      <img src={food.image ?? undefined} alt={food.name ?? 'zurag baihgui'} className="w-full h-40 object-cover rounded-xl mb-4" />

      {/* Text хэсэг */}
      <div className="space-y-2 mb-4">
        <p className="text-lg font-semibold text-gray-900 truncate">{food.name}</p>
        <p className="text-base text-gray-700 font-medium">{food.price}</p>
        <p
          className={`text-sm font-medium ${
            food.available === true
              ? 'text-gray-800' // бараандуу саарал
              : 'text-gray-400' // бүдэг саарал
          }`}
        >
          {food.available}
        </p>
      </div>

      {/* Button хэсэг */}
      <div className="flex justify-end items-center gap-3">
        {/* <AddFoodDialog mode="edit" food={food} /> */}

        <EditFoodDialog food={food} reFetchAdminFood={reFetchAdminFood} />
        <DeleteFood food={food} reFetchAdminFood={reFetchAdminFood} />
      </div>
    </div>
  );
};
