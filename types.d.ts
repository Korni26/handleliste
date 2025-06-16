type Product = {
  id: string;
  name: string;
  isPurchased: boolean;
};

type ProductList = {
  products: Product[];
};

type StoreInfo = {
  name: string;
};

type ApiProductInfo = {
  id: number;
  current_price: number;
  store: StoreInfo;
  name: string;
};
