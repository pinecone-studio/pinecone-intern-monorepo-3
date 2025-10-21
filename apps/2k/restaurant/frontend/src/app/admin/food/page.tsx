'use client';

import { Food } from '@/components/admin/food/Food';
import { useAllFoodQuery } from '@/generated';
import { Container, Stack } from '@mui/material';

const AdminFoodStyle: React.FC = () => {
  const { data, loading, error } = useAllFoodQuery();
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

  return <Food />;
};

export default AdminFoodStyle; 