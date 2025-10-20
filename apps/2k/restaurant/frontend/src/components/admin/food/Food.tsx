
import { Trash } from 'lucide-react';
import { AddFoodDialog } from './AddFoodDialog';


const image = "zurag"
const foodList = [
  {
    id: 1,
    name: 'Taso',
    price: '15.6k',
    status: 'идэвхитэй',
    image: image,
  },
  { 
    id: 2,
    name: 'Burger Deluxe',
    price: '18.2k',
    status: 'идэвхитэй',
    image: image,
  },
  {
    id: 3,
    name: 'Spaghetti',
    price: '12.4k',
    status: 'идэвхгүй',
    image: image,
  },
  {
    id: 4,
    name: 'Sushi Mix',
    price: '21.5k',
    status: 'идэвхитэй',
    image: image,
  },
];

export const Food = () => {


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header section */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">Хоол</h2>
        <AddFoodDialog />
      </div>

      {/* Food grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {foodList.map((food) => (
          <div key={food.id} className="bg-white shadow-md rounded-2xl p-4 hover:shadow-lg transition duration-200">
            <img src={food.image} alt={food.name} className="w-full h-40 object-cover rounded-xl mb-3" />

            <div className="space-y-1">
              <p className="text-lg font-medium text-gray-800">{food.name}</p>
              <p className="text-gray-500">{food.price}</p>
              <p className={`font-medium ${food.status === 'идэвхитэй' ? 'text-green-600' : 'text-yellow-600'}`}>{food.status}</p>
            </div>

            {/* Actions */}
            <div className="flex justify-end items-center gap-3 mt-4">
              <AddFoodDialog />
              <button className="p-2 rounded-lg hover:bg-red-100 transition text-red-600">
                <Trash size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};