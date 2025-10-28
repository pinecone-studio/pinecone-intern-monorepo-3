'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // 🌟 Next.js Router-ийг импортлов
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import MenuCard from './MenuCard';
import { OrderList } from './OrderList';
import { CartItem, AddPayload } from '@/types/cart';
import { useGetCategoriesQuery } from '@/generated';
import OrderType from './OrderType';
import { Header } from '../Header';

// Төрлүүд
type FoodServeTypeString = 'IN' | 'GO';

// Reducer Functions (Хэвээр үлдэнэ)
export function addToCartReducer(prev: CartItem[], p: AddPayload): CartItem[] {
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
  const router = useRouter(); // 🌟 useRouter-ийг ашиглав

  const { data: categories } = useGetCategoriesQuery();
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
  const [cart, setCart] = useState<CartItem[]>([]);

  // 🌟 isPaymentMode болон selectedOrderType state-ийг хасав
  // OrderType-д хэрэгтэй тул selectedOrderType-ийг хадгалъя
  const [selectedOrderType, setSelectedOrderType] = useState<FoodServeTypeString>('IN');

  useEffect(() => {
    if (categories?.getCategories?.length) {
      setActiveCategory(categories.getCategories[0]?.categoryName);
    }
  }, [categories]);

  const foods = categories?.getCategories?.find((item) => item?.categoryName === activeCategory)?.food ?? [];

  const addToCart = (id: string, image: string, name: string, price: number) => {
    setCart((prev) => addToCartReducer(prev, { id, image, name, price }));
  };
  const removeOne = (id: string) => setCart((prev) => removeOneReducer(prev, id));
  const removeItem = (id: string) => setCart((prev) => removeItemReducer(prev, id));

  const baseOrderAmount = cart.reduce((a, b) => a + Number(b.price) * b.selectCount, 0);
  const cartCount = cart.reduce((a, b) => a + b.selectCount, 0);


  const goToPayment = (type: FoodServeTypeString) => {
    if (cart.length === 0) return alert('Захиалга хоосон байна.');

    const paymentData = {
      cartItems: cart,
      baseOrderAmount: baseOrderAmount,
      selectedOrderType: type,
      tableQr: tableQr,
    };

    localStorage.setItem('pendingOrder', JSON.stringify(paymentData));

    router.push('/order-payment');
  };

  return (
    <div className="items-center min-h-screen ">
      <Header />
      <div className="w-full h-fit sticky top-[55px] flex flex-col items-center">
        {/* ... (Categories болон Foods хэвээр) ... */}
        <div className="px-4 py-6 text-center bg-white">
          <h1 className="text-[#441500] text-2xl font-bold">Хоолны цэс ({tableQr})</h1>
        </div>
        <div className="px-4 py-4 bg-white">
          <div className="flex space-x-6 overflow-x-auto">
            {categories?.getCategories?.map((category) => (
              <button
                key={category?.categoryId}
                onClick={() => setActiveCategory(category?.categoryName)}
                className={`whitespace-nowrap text-sm font-medium p-1 border-b-2 transition-colors ${
                  activeCategory === category?.categoryName ? 'text-[#441500] border-[#441500]' : 'text-gray-500 border-transparent hover:text-gray-700'
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

        {/* Drawer - Сагс болон Захиалгын Төрөл Сонгох */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <Drawer>
            <DrawerTrigger disabled={cart.length === 0} className={`w-full py-4 text-lg font-medium text-white rounded-lg ${cart.length > 0 ? 'bg-amber-800 hover:bg-amber-900' : 'bg-gray-400'}`}>
              Захиалах ({cartCount})
            </DrawerTrigger>

            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Таны захиалга</DrawerTitle>
              </DrawerHeader>

              {cart.length === 0 ? (
                <div className="py-10 text-sm text-center text-zinc-500">Хоосон байна.</div>
              ) : (
                <>
                  <div className="py-4 space-y-4 px-4 overflow-y-auto max-h-[300px]">
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
                  </div>

                  <DrawerFooter className="pt-4 font-bold text-center text-gray-700 border-t">
                    <div className="w-full">
                      <p className="mb-4 text-lg font-bold">Нийт дүн: {baseOrderAmount.toLocaleString()}₮</p>
                      {/* OrderType нь goToPayment-ийг дуудан router-ээр шилжүүлнэ */}
                      <OrderType currentCart={cart} onProceedToPayment={goToPayment} />
                    </div>
                  </DrawerFooter>
                </>
              )}
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
