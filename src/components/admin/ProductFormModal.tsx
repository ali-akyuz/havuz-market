"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Category } from "@/services/types";

interface ProductFormData {
  id?: string;
  name: string;
  slug: string;
  description: string;
  priceKurus: number;
  stock: number;
  categoryId: string;
  isActive: boolean;
  isFeatured: boolean;
  imageUrls: string[];
}

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: ProductFormData;
  categories: Category[];
  onSubmit: (data: ProductFormData) => Promise<void>;
}

export function ProductFormModal({ isOpen, onClose, product, categories, onSubmit }: ProductFormModalProps) {
  const [form, setForm] = useState<ProductFormData>({
    name: "",
    slug: "",
    description: "",
    priceKurus: 0,
    stock: 0,
    categoryId: "",
    isActive: true,
    isFeatured: false,
    imageUrls: [],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setForm(product);
    } else {
      setForm({
        name: "",
        slug: "",
        description: "",
        priceKurus: 0,
        stock: 0,
        categoryId: categories.length > 0 ? categories[0].id : "",
        isActive: true,
        isFeatured: false,
        imageUrls: [],
      });
    }
  }, [product, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const update = (field: keyof ProductFormData, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-navy-100">
          <h2 className="text-xl font-bold text-navy-900">
            {product ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-navy-50 text-navy-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="productForm" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-1.5">Ürün Adı</label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={e => update("name", e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-navy-200 text-sm focus:outline-none focus:border-turquoise-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-1.5">Kategori</label>
                <select
                  required
                  value={form.categoryId}
                  onChange={e => update("categoryId", e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-navy-200 text-sm focus:outline-none focus:border-turquoise-400"
                >
                  <option value="" disabled>Seçiniz</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-1.5">Slug (URL)</label>
                <input
                  required
                  type="text"
                  value={form.slug}
                  onChange={e => update("slug", e.target.value)}
                  placeholder="ornek-urun-slug"
                  className="w-full h-11 px-4 rounded-xl border border-navy-200 text-sm focus:outline-none focus:border-turquoise-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-1.5">Fiyat (Kuruş)</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={form.priceKurus}
                    onChange={e => update("priceKurus", parseInt(e.target.value) || 0)}
                    className="w-full h-11 px-4 rounded-xl border border-navy-200 text-sm focus:outline-none focus:border-turquoise-400"
                  />
                  <span className="text-xs text-navy-400 block mt-1">Örn: 150000 = 1500.00 TL</span>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-1.5">Stok</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={e => update("stock", parseInt(e.target.value) || 0)}
                    className="w-full h-11 px-4 rounded-xl border border-navy-200 text-sm focus:outline-none focus:border-turquoise-400"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-1.5">Açıklama</label>
              <textarea
                value={form.description}
                onChange={e => update("description", e.target.value)}
                rows={4}
                className="w-full p-4 rounded-xl border border-navy-200 text-sm focus:outline-none focus:border-turquoise-400 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-1.5">Görsel URL'leri (Virgülle ayırın)</label>
              <input
                type="text"
                value={form.imageUrls.join(", ")}
                onChange={e => {
                  const urls = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                  update("imageUrls", urls);
                }}
                placeholder="/images/products/robot.jpg, /images/products/pump.jpg"
                className="w-full h-11 px-4 rounded-xl border border-navy-200 text-sm focus:outline-none focus:border-turquoise-400"
              />
            </div>

            <div className="flex items-center gap-6 p-4 bg-navy-50 rounded-xl">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={e => update("isFeatured", e.target.checked)}
                  className="w-4 h-4 rounded border-navy-300 text-turquoise-500 focus:ring-turquoise-400"
                />
                <span className="text-sm font-semibold text-navy-900">Öne Çıkan (Kampanyalı)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={e => update("isActive", e.target.checked)}
                  className="w-4 h-4 rounded border-navy-300 text-turquoise-500 focus:ring-turquoise-400"
                />
                <span className="text-sm font-semibold text-navy-900">Aktif (Yayında)</span>
              </label>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-navy-100 flex items-center justify-end gap-3 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-semibold text-navy-600 hover:bg-navy-100 transition-colors"
          >
            İptal
          </button>
          <button
            type="submit"
            form="productForm"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl font-bold bg-turquoise-500 hover:bg-turquoise-600 text-white transition-colors disabled:opacity-50"
          >
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}
