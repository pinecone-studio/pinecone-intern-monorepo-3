import { CartItem } from './cart';

// Payment methods-ийн төрөл
export type PaymentMethod = {
  id: 'qpay' | 'socialpay' | 'wallet' | 'card'; // Сонгох аргууд
  name: string;
  iconUrl: string; // Иконы URL
};

// Хүргэлтийн төрөл
export type FoodServeType = 'GO' | 'IN';

// Захиалгын мэдээлэл (MenuPage-ээс дамжуулагдах)
export interface FinalOrderPayload {
  tableQr: string;
  items: CartItem[]; // Таны өмнөх кодонд байгаа CartItem-ийн төрөл
  baseOrderAmount: number;
}
