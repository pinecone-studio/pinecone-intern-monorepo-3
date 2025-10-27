import { useAllFoodQuery } from '@/generated';
import { AddFoodDialog } from './AddFoodDialog';
import { FoodItemCard } from './FoodCardItem';

import { Container, Stack } from '@mui/material';

const image = 'zurag';

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
