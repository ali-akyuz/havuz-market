"use client";

import { useFavoritesStore } from "@/lib/store/useFavorites";
import { ProductCard } from "@/components/product/ProductCard";
import { Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function FavoritesPage() {
  const [mounted, setMounted] = useState(false);
  const { items } = useFavoritesStore();

  // Zustand (localStorage) verilerinin sunucu ve istemci arasında uyuşmazlık (hydration error)
  // yaratmaması için sayfa tamamen yüklendikten sonra gösterilmesini sağlarız.
  useEffect(() => { setTimeout(() => setMounted(true), 0); }, []);
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center border border-red-100">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-navy-900">Favorilerim</h1>
            <p className="text-sm text-navy-500">{items.length} ürün kaydedildi</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-navy-100 p-16 text-center">
            <div className="w-20 h-20 rounded-2xl bg-navy-50 flex items-center justify-center mx-auto mb-5 border border-navy-100">
              <Heart className="w-9 h-9 text-navy-300" />
            </div>
            <h2 className="font-black text-navy-900 text-xl mb-2">Henüz Favori Yok</h2>
            <p className="text-navy-500 mb-8 max-w-sm mx-auto">
              İlginizi çeken ürünlerin kalp ikonuna tıklayarak burada saklayabilirsiniz.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-turquoise-500 hover:bg-turquoise-600 text-white font-bold px-8 py-4 rounded-2xl transition-all hover:shadow-lg"
            >
              Ürünleri Keşfet <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
