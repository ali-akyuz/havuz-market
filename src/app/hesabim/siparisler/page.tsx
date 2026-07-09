"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/useAuth";
import { fetchApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { Package, Clock, CheckCircle2, XCircle } from "lucide-react";
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
  items: OrderItem[];
}

export default function MemberOrdersPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const loadOrders = async () => {
      try {
        const res = await fetchApi("/orders");
        if (res.success) setOrders(res.data);
        else setError(res.message || "Siparişleriniz alınamadı.");
      } catch (err: any) {
        setError(err.message || "Bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user, router]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DELIVERED": return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "CANCELLED": return <XCircle className="w-5 h-5 text-red-500" />;
      case "PROCESSING": return <Package className="w-5 h-5 text-turquoise-500" />;
      default: return <Clock className="w-5 h-5 text-orange-500" />;
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

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-black text-navy-900 mb-8">Siparişlerim</h1>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-6">{error}</div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-navy-100">
            <Package className="w-16 h-16 text-navy-200 mx-auto mb-4" />
            <p className="text-navy-600 mb-6">Henüz hiç siparişiniz bulunmuyor.</p>
            <Link href="/" className="inline-flex px-6 py-3 bg-turquoise-500 text-white rounded-xl font-semibold hover:bg-turquoise-600 transition-colors">
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-navy-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="border-b border-navy-50 bg-navy-50/50 p-4 sm:px-6 flex flex-wrap gap-4 items-center justify-between">
                  <div>
                    <p className="text-xs text-navy-500 font-medium mb-1">Sipariş Tarihi</p>
                    <p className="text-sm font-semibold text-navy-900">
                      {format(new Date(order.createdAt), "d MMMM yyyy HH:mm", { locale: tr })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-navy-500 font-medium mb-1">Sipariş No</p>
                    <p className="text-sm font-semibold text-navy-900">{order.orderCode}</p>
                  </div>
                  <div>
                    <p className="text-xs text-navy-500 font-medium mb-1">Toplam Tutar</p>
                    <p className="text-sm font-bold text-turquoise-600">{formatCurrency(order.totalKurus)}</p>
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-6">
                    {getStatusIcon(order.status)}
                    <span className="font-bold text-navy-900">{getStatusText(order.status)}</span>
                  </div>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b border-navy-50 last:border-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-navy-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Package className="w-5 h-5 text-navy-300" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-navy-900 line-clamp-1">{item.productName}</p>
                            <p className="text-xs text-navy-500">{item.quantity} adet</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-navy-900 flex-shrink-0">{formatCurrency(item.lineTotalKurus)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
