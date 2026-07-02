"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star, Zap } from "lucide-react";
import { Product } from "@/services/types";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/lib/store/useCart";
import { useFavoritesStore } from "@/lib/store/useFavorites";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

const badgeStyles: Record<string, string> = {
  "Çok Satan": "bg-orange-500 text-white",
  "Kampanya": "bg-red-500 text-white",
  "Yeni Ürün": "bg-turquoise-500 text-white",
};

/*
  CARD ANATOMY — her bölüm kesin yüksekliğe sahip:
  ┌─────────────────────────────────────┐
  │ BADGE AREA          h-12  (48 px)   │
  ├─────────────────────────────────────┤
  │ IMAGE AREA          h-44  (176 px)  │
  ├─────────────────────────────────────┤
  │ CONTENT AREA  p-4 (16 px top+bot)  │
  │  brand         h-[18px]             │
  │  title         h-[40px] (2 lines)   │
  │  rating        h-[22px]             │
  │  old price     h-[18px]             │
  │  price + btn   h-[36px]             │
  └─────────────────────────────────────┘
  Toplam: 48 + 176 + (32 + 18+4 + 40+8 + 22+8 + 18+4 + 36) = ~418 px (sabit)
*/

export function ProductCard({ product }: ProductCardProps) {
  const [addedToCart, setAddedToCart] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const favorite = isFavorite(product.id);
  const isOutOfStock = product.stock === 0;
  const primaryBadge = product.badges[0] ?? null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;
    addItem(product, 1);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col bg-white rounded-2xl overflow-hidden border transition-all duration-300",
        isOutOfStock
          ? "border-navy-100 opacity-75"
          : "border-navy-100 hover:border-turquoise-200 hover:shadow-xl hover:shadow-navy-900/8 hover:-translate-y-1"
      )}
    >
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          BÖLÜM 1 — BADGE ALANI  ·  h-12 (48 px)  ·  değişmez
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="relative h-12 flex-none overflow-visible z-10">
        {/* Sol: indirim + birincil rozet */}
        <div className="absolute top-2.5 left-3 flex items-center gap-1.5">
          {product.discount > 0 && (
            <span className="inline-flex items-center gap-0.5 bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-lg whitespace-nowrap">
              <Zap className="w-2.5 h-2.5 flex-shrink-0" />
              %{product.discount}
            </span>
          )}
          {primaryBadge && (
            <span className={cn(
              "inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-lg whitespace-nowrap",
              badgeStyles[primaryBadge] ?? "bg-navy-800 text-white"
            )}>
              {primaryBadge}
            </span>
          )}
          {isOutOfStock && (
            <span className="inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-navy-400 text-white">
              Tükendi
            </span>
          )}
        </div>

        {/* Sağ: favori butonu */}
        <button
          onClick={(e) => { e.preventDefault(); toggleFavorite(product); }}
          className={cn(
            "absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-xl backdrop-blur-sm transition-all",
            favorite
              ? "bg-red-50 text-red-500 shadow-sm"
              : "bg-white/80 text-navy-400 hover:bg-white hover:text-red-400 opacity-0 group-hover:opacity-100"
          )}
          aria-label="Favorilere Ekle"
        >
          <Heart className={cn("w-4 h-4", favorite && "fill-red-500")} />
        </button>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          BÖLÜM 2 — GÖRSEL ALANI  ·  h-44 (176 px)  ·  değişmez
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Link
        href={`/urun/${product.slug}`}
        className="block flex-none h-44 bg-gradient-to-br from-slate-50 to-navy-50 overflow-hidden"
        tabIndex={-1}
      >
        <div className="relative w-full h-full">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-contain p-5 transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
      </Link>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          BÖLÜM 3 — İÇERİK ALANI  ·  sabit iç yükseklikler
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="flex flex-col flex-1 px-4 pt-3 pb-4">

        {/* Marka — 1 satır, sabit h-[18px] */}
        <p className="h-[18px] mb-1 text-[11px] font-bold text-turquoise-600 uppercase tracking-wider truncate leading-[18px]">
          {product.brand}
        </p>

        {/* Başlık — tam olarak 2 satır, sabit h-10 (40 px) */}
        <Link href={`/urun/${product.slug}`} className="mb-2">
          <h3
            className="h-10 text-sm font-semibold text-navy-900 hover:text-turquoise-700 transition-colors overflow-hidden"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              lineHeight: "1.25rem",   /* 20 px × 2 = 40 px */
            }}
          >
            {product.title}
          </h3>
        </Link>

        {/* Puan satırı — sabit h-[22px] */}
        <div className="h-[22px] mb-2 flex items-center gap-1.5 overflow-hidden">
          <div className="flex flex-shrink-0">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={cn(
                  "w-3.5 h-3.5",
                  i <= Math.round(Number(product.rating))
                    ? "fill-amber-400 text-amber-400"
                    : "fill-navy-100 text-navy-100"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-navy-500 leading-none">({product.reviewCount})</span>
        </div>

        {/* Eski fiyat — sabit h-[18px], indirim yoksa boş ama yer tutar */}
        <div className="h-[18px] mb-0.5 overflow-hidden">
          {product.oldPrice ? (
            <span className="text-xs text-navy-400 line-through leading-[18px]">
              {formatCurrency(product.oldPrice)}
            </span>
          ) : null}
        </div>

        {/* Güncel fiyat + Ekle butonu — sabit h-9 (36 px) */}
        <div className="h-9 flex items-center justify-between gap-2 overflow-hidden">
          <span className="text-[17px] font-black text-navy-900 leading-none truncate">
            {formatCurrency(product.price)}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={cn(
              "flex-shrink-0 flex items-center gap-1.5 px-3 h-8 rounded-xl text-[11px] font-semibold transition-all duration-200 whitespace-nowrap",
              addedToCart
                ? "bg-green-500 text-white"
                : isOutOfStock
                ? "bg-navy-100 text-navy-400 cursor-not-allowed"
                : "bg-navy-900 text-white hover:bg-turquoise-600 hover:shadow-lg hover:shadow-turquoise-500/20 active:scale-95"
            )}
          >
            <ShoppingCart className="w-3.5 h-3.5 flex-shrink-0" />
            {addedToCart ? "Eklendi!" : "Ekle"}
          </button>
        </div>
      </div>
    </div>
  );
}
