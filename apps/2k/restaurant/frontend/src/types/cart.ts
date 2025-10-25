export type AddPayload = {
  id: string;
  image: string;
  foodName: string;
  price: number;
};

export type CartItem = {
  id: string;
  image: string;
  foodName: string;
  price: number;
  selectCount: number;
};
