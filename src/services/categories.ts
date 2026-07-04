/**
 * src/services/categories.ts — Kategori veri servisi (Frontend)
 *
 * Kategorileri backend API'sinden çeker.
 * Önceden mockData.json'dan okunuyordu.
 */

import { Category } from './types';
import { fetchApi } from '../lib/api';

/**
 * Backend kategori modelini frontend Category tipine dönüştürür.
 * Frontend bazı ek alanlar bekliyor (image, icon, subcategories)
 * Bu alanlar Phase 1'de boş bırakılır.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapToCategory = (c: any): Category => ({
  id: c.id,
  slug: c.slug,
  name: c.name,
  description: c.description || '',
  image: c.imageUrl || '',
  icon: '',           // Phase 1: ikon yok
  subcategories: [],  // Phase 1: alt kategori yok
});

/** Tüm kategorileri getir */
export const getCategories = async (): Promise<Category[]> => {
  try {
    const res = await fetchApi('/categories', { cache: 'no-store' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return res.data.map((c: any) => mapToCategory(c));
  } catch (error) {
    console.error('Kategoriler getirilemedi:', error);
    return [];
  }
};

/** Slug'a göre tek bir kategori getir */
export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  try {
    const categories = await getCategories();
    return categories.find((c) => c.slug === slug) || null;
  } catch (error) {
    console.error(`Kategori getirilemedi (slug: ${slug}):`, error);
    return null;
  }
};
