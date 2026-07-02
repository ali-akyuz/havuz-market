import mockData from './mockData.json';
import { Product } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toProduct = (p: any): Product => p as Product;

export const getProducts = async (): Promise<Product[]> => {
  return mockData.products.map(toProduct);
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  const product = mockData.products.find((p) => p.slug === slug);
  return product ? toProduct(product) : null;
};

export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  return mockData.products.filter((p) => p.category === categoryId).map(toProduct);
};

export const getBestsellerProducts = async (): Promise<Product[]> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return mockData.products.filter((p) => (p.badges as any[]).includes("Çok Satan")).map(toProduct);
};

export const getCampaignProducts = async (): Promise<Product[]> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return mockData.products.filter((p) => (p.badges as any[]).includes("Kampanya")).map(toProduct);
};

export const getNewProducts = async (): Promise<Product[]> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return mockData.products.filter((p) => (p.badges as any[]).includes("Yeni Ürün")).map(toProduct);
};
