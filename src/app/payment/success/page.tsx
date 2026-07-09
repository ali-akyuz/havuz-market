"use client";

/**
 * /payment/success?orderCode=... — Odeme Basarili Sayfasi
 *
 * PayTR odemeyi tamamladiktan sonra kullaniciyi bu URL'ye yonlendirir.
 * Callback, kullanici geldiginde henuz islenmemis olabilir,
 * bu yuzden siparis durumunu polling ile kontrol ederiz.
 */

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Package, Clock, ArrowRight, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/lib/store/useCart";
import { fetchApi } from "@/lib/api";

type VerifyState = "checking" | "paid" | "pending" | "error";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderCode    = searchParams.get("orderCode") ?? "";
  const { clearCart } = useCartStore();

  const [verifyState, setVerifyState] = useState<VerifyState>("checking");
  const [attempts, setAttempts]       = useState(0);
  const MAX_ATTEMPTS = 8;

  const checkOrder = useCallback(async () => {
    if (!orderCode) { setVerifyState("error"); return; }

    try {
      const res = await fetchApi("/orders/" + encodeURIComponent(orderCode));
      if (!res.success) { setVerifyState("error"); return; }

      const { paymentStatus, status } = res.data;

      if (paymentStatus === "PAID" || status === "PROCESSING" || status === "DELIVERED") {
        clearCart();
        setVerifyState("paid");
      } else if (paymentStatus === "FAILED" || status === "CANCELLED") {
        setVerifyState("error");
      } else {
        setVerifyState("pending");
      }
    } catch {
      setVerifyState("error");
    }
  }, [orderCode, clearCart]);

  // Ilk kontrol
  useEffect(() => {
    checkOrder();
  }, [checkOrder]);

  // Hala WAITING_PAYMENT ise 3 saniyede bir tekrar kontrol et (max 8 kez)
  useEffect(() => {
    if (verifyState !== "pending") return;
    if (attempts >= MAX_ATTEMPTS) return;

    const timer = setTimeout(() => {
      setAttempts((a) => a + 1);
      checkOrder();
    }, 3000);

    return () => clearTimeout(timer);
  }, [verifyState, attempts, checkOrder]);

  // --- Yukleniyor / Dogrulaniyor ---
  if (verifyState === "checking" || (verifyState === "pending" && attempts < MAX_ATTEMPTS)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-5 bg-slate-50 px-4">
        <div className="w-20 h-20 rounded-3xl bg-turquoise-50 flex items-center justify-center border-2 border-turquoise-100">
          <Clock className="w-10 h-10 text-turquoise-500 animate-pulse" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-black text-navy-900 mb-2">Odemeniz Dogrulaniyor</h1>
          <p className="text-navy-500 max-w-sm">
            Odeme bilgisi isleniyor, lutfen bekleyin. Bu islem birkaç saniye surebilir.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-navy-400">
          <div className="w-4 h-4 border-2 border-turquoise-200 border-t-turquoise-500 rounded-full animate-spin" />
          Kontrol ediliyor...
        </div>
        <p className="text-xs text-navy-400">Siparis: <strong>{orderCode}</strong></p>
      </div>
    );
  }

  // --- Basarili ---
  if (verifyState === "paid") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-20 px-4">
        <div className="max-w-lg w-full mx-auto text-center">
          <div className="relative inline-flex mb-8">
            <div className="w-24 h-24 rounded-3xl bg-green-50 flex items-center justify-center border-2 border-green-100">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-turquoise-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-sm font-bold">✓</span>
            </div>
          </div>

          <h1 className="text-3xl font-black text-navy-900 mb-3">Odemeniz Alindi!</h1>
          <p className="text-navy-500 text-lg mb-8 leading-relaxed">
            Siparişiniz başarıyla ödendi ve hazırlanmaya başlandı.
          </p>

          <div className="bg-white rounded-2xl border border-navy-100 p-6 text-left mb-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center">
                <Package className="w-5 h-5 text-navy-600" />
              </div>
              <div>
                <p className="text-xs text-navy-500 font-medium">Siparis Kodu</p>
                <p className="font-black text-navy-900 text-lg">{orderCode}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-navy-100">
              {[
                { label: "Odeme Durumu",      value: "Odendi" },
                { label: "Siparis Durumu",     value: "Hazirlanıyor" },
                { label: "Tahmini Teslimat",   value: "2-4 Is Gunu" },
                { label: "Kargo Firmasi",      value: "Yurtici Kargo" },
              ].map(({ label, value }) => (
                <div key={label} className="bg-navy-50 rounded-xl p-3">
                  <p className="text-xs text-navy-500 mb-0.5">{label}</p>
                  <p className="text-sm font-bold text-navy-900">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-turquoise-500 hover:bg-turquoise-600 text-white font-bold py-4 px-8 rounded-2xl transition-all hover:shadow-lg"
          >
            Alisverise Devam Et
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // --- Zaman asimi / Hata ---
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-navy-100 p-8 text-center shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-4 border border-amber-100">
          <Clock className="w-8 h-8 text-amber-500" />
        </div>
        <h1 className="text-2xl font-black text-navy-900 mb-2">Odeme Dogrulaniyor</h1>
        <p className="text-navy-500 text-sm mb-4">
          Odemeniz isleniyor. Siparis kodunuzu saklayın; onaylandığında e-posta alacaksınız.
        </p>
        <p className="text-navy-400 text-xs mb-6">Siparis Kodu: <strong>{orderCode}</strong></p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => { setAttempts(0); setVerifyState("pending"); }}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-turquoise-500 hover:bg-turquoise-600 text-white font-bold py-3 px-4 rounded-xl transition-all text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Tekrar Kontrol Et
          </button>
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-navy-50 hover:bg-navy-100 text-navy-700 font-bold py-3 px-4 rounded-xl transition-all border border-navy-100 text-sm"
          >
            Ana Sayfaya Don
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-5 bg-slate-50">
        <div className="w-20 h-20 rounded-3xl bg-turquoise-50 flex items-center justify-center border-2 border-turquoise-100">
          <Clock className="w-10 h-10 text-turquoise-500 animate-pulse" />
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}