/**
 * src/services/products.ts — Ürün veri servisi (Frontend)
 *
 * Bu dosya, backend API'sinden ürün verilerini çeker ve
 * mevcut frontend "Product" tipine dönüştürür (adaptör deseni).
 *
 * Önceden bu dosya mockData.json'dan veri okuyordu.
 * Artık gerçek backend API'sine istek atıyor.
 */

import { Product } from './types';
import { fetchApi } from '../lib/api';

/**
 * Backend'den gelen API verisini frontend Product tipine dönüştürür.
 *
 * Neden gerekli?
 * Backend yeni tasarlandığı için bazı alan adları farklı:
 * - "name" (backend) → "title" (frontend)
 * - "priceKurus" (backend, kuruş) → "price" (frontend, TL)
 * - "category.name" (backend) → "category" (frontend)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapToProduct = (p: any): Product => ({
  id: p.id,
  slug: p.slug,
  title: p.name,
  brand: p.category?.name || '',    // Basit yapı: brand yerine kategori kullanıyoruz
  category: p.category?.name || '', // Kategori adı
  subcategory: '',
  price: p.priceKurus / 100,        // Kuruşu TL'ye çevir (150000 → 1500.00)
  oldPrice: null,
  discount: 0,
  stock: p.stock,
  rating: '4.5',                    // Phase 1: statik değer
  reviewCount: 0,
  images: p.imageUrls || [],
  shortDescription: p.description?.substring(0, 100) || '',
  description: p.description || '',
  technicalSpecs: {},
  badges: p.isFeatured ? ['Kampanya'] : [],
});

/** Tüm ürünleri getir */
export const getProducts = async (): Promise<Product[]> => {
  try {
    const res = await fetchApi('/products', { cache: 'no-store' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return res.data.map((p: any) => mapToProduct(p));
  } catch (error) {
    console.error('Ürünler getirilemedi:', error);
    return [];
  }
};

/** Slug'a göre tek bir ürün getir */
export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    const res = await fetchApi(`/products/${slug}`, { cache: 'no-store' });
    return mapToProduct(res.data);
  } catch (error) {
    console.error(`Ürün getirilemedi (slug: ${slug}):`, error);
    return null;
  }
};

/** Kategoriye göre ürünleri getir */
export const getProductsByCategory = async (categorySlug: string): Promise<Product[]> => {
  try {
    const res = await fetchApi(`/products?category=${categorySlug}`, { cache: 'no-store' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return res.data.map((p: any) => mapToProduct(p));
  } catch (error) {
    console.error('Kategori ürünleri getirilemedi:', error);
    return [];
  }
};

/** Öne çıkan ürünleri getir (isFeatured = true) */
export const getBestsellerProducts = async (): Promise<Product[]> => {
  try {
    const res = await fetchApi('/products', { cache: 'no-store' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return res.data.filter((p: any) => p.isFeatured).map((p: any) => mapToProduct(p));
  } catch (error) {
    console.error('Öne çıkan ürünler getirilemedi:', error);
    return [];
  }
};

/** Kampanyalı ürünleri getir */
export const getCampaignProducts = async (): Promise<Product[]> => {
  return getBestsellerProducts(); // Phase 1: öne çıkanlar = kampanyalı
};

/** Yeni ürünleri getir */
export const getNewProducts = async (): Promise<Product[]> => {
  try {
    const res = await fetchApi('/products', { cache: 'no-store' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return res.data.slice(0, 4).map((p: any) => mapToProduct(p)); // Phase 1: ilk 4 ürün
  } catch (error) {
    console.error('Yeni ürünler getirilemedi:', error);
    return [];
  }
};
