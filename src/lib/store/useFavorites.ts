import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/services/types';

interface FavoritesStore {
  items: Product[];
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleFavorite: (product) => {
        set((state) => {
          const isFav = state.items.some((item) => item.id === product.id);
          if (isFav) {
            return { items: state.items.filter((item) => item.id !== product.id) };
          } else {
            return { items: [...state.items, product] };
          }
        });
      },
      isFavorite: (productId) => {
        return get().items.some((item) => item.id === productId);
      },
    }),
    {
      name: 'arpeta-favorites-storage',
    }
  )
);
