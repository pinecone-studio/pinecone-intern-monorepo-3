import { useAllFoodQuery } from '@/generated';
import { AddFoodDialog } from './AddFoodDialog';
import { FoodItemCard } from './FoodCardItem';

import { Container, Stack } from '@mui/material';

const image = 'zurag';

type FoodItem = {
  id: number;
  name: string;
  price?: string;
  status: 'идэвхитэй' | 'идэвхгүй';
  image?: string;
};

export const Food = () => {

  const { data, loading, error, refetch: reFetchAdminFood } = useAllFoodQuery();
  
  console.log('data', data);

  if (error) {
    return (
      <Container maxWidth="xs">
        <Stack py={8}>Error: {error.message}</Stack>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="xs">
        <Stack py={8}>Loading...</Stack>
      </Container>
    );
  }

  const foods = data?.allFood ?? [];
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Хоол</h2>
        <AddFoodDialog reFetchAdminFood={reFetchAdminFood} />
      </div>

      {/* Food grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {foods?.map((food) => (
          <FoodItemCard key={food.id} food={food} reFetchAdminFood={reFetchAdminFood}/>
        ))}
      </div>
    </div>
  );
};
