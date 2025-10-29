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
  tableId: string | null;
};

// Skeleton Component
const MenuCardSkeleton = () => (
  <div className="w-full h-[230px] bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
    <div className="w-full h-40 bg-gray-200" />
    <div className="p-2 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
      <div className="h-5 w-12 bg-gray-200 rounded mx-auto" />
    </div>
  </div>
);

const MenuPage = ({ tableQr, tableId }: MenuPageProps) => {
  const router = useRouter(); // 🌟 useRouter-ийг ашиглав

  // 🔄 Polling нэмж байна - Админ хоол нэмсэн үед автоматаар шинэчлэх
  const { data: categories, loading } = useGetCategoriesQuery({
    pollInterval: 3000, // 3 секунд тутамд шинэчлэх
  });
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
      tableId: tableId,
    };

    localStorage.setItem('pendingOrder', JSON.stringify(paymentData));

    router.push('/order-payment');
  };

  console.log('tableQr', tableQr);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="w-full max-w-sm mx-auto pb-24">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <h1 className="text-[#441500] text-lg font-bold text-center">Хоолны цэс</h1>
          <p className="text-xs text-gray-500 text-center mt-1">Ширээ: {tableQr}</p>
        </div>

        {/* Categories Tabs - Sticky */}
        <div className="sticky top-14 z-40 bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
            {categories?.getCategories?.map((category) => (
              <button
                key={category?.categoryId}
                onClick={() => setActiveCategory(category?.categoryName)}
                className={`flex-shrink-0 whitespace-nowrap text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                  activeCategory === category?.categoryName ? 'bg-[#441500] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category?.categoryName}
              </button>
            ))}
          </div>
        </div>

        {/* Food Grid */}
        <div className="px-4 py-4 bg-gray-50">
          <div className="grid grid-cols-2 gap-3">
            {loading ? (
              // Skeleton Loading
              <>
                {[...Array(6)].map((_, i) => (
                  <MenuCardSkeleton key={i} />
                ))}
              </>
            ) : foods.length > 0 ? (
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
              <div className="col-span-2 py-12 text-center">
                <p className="text-sm text-gray-500">Энэ ангилалд хоол байхгүй байна.</p>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Bottom Cart Button */}
        <div className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto px-4 py-3 bg-white border-t border-gray-200 shadow-lg">
          <Drawer>
            <DrawerTrigger
              disabled={cart.length === 0}
              className={`w-full py-3 text-base font-semibold rounded-xl transition-colors ${
                cart.length > 0 ? 'bg-[#441500] text-white hover:bg-amber-900' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Захиалах ({cartCount})
            </DrawerTrigger>

            <DrawerContent className="max-w-sm mx-auto">
              <DrawerHeader className="border-b border-gray-200">
                <DrawerTitle className="text-lg font-bold text-[#441500]">Таны захиалга</DrawerTitle>
              </DrawerHeader>

              {cart.length === 0 ? (
                <div className="py-16 text-sm text-center text-gray-500">Хоосон байна.</div>
              ) : (
                <>
                  <div className="py-4 space-y-3 px-4 overflow-y-auto max-h-[60vh]">
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

                  <DrawerFooter className="pt-4 pb-6 border-t border-gray-200 bg-gray-50">
                    <div className="w-full space-y-4">
                      <div className="flex justify-between items-center px-2">
                        <span className="text-base font-semibold text-gray-700">Нийт дүн:</span>
                        <span className="text-xl font-bold text-[#441500]">{baseOrderAmount.toLocaleString()}₮</span>
                      </div>
                      <OrderType currentCart={cart} onProceedToPayment={goToPayment} />
                    </div>
                  </DrawerFooter>
                </>
              )}
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default MenuPage;
