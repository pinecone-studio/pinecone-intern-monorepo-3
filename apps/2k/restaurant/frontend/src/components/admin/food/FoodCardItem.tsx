import { Trash } from 'lucide-react';
import { AddFoodDialog } from './AddFoodDialog';

interface FoodItem {
  id: number;
  name: string;
  price: string;
  status: 'идэвхитэй' | 'идэвхгүй';
  image: string;
}

interface FoodItemCardProps {
  food: FoodItem;
}

export const FoodItemCard: React.FC<FoodItemCardProps> = ({ food }) => {
  return (
    <div className="flex flex-col w-64 bg-white rounded-2xl p-4 shadow-md">
      <img src={food.image} alt={food.name} className="w-full h-40 object-cover rounded-xl mb-4" />

      {/* Text хэсэг */}
      <div className="space-y-2 mb-4">
        <p className="text-lg font-semibold text-gray-900 truncate">{food.name}</p>
        <p className="text-base text-gray-700 font-medium">{food.price}</p>
        <p
          className={`text-sm font-medium ${
            food.status === 'идэвхитэй'
              ? 'text-gray-800' // бараандуу саарал
              : 'text-gray-400' // бүдэг саарал
          }`}
        >
          {food.status}
        </p>
      </div>

      {/* Button хэсэг */}
      <div className="flex justify-end items-center gap-3">
        <AddFoodDialog mode="edit" food={food} />
        <button className="p-2 rounded-lg text-gray-500 font-normal hover:bg-gray-100 transition-colors duration-200">
          <Trash size={20} />
        </button>
      </div>
    </div>
  );
};
