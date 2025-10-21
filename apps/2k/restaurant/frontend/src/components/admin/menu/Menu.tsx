"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ControlMenu } from './ControlMenu';
import { MenuFood } from './MenuFood';

export const TabsDemo = () => {
  return (
    <div className="flex w-full max-w-[600px] flex-col gap-6 p-6">
      <Tabs defaultValue="food" className="w-full">
        <TabsList>
          <TabsTrigger value="food">Цэсний бүтээгдэхүүн</TabsTrigger>
          <TabsTrigger value="menu">Цэс удирдах</TabsTrigger>
        </TabsList>

        <TabsContent value="food">
          <MenuFood />
        </TabsContent>

        <TabsContent value="menu">
          <ControlMenu />
        </TabsContent>
      </Tabs>
    </div>
  );
}
