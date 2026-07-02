export interface Subcategory {
  id: string;
  slug: string;
  name: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  icon: string;
  subcategories: Subcategory[];
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  brand: string;
  category: string;
  subcategory: string;
  price: number;
  oldPrice: number | null;
  discount: number;
  stock: number;
  rating: string;
  reviewCount: number;
  images: string[];
  shortDescription: string;
  description: string;
  technicalSpecs: Record<string, string>;
  badges: string[];
}
