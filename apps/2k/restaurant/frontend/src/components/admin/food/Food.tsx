import { AddFoodDialog } from './AddFoodDialog';
import { FoodItemCard } from './FoodCardItem';

const image = 'zurag';

type FoodItem = {
  id: number;
  name: string;
  price: string;
  status: 'идэвхитэй' | 'идэвхгүй';
  image: string;
};

const foodList: FoodItem[] = [
  { id: 1, name: 'Taso', price: '15.6k', status: 'идэвхитэй', image },
  { id: 2, name: 'Burger Deluxe', price: '18.2k', status: 'идэвхитэй', image },
  { id: 3, name: 'Spaghetti', price: '12.4k', status: 'идэвхгүй', image },
  { id: 4, name: 'Sushi Mix', price: '21.5k', status: 'идэвхитэй', image },
];

export const Food = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Хоол</h2>
        <AddFoodDialog mode="add" />
      </div>

      {/* Food grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {foodList.map((food) => (
          <FoodItemCard key={food.id} food={food} />
        ))}
      </div>
    </div>
  );
};
