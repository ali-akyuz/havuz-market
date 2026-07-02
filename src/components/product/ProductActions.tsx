"use client";

import { useState } from "react";
import { Product } from "@/services/types";
import { useCartStore } from "@/lib/store/useCart";
import { useFavoritesStore } from "@/lib/store/useFavorites";
import { Minus, Plus, ShoppingCart, Heart, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const favorite = isFavorite(product.id);
  const isOutOfStock = product.stock === 0;

  const handleAdd = () => {
    addItem(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Quantity Selector */}
      {!isOutOfStock && (
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-navy-700">Adet:</span>
          <div className="flex items-center border-2 border-navy-100 rounded-2xl overflow-hidden">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-11 h-11 flex items-center justify-center text-navy-500 hover:bg-navy-50 transition-colors disabled:opacity-40"
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center font-bold text-navy-900 border-x-2 border-navy-100 h-11 flex items-center justify-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
              className="w-11 h-11 flex items-center justify-center text-navy-500 hover:bg-navy-50 transition-colors disabled:opacity-40"
              disabled={quantity >= product.stock}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <span className="text-sm text-navy-500">
            Stokta <span className="font-semibold text-navy-700">{product.stock}</span> adet var
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleAdd}
          disabled={isOutOfStock}
          className={cn(
            "flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-base transition-all",
            addedToCart
              ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
              : isOutOfStock
              ? "bg-navy-100 text-navy-400 cursor-not-allowed"
              : "bg-turquoise-500 hover:bg-turquoise-600 text-white shadow-lg shadow-turquoise-500/20 hover:shadow-turquoise-500/30 hover:-translate-y-0.5 active:translate-y-0"
          )}
        >
          {addedToCart ? (
            <><Check className="w-5 h-5" /> Sepete Eklendi!</>
          ) : isOutOfStock ? (
            "Stokta Yok"
          ) : (
            <><ShoppingCart className="w-5 h-5" /> Sepete Ekle</>
          )}
        </button>

        <button
          onClick={() => toggleFavorite(product)}
          className={cn(
            "w-14 h-14 flex items-center justify-center rounded-2xl border-2 transition-all",
            favorite
              ? "border-red-200 bg-red-50 text-red-500"
              : "border-navy-200 hover:border-red-200 hover:bg-red-50 hover:text-red-400 text-navy-500"
          )}
          aria-label={favorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
        >
          <Heart className={cn("w-5 h-5 transition-transform hover:scale-110", favorite && "fill-red-500")} />
        </button>
      </div>

      {isOutOfStock && (
        <p className="text-sm text-center text-navy-500 bg-navy-50 py-3 rounded-xl">
          Bu ürün şu an stokta bulunmuyor. Yeniden geldiğinde haberdar olmak için favorilerinize ekleyin.
        </p>
      )}
    </div>
  );
}
