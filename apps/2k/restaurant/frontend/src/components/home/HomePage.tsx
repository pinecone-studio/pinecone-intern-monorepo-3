'use client';

import { useEffect, useState } from 'react';
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import MenuCard from './MenuCard';
import { OrderList } from './OrderList';
// Төрлүүд (Таны төсөлд байгааг ашиглана)
import { CartItem, AddPayload } from '@/types/cart';
import { useGetCategoriesQuery } from '@/generated';
import PaymentSelection from '@/components/payment/PaymentSelection';
import OrderType from './OrderType';

// Төрлүүд
type FoodServeTypeString = 'IN' | 'GO';

// Reducer functions (Хэвээр үлдэнэ)
export function removeItemReducer(prev: CartItem[], id: string): CartItem[] {
  return prev.filter((x) => x.id !== id);
}
// ... (Бусад reducer functions хэвээр үлдэнэ)
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
// ...

type MenuPageProps = {
  tableQr: string;
};

const MenuPage = ({ tableQr }: MenuPageProps) => {
  const { data: categories } = useGetCategoriesQuery();
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [isPaymentMode, setIsPaymentMode] = useState(false);
  const [selectedOrderType, setSelectedOrderType] = useState<FoodServeTypeString>('IN');

  // ... (useEffect, addToCart, removeOne, removeItem functions хэвээр)
  useEffect(() => {
    if (categories?.getCategories?.length) {
      setActiveCategory(categories.getCategories[0]?.categoryName);
    }
  }, [categories]);

  const addToCart = (id: string, image: string, foodName: string, price: number) => {
    setCart((prev) => addToCartReducer(prev, { id, image, foodName, price }));
  };
  const removeOne = (id: string) => setCart((prev) => removeOneReducer(prev, id));
  const removeItem = (id: string) => setCart((prev) => removeItemReducer(prev, id));

  const baseOrderAmount = cart.reduce((a, b) => a + Number(b.price) * b.selectCount, 0);

  // 🌟 goToPayment функц одоо OrderType Dialog-ийн доторх сонголтоос дуудагдана
  const goToPayment = (type: FoodServeTypeString) => {
    if (cart.length === 0) return alert('Захиалга хоосон байна.');
    setSelectedOrderType(type);
    setIsPaymentMode(true);
  };

  const submitOrder = (finalAmount: number, paymentMethod: string) => {
    // ... (submitOrder логик хэвээр)
    if (cart.length === 0) return;

    const newOrder = {
      orderId: Date.now().toString(),
      orderNumber: Math.floor(Math.random() * 10000),
      tableQr,
      items: cart,
      totalPrice: finalAmount,
      paymentMethod: paymentMethod,
      orderType: selectedOrderType,
      status: 'Боловсруулж байна',
      createdAt: new Date().toISOString(),
    };

    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    localStorage.setItem('orders', JSON.stringify([...orders, newOrder]));

    setCart([]);
    setIsPaymentMode(false);
    alert(`Захиалга (${selectedOrderType}) амжилттай илгээгдэж, ${finalAmount.toLocaleString()}₮ төлөгдлөө!`);
  };

  const foods = [
    {
      foodId: '1',
      foodName: 'Бууз',
      image: 'https://i.pinimg.com/1200x/26/a7/0e/26a70e2ddd9a68f19c12f2dbce11d0dc.jpg',
      price: 6500,
      discount: null,
    },
    {
      foodId: '2',
      foodName: 'Хуушуур',
      image: 'https://i.pinimg.com/736x/4a/70/74/4a7074e01ac804231a3956c5933cd106.jpg',
      price: 5500,
      discount: null,
    },
    {
      foodId: '3',
      foodName: 'Цуйван',
      image: 'https://i.pinimg.com/736x/4e/9b/e8/4e9be865dd4633f15024e38ae3880b76.jpg',
      price: 8500,
      discount: null,
    },
  ];

  // Төлбөрийн горимыг шалгах хэсэг
  if (isPaymentMode) {
    return (
      <div className="max-w-sm mx-auto min-h-screen bg-white">
        <PaymentSelection baseOrderAmount={baseOrderAmount} onClose={() => setIsPaymentMode(false)} onSubmit={submitOrder} selectedOrderType={selectedOrderType} />
      </div>
    );
  }

  // Үндсэн цэсний хуудас
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full h-fit sticky top-[55px]">
        {/* ... (Header and Categories хэвээр) */}
        <div className="px-4 py-6 text-center bg-white">
          <h1 className="text-[#441500] text-2xl font-bold">Хоолны цэс ({tableQr})</h1>
        </div>
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
            {foods.map((food) => {
              const count = cart.find((x) => x.id === food.foodId)?.selectCount || 0;
              return (
                <MenuCard
                  key={food.foodId}
                  image={food.image}
                  foodName={food.foodName}
                  price={food.price}
                  id={food.foodId}
                  count={count}
                  discount={food.discount}
                  onAdd={() => addToCart(food.foodId, food.image, food.foodName, food.price)}
                  onRemove={() => removeOne(food.foodId)}
                />
              );
            })}
          </div>
        </div>

        {/* Drawer - Захиалгыг баталгаажуулж, Төлбөр рүү шилжих хэсэг */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <Drawer>
            {/* 🌟 ӨӨРЧЛӨЛТ: OrderType-ийг DrawerTrigger-ээс хасаж, Энгийн Захиалах товчийг үлдээв */}
            <DrawerTrigger disabled={cart.length === 0} className={`w-full py-4 text-lg font-medium text-white rounded-lg ${cart.length > 0 ? 'bg-amber-800 hover:bg-amber-900' : 'bg-gray-400'}`}>
              Захиалах ({cart.reduce((a, b) => a + b.selectCount, 0)})
            </DrawerTrigger>

            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Таны захиалга</DrawerTitle>
              </DrawerHeader>

              {cart.length === 0 ? (
                <div className="py-10 text-sm text-center text-zinc-500">Хоосон байна.</div>
              ) : (
                <div className="py-4 space-y-4 px-4 overflow-y-auto max-h-[300px]">
                  {cart.map((item) => (
                    <OrderList
                      key={item.id}
                      id={item.id}
                      image={item.image}
                      foodName={item.foodName}
                      price={item.price}
                      count={item.selectCount}
                      onAdd={() => addToCart(item.id, item.image, item.foodName, item.price)}
                      onRemove={() => removeOne(item.id)}
                      removeItem={() => removeItem(item.id)}
                    />
                  ))}
                </div>
              )}
              {/* 🌟 ӨӨРЧЛӨЛТ: Footer-т OrderType-ийг оруулж, төлбөр рүү шилжих товч болгов */}
              <DrawerFooter className="text-center text-gray-700 font-bold border-t pt-4">
                <div className="w-full">
                  <p className="text-lg font-bold mb-4">Нийт дүн: {baseOrderAmount.toLocaleString()}₮</p>
                  <OrderType
                    currentCart={cart}
                    onProceedToPayment={goToPayment} // ⬅️ Энэ нь Drawer-ийг хаагаад PaymentPage-руу шилжүүлнэ
                  />
                </div>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
