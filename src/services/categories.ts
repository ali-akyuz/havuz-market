import mockData from './mockData.json';
import { Category } from './types';

export const getCategories = async (): Promise<Category[]> => {
  return mockData.categories as Category[];
};

export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  const category = mockData.categories.find((c) => c.slug === slug);
  return (category as Category) || null;
};
