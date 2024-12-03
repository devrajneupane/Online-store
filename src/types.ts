export type Item = {
  id: number;
  name: string;
  price: number;
  weight: number;
};

export type Package = {
  items: Item[];
  totalPrice: number;
  totalWeight: number;
  courierPrice: number;
};
