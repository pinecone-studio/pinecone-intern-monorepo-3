'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ManageMenu } from './ManageMenu';
import { MenuFood } from './FoodMenu';
import { Category, useGetCategoriesQuery } from '@/generated';

export const TabsDemo = () => {
  const { data, loading, error, refetch:refetchCategory } = useGetCategoriesQuery();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  console.log('Categories data:', data);
  return (
    <div className="flex w-full max-w-[600px] flex-col gap-6 p-6">
      <Tabs defaultValue="food" className="w-full">
        <TabsList>
          <TabsTrigger value="food">Цэсний бүтээгдэхүүн</TabsTrigger>
          <TabsTrigger value="menu">Цэс удирдах</TabsTrigger>
        </TabsList>

        <TabsContent value="food">
          <MenuFood categories={(data?.getCategories?.filter(Boolean) as Category[]) ?? []} />
        </TabsContent>

        <TabsContent value="menu">
          <ManageMenu categories={(data?.getCategories?.filter(Boolean) as Category[]) ?? []} refetchCategory={refetchCategory}/>
        </TabsContent>
      </Tabs>
    </div>
  );
};