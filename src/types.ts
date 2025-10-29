export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  brand: string;
  category: string;
  isOrganic: boolean;
  tag?: 'Top Rated' | 'Best Seller';
}

export interface FilterState {
  priceRange: [number, number];
  minRating: number;
  brands: string[];
  types: string[];
  delivery: string[];
}
