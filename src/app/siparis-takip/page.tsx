"use client";

import { useState } from "react";
import { fetchApi } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { Package, Search, ArrowRight, CheckCircle2, Clock, XCircle, Mail, Hash } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  lineTotalKurus: number;
}

interface Order {
  id: string;
  orderCode: string;
  status: string;
  totalKurus: number;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
}

export default function GuestOrderTrackingPage() {
  const [orderCode, setOrderCode] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetchApi("/orders/guest-lookup", {
        method: "POST",
        body: JSON.stringify({ orderCode, email }),
      });

      if (res.success && res.data) {
        setOrder(res.data);
      } else {
        setError(res.message || "Sipariş bulunamadı.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Sipariş aranırken bir hata oluştu.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DELIVERED": return <CheckCircle2 className="w-6 h-6 text-green-500" />;
      case "CANCELLED": return <XCircle className="w-6 h-6 text-red-500" />;
      case "PROCESSING": return <Package className="w-6 h-6 text-turquoise-500" />;
      default: return <Clock className="w-6 h-6 text-orange-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING": return "Ödeme Bekleniyor";
      case "PROCESSING": return "Hazırlanıyor";
      case "DELIVERED": return "Teslim Edildi";
      case "CANCELLED": return "İptal Edildi";
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-turquoise-100 rounded-2xl flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-turquoise-600" />
          </div>
          <h1 className="text-3xl font-black text-navy-900 tracking-tight">Misafir Sipariş Takibi</h1>
          <p className="mt-2 text-navy-600 max-w-xl mx-auto">
            Siparişinizi oluştururken kullandığınız e-posta adresini ve sipariş numaranızı girerek güncel durumu öğrenebilirsiniz.
          </p>
        </div>

        <div className="bg-white py-8 px-4 sm:px-10 shadow-xl shadow-navy-900/5 rounded-2xl border border-navy-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="orderCode" className="block text-sm font-semibold leading-6 text-navy-900">
                  Sipariş No (Örn: HM-A1B2C3D4)
                </label>
                <div className="relative mt-2 rounded-xl shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <Hash className="h-5 w-5 text-navy-400" aria-hidden="true" />
                  </div>
                  <input
                    id="orderCode"
                    type="text"
                    required
                    value={orderCode}
                    onChange={(e) => setOrderCode(e.target.value)}
                    className="block w-full rounded-xl border-0 py-3.5 pl-11 pr-4 text-navy-900 ring-1 ring-inset ring-navy-200 focus:ring-2 focus:ring-inset focus:ring-turquoise-500 sm:text-sm sm:leading-6 transition-all"
                    placeholder="HM-"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold leading-6 text-navy-900">
                  E-posta Adresi
                </label>
                <div className="relative mt-2 rounded-xl shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <Mail className="h-5 w-5 text-navy-400" aria-hidden="true" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-xl border-0 py-3.5 pl-11 pr-4 text-navy-900 ring-1 ring-inset ring-navy-200 focus:ring-2 focus:ring-inset focus:ring-turquoise-500 sm:text-sm sm:leading-6 transition-all"
                    placeholder="ornek@email.com"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-turquoise-500 px-3 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-turquoise-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turquoise-600 transition-all hover:shadow-lg hover:shadow-turquoise-500/30 disabled:opacity-70"
              >
                {loading ? "Sorgulanıyor..." : "Siparişi Sorgula"}
              </button>
            </div>
          </form>
        </div>

        {order && (
          <div className="bg-white border border-navy-100 rounded-2xl overflow-hidden shadow-xl shadow-navy-900/5 animate-in slide-in-from-bottom-4 duration-500 fade-in">
            <div className="bg-navy-50/50 p-6 flex flex-wrap gap-4 items-center justify-between border-b border-navy-100">
              <div>
                <p className="text-xs text-navy-500 font-medium mb-1">Sipariş Tarihi</p>
                <p className="text-sm font-semibold text-navy-900">
                  {format(new Date(order.createdAt), "d MMMM yyyy HH:mm", { locale: tr })}
                </p>
              </div>
              <div>
                <p className="text-xs text-navy-500 font-medium mb-1">Müşteri</p>
                <p className="text-sm font-semibold text-navy-900">{order.customerName}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-navy-500 font-medium mb-1">Toplam Tutar</p>
                <p className="text-lg font-black text-turquoise-600">{formatCurrency(order.totalKurus)}</p>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-8 p-4 bg-navy-50 rounded-xl border border-navy-100">
                {getStatusIcon(order.status)}
                <div>
                  <p className="text-xs text-navy-500 font-medium">Sipariş Durumu</p>
                  <p className="text-lg font-bold text-navy-900">{getStatusText(order.status)}</p>
                </div>
              </div>
              
              <h3 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-navy-400" />
                Sipariş İçeriği
              </h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-3 border-b border-navy-50 last:border-0 last:pb-0">
                    <div className="flex-1 pr-4">
                      <p className="text-sm font-semibold text-navy-900 leading-tight mb-1">{item.productName}</p>
                      <p className="text-xs text-navy-500">{item.quantity} adet x {formatCurrency(item.lineTotalKurus / item.quantity)}</p>
                    </div>
                    <span className="text-sm font-bold text-navy-900">{formatCurrency(item.lineTotalKurus)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
