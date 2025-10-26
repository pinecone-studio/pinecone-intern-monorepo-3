'use client';

import { useEffect, useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import MenuCard from './MenuCard';
import { OrderList } from './OrderList';
import { CartItem } from '@/types/cart';
import { useGetCategoriesQuery } from '@/generated';
import { Header } from '../Header';

export function addToCartReducer(prev: CartItem[], p: { id: string; image: string; name: string; price: number }): CartItem[] {
  const idx = prev.findIndex((x) => x.id === p.id);
  if (idx !== -1) {
    const next = [...prev];
    next[idx] = { ...next[idx], selectCount: next[idx].selectCount + 1 };
    return next;
  }
  return [...prev, { ...p, selectCount: 1 }];
}

export function removeOneReducer(prev: CartItem[], id: string): CartItem[] {
  const idx = prev.findIndex((x) => x.id === id);
  if (idx === -1) return prev;
  const item = prev[idx];
  if (item.selectCount <= 1) return prev.filter((x) => x.id !== id);
  const next = [...prev];
  next[idx] = { ...item, selectCount: item.selectCount - 1 };
  return next;
}

export function removeItemReducer(prev: CartItem[], id: string): CartItem[] {
  return prev.filter((x) => x.id !== id);
}

type MenuPageProps = {
  tableQr: string;
};

const MenuPage = ({ tableQr }: MenuPageProps) => {
  const { data: categories } = useGetCategoriesQuery();
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    if (categories?.getCategories?.length) {
      setActiveCategory(categories.getCategories[0]?.categoryName);
    }
  }, [categories]);

  const foods = categories?.getCategories.find((item) => item?.categoryName === activeCategory)?.food ?? [];

  const addToCart = (id: string, image: string, name: string, price: number) => {
    setCart((prev) => addToCartReducer(prev, { id, image, name, price }));
  };
  const removeOne = (id: string) => setCart((prev) => removeOneReducer(prev, id));
  const removeItem = (id: string) => setCart((prev) => removeItemReducer(prev, id));

  const cartCount = cart.reduce((a, b) => a + b.selectCount, 0);
  const totalPrice = cart.reduce((a, b) => a + b.price * b.selectCount, 0);

  const submitOrder = () => {
    if (cart.length === 0) return alert('Захиалга хоосон байна.');

    const newOrder = {
      orderId: Date.now().toString(),
      orderNumber: Math.floor(Math.random() * 10000),
      tableQr,
      items: cart,
      totalPrice: cart.reduce((a, b) => a + Number(b.price) * b.selectCount, 0),
      status: 'Боловсруулж байна',
      createdAt: new Date().toISOString(),
    };

    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    localStorage.setItem('orders', JSON.stringify([...orders, newOrder]));

    setCart([]);
    alert('Захиалга амжилттай илгээгдлээ!');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header/>
      <div className="w-full h-fit sticky top-[55px]">
        <div className="px-4 py-6 text-center bg-white">
          <h1 className="text-[#441500] text-2xl font-bold">Хоолны цэс ({tableQr})</h1>
        </div>

        {/* Categories */}
        <div className="px-4 py-4 bg-white">
          <div className="flex space-x-6 overflow-x-auto">
            {categories?.getCategories?.map((category) => (
              <button
                key={category?.categoryId}
                onClick={() => setActiveCategory(category?.categoryName)}
                className={`whitespace-nowrap text-sm font-medium p-1 border-2 rounded-lg transition-colors ${
                  activeCategory === category?.categoryName ? 'text-[#441500] border-[#441500]/20' : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                {category?.categoryName}
              </button>
            ))}
          </div>

          <div className="grid max-w-2xl grid-cols-2 gap-4 p-4 mx-auto overflow-scroll h-fit pb-23">
            {foods.length > 0 ? (
              foods.map((foodItem) => {
                const count = cart.find((x) => x.id === foodItem?.id)?.selectCount || 0;
                return (
                  <MenuCard
                    key={foodItem?.id}
                    image={foodItem?.image ?? '/placeholder.png'}
                    foodName={foodItem?.name ?? ''}
                    price={foodItem?.price ?? 0}
                    id={foodItem?.id ?? ''}
                    count={count}
                    // discount={foodItem?.discount}
                    onAdd={() => addToCart(foodItem?.id ?? '', foodItem?.image ?? '/placeholder.png', foodItem?.name ?? '', foodItem?.price ?? 0)}
                    onRemove={() => removeOne(foodItem?.id ?? '')}
                  />
                );
              })
            ) : (
              <p className="col-span-2 py-10 text-center text-gray-500">Энэ ангилалд хоол байхгүй байна.</p>
            )}
          </div>
        </div>

        {/* Drawer */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <Drawer>
            <DrawerTrigger className="w-full py-4 text-lg font-medium text-white rounded-lg bg-amber-800 hover:bg-amber-900">Захиалах ({cart.reduce((a, b) => a + b.selectCount, 0)})</DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Таны захиалга</DrawerTitle>
              </DrawerHeader>

              {cart.length === 0 ? (
                <div className="py-10 text-sm text-center text-zinc-500">Хоосон байна.</div>
              ) : (
                <div className="p-4 space-y-4">
                  {cart.map((item) => (
                    <OrderList
                      key={item.id}
                      id={item.id}
                      image={item.image}
                      name={item.name}
                      price={item.price}
                      count={item.selectCount}
                      onAdd={() => addToCart(item.id, item.image, item.name, item.price)}
                      onRemove={() => removeOne(item.id)}
                      removeItem={() => removeItem(item.id)}
                    />
                  ))}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <p className="font-medium">Нийт дүн:</p>
                    <p className="font-bold text-[#441500]">{totalPrice.toLocaleString()} ₮</p>
                  </div>
                  <button className="w-full py-2 mt-4 text-white rounded-lg bg-amber-800 hover:bg-amber-900" onClick={submitOrder}>
                    Захиалах
                  </button>
                </div>
              )}
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
