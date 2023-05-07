export interface Product {
  id: number;
  title: string;
  brand: string;
  price: number;
}

export interface ProductOutputDto {
  limit: number;
  products: Array<Product>;
  skip: number;
  total: number;
}
