export type AddPayload = {
  id: string;
  image: string;
  name: string;
  price: number;
};

export type CartItem = {
  id: string;
  image: string;
  name: string;
  price: number;
  selectCount: number;
};
