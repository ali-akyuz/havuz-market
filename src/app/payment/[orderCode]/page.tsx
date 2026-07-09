"use client";

/**
 * /payment/[orderCode] — Odeme Sayfasi
 *
 * PAYMENT_MODE=mock  → Demo odeme ekrani (iki buton: basarili / basarisiz)
 * PAYMENT_MODE=paytr → Gercek PayTR iFrame
 *
 * Mod bilgisi frontend'e GET /api/payment/config ile gonderilir.
 * PayTR credentials veya secretlar frontend'e hicbir sekilde expose edilmez.
 */

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Script from "next/script";
import {
  Lock, AlertCircle, RefreshCw, ShoppingBag,
  CheckCircle2, XCircle, Package, CreditCard,
} from "lucide-react";
import Link from "next/link";
import { fetchApi } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

type PaymentMode = "mock" | "paytr";
type PageState   = "loading" | "ready" | "error" | "already_paid";

interface OrderInfo {
  orderCode: string;
  totalKurus: number;
  customerName: string;
  items: { productName: string; quantity: number; lineTotalKurus: number }[];
}

// ─── Yardimci: config endpoint'inden modu cek ───────────────────────────────
async function fetchPaymentMode(): Promise<PaymentMode> {
  try {
    const res = await fetchApi("/payment/config");
    return res.mode === "paytr" ? "paytr" : "mock";
  } catch {
    return "mock"; // Hata durumunda guvenlice mock'a don
  }
}

