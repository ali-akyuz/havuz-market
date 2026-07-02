"use client";

import { useCartStore } from "@/lib/store/useCart";
import { formatCurrency } from "@/lib/utils";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCartStore();

  // Zustand (localStorage) verilerinin sunucu ve istemci arasında uyuşmazlık (hydration error)
  // yaratmaması için sayfa tamamen yüklendikten sonra gösterilmesini sağlarız.
  useEffect(() => { setTimeout(() => setMounted(true), 0); }, []);
  if (!mounted) return null;

  const subtotal = getTotalPrice();
  const shipping = subtotal > 1000 ? 0 : 49.90;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 py-20">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 rounded-3xl bg-navy-50 flex items-center justify-center mx-auto mb-6 border border-navy-100">
            <ShoppingCart className="w-10 h-10 text-navy-300" />
          </div>
          <h1 className="text-2xl font-black text-navy-900 mb-3">Sepetiniz Boş</h1>
          <p className="text-navy-500 mb-8">
            Sepetinizde henüz ürün yok. Hemen alışverişe başlayıp havuzunuz için ihtiyacınız olan ekipmanları bulun.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 bg-turquoise-500 hover:bg-turquoise-600 text-white font-bold px-8 py-4 rounded-2xl transition-all hover:shadow-lg">
            Alışverişe Başla <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-black text-navy-900 mb-8">
          Sepetim <span className="text-lg font-semibold text-navy-500 ml-2">({items.length} ürün)</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Items */}
          <div className="flex-grow space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="bg-white rounded-2xl border border-navy-100 p-5 flex gap-5 items-center">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-navy-50 flex-shrink-0 border border-navy-100">
                  <Image src={item.product.images[0]} alt={item.product.title} fill className="object-contain p-2" sizes="80px" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-turquoise-600 mb-0.5 uppercase tracking-wide">{item.product.brand}</p>
                  <Link href={`/urun/${item.product.slug}`} className="font-bold text-navy-900 hover:text-turquoise-700 transition-colors text-sm line-clamp-2">
                    {item.product.title}
                  </Link>
                  <p className="text-lg font-black text-navy-900 mt-1">{formatCurrency(item.product.price)}</p>
                </div>

                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                  <div className="flex items-center border-2 border-navy-100 rounded-xl overflow-hidden">
                    <button onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))} className="w-8 h-8 flex items-center justify-center text-navy-500 hover:bg-navy-50 transition-colors">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-10 text-center text-sm font-bold border-x-2 border-navy-100 h-8 flex items-center justify-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, Math.min(item.product.stock, item.quantity + 1))} className="w-8 h-8 flex items-center justify-center text-navy-500 hover:bg-navy-50 transition-colors">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-black text-navy-900">{formatCurrency(item.product.price * item.quantity)}</span>
                    <button onClick={() => removeItem(item.product.id)} className="text-navy-300 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between pt-2">
              <Link href="/" className="text-sm text-turquoise-600 hover:underline font-semibold">
                ← Alışverişe devam et
              </Link>
              <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-600 transition-colors">
                Sepeti temizle
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-navy-100 p-6 sticky top-24">
              <h2 className="font-black text-navy-900 text-xl mb-6">Sipariş Özeti</h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm text-navy-600">
                  <span>Ara Toplam</span>
                  <span className="font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-navy-600">Kargo</span>
                  {shipping === 0 ? (
                    <span className="font-semibold text-green-600">Ücretsiz</span>
                  ) : (
                    <span className="font-semibold text-navy-900">{formatCurrency(shipping)}</span>
                  )}
                </div>
                {shipping > 0 && (
                  <div className="flex items-center gap-2 p-3 bg-turquoise-50 rounded-xl text-xs text-turquoise-700 border border-turquoise-100">
                    <Tag className="w-3.5 h-3.5" />
                    {formatCurrency(1000 - subtotal)} daha alışveriş yapın, kargo ücretsiz!
                  </div>
                )}
              </div>

              <div className="border-t border-navy-100 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-navy-900">Toplam</span>
                  <span className="text-2xl font-black text-turquoise-600">{formatCurrency(total)}</span>
                </div>
                <p className="text-xs text-navy-400 mt-1">KDV dahil</p>
              </div>

              <Link
                href="/odeme"
                className="w-full flex items-center justify-center gap-3 bg-turquoise-500 hover:bg-turquoise-600 text-white font-bold py-4 rounded-2xl transition-all hover:shadow-xl hover:shadow-turquoise-500/20 hover:-translate-y-0.5 text-base"
              >
                Siparişi Tamamla
                <ArrowRight className="w-5 h-5" />
              </Link>

              <div className="flex items-center justify-center gap-4 mt-4">
                {["VISA", "MC", "TROY"].map(c => (
                  <span key={c} className="text-[10px] font-bold bg-navy-50 text-navy-400 px-2 py-1 rounded border border-navy-100">{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
