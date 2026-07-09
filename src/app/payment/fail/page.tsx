"use client";

/**
 * /payment/fail?orderCode=... — Odeme Basarisiz Sayfasi
 *
 * PayTR odeme basarisiz oldugunda kullaniciyi bu URL'ye yonlendirir.
 */

import { useSearchParams } from "next/navigation";
import { XCircle, RefreshCw, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function PaymentFailContent() {
  const searchParams = useSearchParams();
  const orderCode    = searchParams.get("orderCode") ?? "";

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-20 px-4">
      <div className="max-w-lg w-full mx-auto text-center">
        {/* Icon */}
        <div className="relative inline-flex mb-8">
          <div className="w-24 h-24 rounded-3xl bg-red-50 flex items-center justify-center border-2 border-red-100">
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-navy-900 mb-3">Odeme Basarisiz</h1>
        <p className="text-navy-500 text-lg mb-2 leading-relaxed">
          Odemeniz gerceklestirilemedi. Kart bilgilerinizi kontrol ederek tekrar deneyebilirsiniz.
        </p>
        <p className="text-navy-400 text-sm mb-8">
          Siparisiniz iptal edilmedi; ayni siparis koduyla yeniden odeme yapabilirsiniz.
        </p>

        {/* Order code card */}
        {orderCode && (
          <div className="bg-white rounded-2xl border border-navy-100 p-5 mb-8 shadow-sm">
            <p className="text-xs text-navy-500 mb-1">Siparis Kodu</p>
            <p className="font-black text-navy-900 text-xl">{orderCode}</p>
            <p className="text-xs text-navy-400 mt-2">Bu kodu saklayın; destek ekibimizle bu kod uzerinden iletisim kurabilirsiniz.</p>
          </div>
        )}

        {/* Olasi neden listesi */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-left mb-8">
          <p className="text-sm font-bold text-amber-800 mb-2">Olasilikla neden basarisiz oldu?</p>
          <ul className="space-y-1 text-xs text-amber-700 list-disc list-inside">
            <li>Kart limiti yetersiz olabilir</li>
            <li>Kart bilgileri yanlis girilmis olabilir</li>
            <li>3D Secure dogrulamasi basarisiz</li>
            <li>Bankaniz islemi onaylamadi</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Tekrar odeme dene — ayni siparis koduyla */}
          {orderCode && (
            <Link
              href={"/payment/" + orderCode}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-turquoise-500 hover:bg-turquoise-600 text-white font-bold py-4 rounded-2xl transition-all hover:shadow-lg text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Tekrar Odeme Dene
            </Link>
          )}
          <Link
            href="/sepet"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-navy-50 hover:bg-navy-100 text-navy-700 font-bold py-4 rounded-2xl transition-all border border-navy-100 text-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            Sepete Don
          </Link>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-navy-400 hover:text-turquoise-500 transition-colors mt-6"
        >
          Ana Sayfaya Don
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-turquoise-200 border-t-turquoise-500 rounded-full animate-spin" />
      </div>
    }>
      <PaymentFailContent />
    </Suspense>
  );
}