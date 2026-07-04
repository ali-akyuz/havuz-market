"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/store/useCart";
import { fetchApi } from "@/lib/api";

export default function OrderSuccessPage() {
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [statusLabel, setStatusLabel] = useState("Hazırlanıyor");
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const { clearCart } = useCartStore();

  useEffect(() => {
    const loadOrder = async () => {
      setMounted(true);

      let storedId = sessionStorage.getItem("lastOrderId");
      if (!storedId) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let code = "";
        for (let i = 0; i < 8; i++) {
          code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        storedId = `HM-${code}`;
        sessionStorage.setItem("lastOrderId", storedId);
      }

      setOrderNumber(storedId);

      try {
        const res = await fetchApi(`/orders/${encodeURIComponent(storedId)}`);
        if (res.success) {
          setOrderNumber(res.data.orderCode);
          if (res.data.status === "PENDING") {
            setStatusLabel("Hazırlanıyor");
          } else if (res.data.status === "PROCESSING") {
            setStatusLabel("İşleniyor");
          } else {
            setStatusLabel("Tamamlandı");
          }
          clearCart();
        }
      } catch {
        setStatusLabel("Bilgi alınamadı");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [clearCart]);

  if (!mounted) return null;

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-20">
      <div className="max-w-lg w-full mx-auto px-4 text-center">
        {/* Success icon */}
        <div className="relative inline-flex mb-8">
          <div className="w-24 h-24 rounded-3xl bg-green-50 flex items-center justify-center border-2 border-green-100">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-turquoise-500 rounded-xl flex items-center justify-center">
            <span className="text-white text-sm">✓</span>
          </div>
        </div>

        <h1 className="text-3xl font-black text-navy-900 mb-3">Siparişiniz Alındı</h1>
        <p className="text-navy-500 text-lg mb-8 leading-relaxed">
          {loading
            ? "Sipariş bilgileri getiriliyor..."
            : "Siparişiniz başarıyla oluşturuldu. Siparişiniz en kısa sürede hazırlanacaktır."}
        </p>

        {/* Order details card */}
        <div className="bg-white rounded-2xl border border-navy-100 p-6 text-left mb-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center">
              <Package className="w-5 h-5 text-navy-600" />
            </div>
            <div>
              <p className="text-xs text-navy-500 font-medium">Sipariş Kodu</p>
              <p className="font-black text-navy-900 text-lg">{orderNumber}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-navy-100">
            {[
              { label: "Tahmini Teslimat", value: "2-4 İş Günü" },
              { label: "Kargo Firması", value: "Yurtiçi Kargo" },
              { label: "Ödeme Durumu", value: "✓ Onaylandı" },
              { label: "Sipariş Durumu", value: statusLabel },
            ].map(({ label, value }) => (
              <div key={label} className="bg-navy-50 rounded-xl p-3">
                <p className="text-xs text-navy-500 mb-0.5">{label}</p>
                <p className="text-sm font-bold text-navy-900">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-navy-500 mb-8">
          Sipariş detayları ve kargo takip numarası e-posta adresinize gönderildi.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-turquoise-500 hover:bg-turquoise-600 text-white font-bold py-4 rounded-2xl transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            Alışverişe Devam Et
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
