'use client';

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { OrderList } from './OrderList';
import { AddPayload, CartItem } from '@/types/cart';
import { useState } from 'react';
import MenuCard from './MenuCard';

export function removeItemReducer(prev: CartItem[], id: string): CartItem[] {
  const norm = (v: string) => String(v).trim();
  const target = norm(id);
  const next = prev.filter((x) => norm(x.id) !== target);
  return next;
}
export function addToCartReducer(prev: CartItem[], p: AddPayload): CartItem[] {
  const idx = prev.findIndex((x) => x.id === p.id);
  if (idx >= 0) {
    const next = prev.slice();
    next[idx] = { ...next[idx], selectCount: next[idx].selectCount + 1 };
    return next;
  }
  return [...prev, { ...p, selectCount: 1 }];
}
export function removeOneReducer(prev: CartItem[], id: string): CartItem[] {
  const idx = prev.findIndex((x) => x.id === id);
  if (idx < 0) return prev;
  const next = prev.slice();
  const n = next[idx].selectCount - 1;
  if (n <= 0) next.splice(idx, 1);
  else next[idx] = { ...next[idx], selectCount: n };
  return next;
}

const HomePage = () => {
  const foods = [
    {
      foodId: '1',
      image: 'https://i.pinimg.com/1200x/26/a7/0e/26a70e2ddd9a68f19c12f2dbce11d0dc.jpg',
      foodName: 'Бууз',
      price: '6500',
      discount: null,
    },
    {
      foodId: '2',
      image: 'https://i.pinimg.com/736x/4a/70/74/4a7074e01ac804231a3956c5933cd106.jpg',
      foodName: 'Хуушуур',
      price: '5500',
      discount: null,
    },
    {
      foodId: '3',
      image: 'https://i.pinimg.com/736x/4e/9b/e8/4e9be865dd4633f15024e38ae3880b76.jpg',
      foodName: 'Цуйван',
      price: '8500',
      discount: null,
    },
  ];
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (id: string, image: string, foodName: string, price: string) => {
    setCart((prev) => addToCartReducer(prev, { id, image, foodName, price }));
  };
  const removeOne = (id: string) => setCart((prev) => removeOneReducer(prev, id));
  const removeItem = (id: string) => setCart((prev) => removeItemReducer(prev, id));
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full h-fit sticky top-[55px]">
        <div className="px-4 py-6 text-center bg-white">
          <h1 className="text-[#441500] text-2xl font-bold">Хоолны цэс</h1>
        </div>
        <div className="px-4 py-4 bg-white">
          <div className="flex space-x-6 overflow-x-auto">
            <button>Үндсэн</button>
            <button>Үндсэн</button>
            <button>Үндсэн</button>
          </div>
          <div className="grid max-w-2xl grid-cols-2 gap-4 p-4 mx-auto overflow-scroll h-fit pb-23">
            {foods.map((food) => {
              const count = cart.find((x) => x.id === food.foodId)?.selectCount || 0;
              return (
                <MenuCard
                  key={food.foodId}
                  image={food.image}
                  foodName={food.foodName}
                  price={food.price}
                  id={food.foodId}
                  onAdd={addToCart}
                  count={count}
                  onRemove={removeItem}
                  discount={food.discount}
                />
              );
            })}
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <Drawer data-testid="drawer-content">
            <DrawerTrigger className="w-full py-4 text-lg font-medium text-white rounded-lg bg-amber-800 hover:bg-amber-900">Захиалах</DrawerTrigger>
            <DrawerContent data-testid="drawer-content">
              <DrawerHeader>
                <DrawerTitle>Таны захиалга</DrawerTitle>
              </DrawerHeader>

              {cart.length === 0 ? (
                <div className="py-10 text-sm text-center text-zinc-500">Хоосон байна.</div>
              ) : (
                <div className="py-4 space-y-4">
                  {cart.map((item) => (
                    <OrderList
                      key={item.id}
                      id={item.id}
                      image={item.image}
                      foodName={item.foodName}
                      price={item.price}
                      count={item.selectCount}
                      onAdd={addToCart}
                      onRemove={removeOne}
                      removeItem={removeItem}
                    />
                  ))}
                </div>
              )}
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  );
};
export default HomePage;