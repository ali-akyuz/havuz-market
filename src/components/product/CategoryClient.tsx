"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/services/types";
import { ProductCard } from "@/components/product/ProductCard";
import { SlidersHorizontal, ChevronDown, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryClientProps {
  category: {
    id: string;
    slug: string;
    name: string;
    description: string;
    image: string;
    subcategories: { id: string; slug: string; name: string }[];
  };
  products: Product[];
}

const sortOptions = [
  { value: "smart", label: "Akıllı Sıralama" },
  { value: "price_asc", label: "Fiyat: Düşükten Yükseğe" },
  { value: "price_desc", label: "Fiyat: Yüksekten Düşüğe" },
  { value: "rating", label: "En Yüksek Puan" },
  { value: "newest", label: "Yeni Ürünler" },
];

export function CategoryClient({ category, products }: CategoryClientProps) {
  const searchParams = useSearchParams();
  const [filtered, setFiltered] = useState(products);
  const [sortBy, setSortBy] = useState("smart");
  const [activeSubcat, setActiveSubcat] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchLocal, setSearchLocal] = useState("");

  useEffect(() => {
    let result = [...products];

    // Arama sonuçları Türkçe karakter uyumlu olacak şekilde filtrelenir
    const q = searchParams.get("q") || searchLocal;
    if (q) {
      result = result.filter(p =>
        p.title.toLowerCase().includes(q.toLowerCase()) ||
        p.brand.toLowerCase().includes(q.toLowerCase())
      );
    }

    // Alt kategori filtrelemesi
    if (activeSubcat) {
      result = result.filter(p => p.subcategory === activeSubcat);
    }

    // Fiyat aralığına göre (Min-Max) filtreleme
    if (minPrice) result = result.filter(p => p.price >= Number(minPrice));
    if (maxPrice) result = result.filter(p => p.price <= Number(maxPrice));

    // Sorting
    switch (sortBy) {
      case "price_asc": result.sort((a, b) => a.price - b.price); break;
      case "price_desc": result.sort((a, b) => b.price - a.price); break;
      case "rating": result.sort((a, b) => Number(b.rating) - Number(a.rating)); break;
      case "newest": result.sort((a, b) => (b.badges.includes("Yeni Ürün") ? 1 : -1)); break;
    }

    // Filtreleme sonuçlarını state'e aktararak UI'ın güncellenmesini sağlar
    setTimeout(() => setFiltered(result), 0);
  }, [products, activeSubcat, minPrice, maxPrice, sortBy, searchParams, searchLocal]);

  const clearFilters = () => {
    setActiveSubcat(null);
    setMinPrice("");
    setMaxPrice("");
    setSearchLocal("");
    setSortBy("smart");
  };

  const hasFilters = activeSubcat || minPrice || maxPrice || searchLocal;

  const renderFilterSidebar = () => (
    <div className="space-y-6">
      {/* Local Search */}
      <div>
        <h3 className="text-sm font-bold text-navy-900 mb-3">Ürün Ara</h3>
        <div className="relative">
          <input
            type="search"
            placeholder="Bu kategoride ara..."
            value={searchLocal}
            onChange={(e) => setSearchLocal(e.target.value)}
            className="w-full h-10 pl-4 pr-10 rounded-xl border border-navy-200 bg-white text-sm focus:outline-none focus:border-turquoise-400 transition-colors"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
        </div>
      </div>

      {/* Subcategories */}
      <div>
        <h3 className="text-sm font-bold text-navy-900 mb-3">Alt Kategoriler</h3>
        <div className="space-y-1">
          <button
            onClick={() => setActiveSubcat(null)}
            className={cn(
              "w-full text-left px-3 py-2 rounded-xl text-sm transition-colors",
              !activeSubcat ? "bg-turquoise-50 text-turquoise-700 font-semibold" : "text-navy-600 hover:bg-navy-50"
            )}
          >
            Tüm Ürünler ({products.length})
          </button>
          {category.subcategories.map((sub) => {
            const count = products.filter(p => p.subcategory === sub.id).length;
            return (
              <button
                key={sub.id}
                onClick={() => setActiveSubcat(sub.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-xl text-sm transition-colors flex justify-between",
                  activeSubcat === sub.id ? "bg-turquoise-50 text-turquoise-700 font-semibold" : "text-navy-600 hover:bg-navy-50"
                )}
              >
                <span>{sub.name}</span>
                <span className="text-navy-400 text-xs">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-bold text-navy-900 mb-3">Fiyat Aralığı</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min ₺"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-navy-200 text-sm focus:outline-none focus:border-turquoise-400"
          />
          <span className="text-navy-400">–</span>
          <input
            type="number"
            placeholder="Max ₺"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-navy-200 text-sm focus:outline-none focus:border-turquoise-400"
          />
        </div>
      </div>

      {/* Badges filter */}
      <div>
        <h3 className="text-sm font-bold text-navy-900 mb-3">Özellikler</h3>
        <div className="space-y-2">
          {["Çok Satan", "Kampanya", "Yeni Ürün"].map((badge) => (
            <label key={badge} className="flex items-center gap-2 cursor-pointer text-sm text-navy-700">
              <input type="checkbox" className="rounded border-navy-300 text-turquoise-500 focus:ring-turquoise-400" />
              {badge}
            </label>
          ))}
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-200 text-red-500 text-sm hover:bg-red-50 transition-colors"
        >
          <X className="w-4 h-4" />
          Filtreleri Temizle
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Category Header */}
      <div className="bg-gradient-to-br from-navy-900 to-navy-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16 flex items-center gap-8">
          <div className="flex-1">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-navy-400 mb-4">
              <Link href="/" className="hover:text-turquoise-300 transition-colors">Ana Sayfa</Link>
              <span>/</span>
              <span className="text-navy-200">{category.name}</span>
            </div>
            <h1 className="text-3xl lg:text-5xl font-black mb-3">{category.name}</h1>
            <p className="text-navy-300 text-lg">{category.description}</p>
          </div>
          <div className="hidden lg:block relative w-40 h-40 opacity-80">
            <Image src={category.image} alt={category.name} fill className="object-contain" sizes="160px" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Top bar: count + sort + filter toggle */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <p className="text-sm text-navy-600">
            <span className="font-bold text-navy-900">{filtered.length}</span> ürün bulundu
          </p>
          <div className="flex items-center gap-3">
            {/* Mobile filter button */}
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-navy-200 text-sm font-semibold text-navy-700"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtrele
              {hasFilters && <span className="w-2 h-2 rounded-full bg-turquoise-500" />}
            </button>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-9 py-2 rounded-xl bg-white border border-navy-200 text-sm font-medium text-navy-700 focus:outline-none focus:border-turquoise-400 cursor-pointer"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-navy-100 p-6 sticky top-24">
              {renderFilterSidebar()}
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          {filterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-navy-950/60" onClick={() => setFilterOpen(false)} />
              <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-navy-900">Filtreler</h2>
                  <button onClick={() => setFilterOpen(false)}>
                    <X className="w-5 h-5 text-navy-500" />
                  </button>
                </div>
                {renderFilterSidebar()}
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-grow">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-navy-100 p-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-navy-50 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-navy-300" />
                </div>
                <h3 className="font-bold text-navy-900 mb-2">Ürün Bulunamadı</h3>
                <p className="text-navy-500 text-sm mb-4">Filtrelerinize uygun ürün yok. Kriterleri değiştirmeyi deneyin.</p>
                <button onClick={clearFilters} className="text-turquoise-600 font-semibold text-sm hover:underline">
                  Tüm ürünleri göster
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
