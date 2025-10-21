export type typeOrderItemType = {
  id: number;
  name: string;
  desc: string;
  price: number;
  quantity: number;
  image: string;
};

export type OrderItemType = {
  id: number;
  table: string;
  orderNumber: string;
  time: string;
  total: number;
  status: string;
  items: typeOrderItemType[];
};
