"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, Settings } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { ProductFormModal } from "@/components/admin/ProductFormModal";
import Link from "next/link";
import { Category } from "@/services/types";

export default function AdminPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetchApi("/products"),
        fetchApi("/categories"),
      ]);
      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateOrUpdate = async (data: any) => {
    const isUpdate = !!data.id;
    const url = isUpdate ? `/products/${data.id}` : `/products`;
    const method = isUpdate ? "PUT" : "POST";

    const res = await fetchApi(url, {
      method,
      body: JSON.stringify(data),
    });

    if (!res.success) {
      throw new Error(res.message || "İşlem başarısız.");
    }
    await loadData(); // Yeniden yükle
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" adlı ürünü silmek istediğinize emin misiniz?`)) return;
    
    try {
      const res = await fetchApi(`/products/${id}`, { method: "DELETE" });
      if (res.success) {
        setProducts(p => p.filter(prod => prod.id !== id));
      } else {
        alert(res.message || "Silinemedi.");
      }
    } catch (error) {
      console.error(error);
      alert("Hata oluştu.");
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-navy-900 text-white p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <Settings className="w-5 h-5 text-turquoise-400" />
            </Link>
            <div>
              <h1 className="text-2xl font-black">Yönetim Paneli</h1>
              <p className="text-navy-300 text-sm">Ürünleri yönetin ve stokları güncelleyin</p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-turquoise-500 hover:bg-turquoise-600 text-white px-4 py-2.5 rounded-xl font-bold transition-colors"
          >
            <Plus className="w-5 h-5" />
            Yeni Ürün
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Search */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-navy-100 mb-6 flex items-center">
          <Search className="w-5 h-5 text-navy-400 mr-3" />
          <input
            type="text"
            placeholder="Ürün adı ile ara..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-10 text-sm outline-none bg-transparent text-navy-900"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-navy-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-navy-50 text-navy-600 text-sm border-b border-navy-100">
                  <th className="px-6 py-4 font-semibold">Ürün Adı</th>
                  <th className="px-6 py-4 font-semibold">Kategori</th>
                  <th className="px-6 py-4 font-semibold">Fiyat</th>
                  <th className="px-6 py-4 font-semibold">Stok</th>
                  <th className="px-6 py-4 font-semibold">Durum</th>
                  <th className="px-6 py-4 font-semibold text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-navy-500">
                      Yükleniyor...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-navy-500">
                      Ürün bulunamadı.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map(product => (
                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white border border-navy-100 overflow-hidden shrink-0 flex items-center justify-center">
                            {product.imageUrls?.[0] ? (
                              <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-contain p-1" />
                            ) : (
                              <span className="text-navy-300 text-xs">Yok</span>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-navy-900 text-sm">{product.name}</p>
                            <p className="text-xs text-navy-400">{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-navy-700">
                        {product.category?.name || "Bilinmiyor"}
                      </td>
                      <td className="px-6 py-4 font-bold text-turquoise-600 text-sm">
                        {formatCurrency(product.priceKurus / 100)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          product.stock > 10 ? 'bg-green-100 text-green-700' :
                          product.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {product.stock} Adet
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {product.isActive ? (
                          <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500" /> Yayında
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-navy-400 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-navy-300" /> Pasif
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setIsModalOpen(true);
                          }}
                          className="inline-flex p-2 rounded-lg bg-navy-50 text-navy-600 hover:bg-turquoise-50 hover:text-turquoise-600 transition-colors"
                          title="Düzenle"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="inline-flex p-2 rounded-lg bg-navy-50 text-navy-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
        categories={categories}
        onSubmit={handleCreateOrUpdate}
      />
    </div>
  );
}