// ─── Mock Odeme Ekrani ────────────────────────────────────────────────────────
function MockPaymentScreen({
  orderCode,
  order,
}: {
  orderCode: string;
  order: OrderInfo | null;
}) {
  const router  = useRouter();
  const [busy, setBusy] = useState<"success" | "fail" | null>(null);
  const [error, setError] = useState("");

  const simulate = async (result: "success" | "fail") => {
    setBusy(result);
    setError("");
    try {
      const endpoint = result === "success"
        ? "/payments/mock/success"
        : "/payments/mock/fail";

      const res = await fetchApi(endpoint, {
        method: "POST",
        body: JSON.stringify({ orderCode }),
      });

      if (res.success) {
        router.push(
          result === "success"
            ? `/payment/success?orderCode=${orderCode}`
            : `/payment/fail?orderCode=${orderCode}`
        );
      } else {
        setError(res.message || "Islem basarisiz.");
        setBusy(null);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Bir hata olustu.");
      setBusy(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-lg mx-auto px-4">
        {/* Demo mod banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
          <span className="text-amber-500 text-lg">🧪</span>
          <div>
            <p className="text-sm font-bold text-amber-800">Demo / Gelistirme Modu</p>
            <p className="text-xs text-amber-700">
              Gercek odeme alınmaz. Mock butonlarla akisi test edebilirsiniz.
            </p>
          </div>
        </div>

        {/* Baslik */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-navy-900">Demo Odeme</h1>
            <p className="text-sm text-navy-500 mt-0.5">
              Siparis: <span className="font-semibold text-turquoise-600">{orderCode}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-xl border border-amber-200">
            <CreditCard className="w-4 h-4" />
            <span className="font-semibold hidden sm:block">MOCK MODE</span>
          </div>
        </div>

        {/* Siparis ozeti */}
        {order && (
          <div className="bg-white rounded-2xl border border-navy-100 p-5 mb-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-navy-50 flex items-center justify-center">
                <Package className="w-4 h-4 text-navy-600" />
              </div>
              <div>
                <p className="text-xs text-navy-500">Musteri</p>
                <p className="font-bold text-navy-900">{order.customerName}</p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm text-navy-600">
                  <span className="truncate mr-4">{item.productName} × {item.quantity}</span>
                  <span className="font-semibold flex-shrink-0">{formatCurrency(item.lineTotalKurus / 100)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-navy-100">
              <span className="font-black text-navy-900">Toplam</span>
              <span className="text-xl font-black text-turquoise-600">
                {formatCurrency(order.totalKurus / 100)}
              </span>
            </div>
          </div>
        )}

        {/* Hata mesaji */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4 text-sm text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Aksiyon butonlari */}
        <div className="space-y-3">
          <button
            onClick={() => simulate("success")}
            disabled={busy !== null}
            className="w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-bold py-4 rounded-2xl transition-all hover:shadow-lg hover:shadow-green-500/20 text-sm"
          >
            {busy === "success" ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
            Basarili Odemeyi Simule Et
          </button>

          <button
            onClick={() => simulate("fail")}
            disabled={busy !== null}
            className="w-full flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-bold py-4 rounded-2xl transition-all hover:shadow-lg hover:shadow-red-500/20 text-sm"
          >
            {busy === "fail" ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            Basarisiz Odemeyi Simule Et
          </button>

          <Link
            href="/sepet"
            className="w-full flex items-center justify-center gap-2 text-navy-500 hover:text-navy-700 text-sm font-medium py-3 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Sepete Don
          </Link>
        </div>

        <p className="text-xs text-navy-400 text-center mt-6">
          Bu ekran sadece gelistirme/demo modunda goruntulenir.
          Gercek odeme icin <strong>PAYMENT_MODE=paytr</strong> ve PayTR credentials gereklidir.
        </p>
      </div>
    </div>
  );
}

// ─── Ana Sayfa ────────────────────────────────────────────────────────────────
export default function PaymentPage() {
  const params    = useParams<{ orderCode: string }>();
  const orderCode = params.orderCode;

  const [mode, setMode]         = useState<PaymentMode | null>(null);
  const [state, setState]       = useState<PageState>("loading");
  const [iframeUrl, setIframeUrl] = useState<string>("");
  const [order, setOrder]       = useState<OrderInfo | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Siparis bilgisini her iki modda da cek (mock ekraninda ozet gostermek icin)
  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetchApi("/orders/" + encodeURIComponent(orderCode));
      if (res.success) setOrder(res.data as OrderInfo);
    } catch {
      // Sessizce gec; siparis ozeti olmasa da devam edilebilir
    }
  }, [orderCode]);

  // PayTR token cek (sadece paytr modunda)
  const fetchToken = useCallback(async () => {
    setState("loading");
    setErrorMsg("");
    try {
      const res = await fetchApi("/paytr/token", {
        method: "POST",
        body: JSON.stringify({ orderCode }),
      });
      if (res.success && res.data?.iframeUrl) {
        setIframeUrl(res.data.iframeUrl);
        setState("ready");
      } else {
        setErrorMsg(res.message || "Token alinamadi.");
        setState("error");
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("zaten odendi")) {
        setState("already_paid");
      } else {
        setErrorMsg(err instanceof Error ? err.message : "Odeme baslatilirken hata olustu.");
        setState("error");
      }
    }
  }, [orderCode]);

  // Ilk yuklemede: modu al, siparis bilgisini al
  useEffect(() => {
    if (!orderCode) return;
    (async () => {
      const detectedMode = await fetchPaymentMode();
      setMode(detectedMode);
      await fetchOrder();
      if (detectedMode === "paytr") await fetchToken();
      else setState("ready"); // mock modda baska state gerekmiyor
    })();
  }, [orderCode, fetchOrder, fetchToken]);

  // ─── MOCK MOD ───────────────────────────────────────────────────────────────
  if (mode === "mock" && state === "ready") {
    return <MockPaymentScreen orderCode={orderCode} order={order} />;
  }

  // ─── PAYTR — Yukleniyor ────────────────────────────────────────────────────
  if (mode === null || state === "loading") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 bg-slate-50">
        <div className="w-12 h-12 border-4 border-turquoise-200 border-t-turquoise-500 rounded-full animate-spin" />
        <p className="text-navy-600 font-semibold">Guvenli odeme sayfasi hazirlaniyor...</p>
        <p className="text-navy-400 text-sm">Lutfen bekleyin</p>
      </div>
    );
  }

  // ─── PAYTR — Zaten odendi ─────────────────────────────────────────────────
  if (state === "already_paid") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-navy-100 p-8 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4 border border-green-100">
            <Lock className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-black text-navy-900 mb-2">Odeme Tamamlandi</h1>
          <p className="text-navy-500 mb-6">Bu siparis zaten odendi.</p>
          <Link
            href={"/payment/success?orderCode=" + orderCode}
            className="inline-flex items-center gap-2 bg-turquoise-500 hover:bg-turquoise-600 text-white font-bold py-3 px-6 rounded-xl transition-all"
          >
            Siparis Detayina Git
          </Link>
        </div>
      </div>
    );
  }

  // ─── PAYTR — Hata ─────────────────────────────────────────────────────────
  if (state === "error") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-red-100 p-8 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4 border border-red-100">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-black text-navy-900 mb-2">Odeme Baslatilirken Hata</h1>
          <p className="text-navy-500 mb-2 text-sm">{errorMsg}</p>
          <p className="text-navy-400 text-xs mb-6">Siparis kodunuz: <strong>{orderCode}</strong></p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={fetchToken}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-turquoise-500 hover:bg-turquoise-600 text-white font-bold py-3 px-6 rounded-xl transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Tekrar Dene
            </button>
            <Link
              href="/sepet"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-navy-50 hover:bg-navy-100 text-navy-700 font-bold py-3 px-6 rounded-xl transition-all border border-navy-100"
            >
              <ShoppingBag className="w-4 h-4" />
              Sepete Don
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── PAYTR — iFrame hazir ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-navy-900">Guvenli Odeme</h1>
            <p className="text-sm text-navy-500 mt-0.5">
              Siparis: <span className="font-semibold text-turquoise-600">{orderCode}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-xl border border-green-100">
            <Lock className="w-4 h-4" />
            <span className="font-semibold hidden sm:block">256-bit SSL</span>
          </div>
        </div>

        <div className="bg-white border border-navy-100 rounded-xl px-4 py-3 mb-5 flex items-center gap-3">
          <Lock className="w-4 h-4 text-turquoise-500 flex-shrink-0" />
          <p className="text-xs text-navy-500">
            Kart bilgileriniz <strong>PayTR guvenli altyapisi</strong> uzerinden islenir.
            Kart numaraniz, CVV veya son kullanma tarihiniz sitemizde saklanmaz.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-navy-100 overflow-hidden shadow-sm">
          <iframe
            id="paytriframe"
            src={iframeUrl}
            frameBorder="0"
            scrolling="no"
            style={{ width: "100%", minHeight: 500 }}
          />
        </div>

        <Script
          src="https://www.paytr.com/js/iframeResizer.min.js"
          strategy="afterInteractive"
          onLoad={() => {
            if (typeof window !== "undefined") {
              const w = window as unknown as Record<string, unknown>;
              if (typeof w.iFrameResize === "function") {
                (w.iFrameResize as (o: object, s: string) => void)(
                  { log: false, checkOrigin: false },
                  "#paytriframe"
                );
              }
            }
          }}
        />
      </div>
    </div>
  );
}