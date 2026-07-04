"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Search, ShoppingCart, Heart, Menu, X, Waves, ChevronDown, Phone } from "lucide-react";
import { useCartStore } from "@/lib/store/useCart";
import { useFavoritesStore } from "@/lib/store/useFavorites";
import { useRouter, usePathname } from "next/navigation";
import { cn, formatCurrency } from "@/lib/utils";
import { siteConfig } from "@/lib/siteConfig";
import { searchProducts } from "@/actions/search";
import { Product } from "@/services/types";

const categories = [
  { slug: "havuz-robotlari", name: "Havuz Robotları", subs: ["Zemin Robotlar", "Duvar & Zemin", "Akıllı Sistemler"] },
  { slug: "havuz-kimyasallari", name: "Kimyasallar", subs: ["Klor Ürünleri", "pH Düzenleyici", "Yosun Önleyici"] },
  { slug: "havuz-pompalari", name: "Pompalar", subs: ["Santrifüj", "Değişken Hızlı", "Ticari"] },
  { slug: "havuz-aydinlatmalari", name: "Aydınlatma", subs: ["LED Lambalar", "Sıva Üstü", "Fiber Optik"] },
  { slug: "havuz-ekipmanlari", name: "Ekipmanlar", subs: ["Kum Filtreleri", "Merdivenler", "Temizlik Seti"] },
  { slug: "tuz-klor-jeneratorleri", name: "Tuz Klor", subs: ["Ev Tipi", "Ticari", "Otomasyon"] },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const [mounted, setMounted] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const cartItems = useCartStore((s) => s.items);
  const favItems = useFavoritesStore((s) => s.items);
  const dropdownTimer = useRef<NodeJS.Timeout | null>(null);
  const desktopSearchRef = useRef<HTMLFormElement>(null);
  const mobileSearchRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalItems = mounted ? cartItems.reduce((a, b) => a + b.quantity, 0) : 0;
  const favCount = mounted ? favItems.length : 0;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        (desktopSearchRef.current && desktopSearchRef.current.contains(target)) ||
        (mobileSearchRef.current && mobileSearchRef.current.contains(target))
      ) {
        return;
      }
      setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Yönlendirme (route) değiştiğinde dropdown'ı kapat ve aramayı temizle
  useEffect(() => {
    setTimeout(() => {
      setShowDropdown(false);
      setSearchQuery("");
    }, 0);
  }, [pathname]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setTimeout(() => {
        setSearchResults([]);
        setShowDropdown(false);
      }, 0);
      return;
    }

    // Kullanıcı yazmayı bitirdikten 300ms sonra arama yapılır (Debouncing)
    // Böylece her tuşa basıldığında gereksiz API/Arama isteği atılması önlenir
    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchProducts(searchQuery);
      setSearchResults(results);
      setShowDropdown(true);
      setSelectedIndex(-1);
      setIsSearching(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;
    
    const totalItemsCount = searchResults.length > 6 ? 7 : searchResults.length;
    
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev < totalItemsCount - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      if (searchResults.length > 6 && selectedIndex === 6) {
        router.push(`/arama?q=${encodeURIComponent(searchQuery)}`);
      } else {
        const product = searchResults[selectedIndex];
        if (product) router.push(`/urun/${product.slug}`);
      }
      setShowDropdown(false);
      setSearchQuery("");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/arama?q=${encodeURIComponent(searchQuery)}`);
      setShowDropdown(false);
    }
  };

  const handleMouseEnter = (slug: string) => {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current);
    setActiveDropdown(slug);
  };

  const handleMouseLeave = () => {
    dropdownTimer.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-navy-900 text-white text-xs py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-turquoise-400 animate-pulse" />
              1000₺ üzeri alışverişlerde ücretsiz kargo
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href={siteConfig.phoneHref} className="flex items-center gap-1.5 hover:text-turquoise-300 transition-colors">
              <Phone className="w-3 h-3" />
              {siteConfig.phone}
            </a>
            <Link href="/hakkimizda" className="hover:text-turquoise-300 transition-colors">Hakkımızda</Link>
            <Link href="/iletisim" className="hover:text-turquoise-300 transition-colors">İletişim</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur-lg shadow-lg shadow-navy-900/10"
            : "bg-white border-b border-navy-100"
        )}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 py-4">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-navy-50 text-navy-700 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menü"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-turquoise-400 to-turquoise-600 flex items-center justify-center shadow-lg shadow-turquoise-500/30 group-hover:shadow-turquoise-500/50 transition-shadow">
                  <Waves className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-black text-navy-900 tracking-tight">
                  Havuz<span className="text-turquoise-500">Market</span>
                </span>
                <span className="text-[10px] text-navy-400 font-medium tracking-widest uppercase mt-0.5">Havuz Ekipmanları</span>
              </div>
            </Link>

            {/* Search */}
            <form 
              ref={desktopSearchRef}
              onSubmit={handleSearch} 
              className="hidden md:flex flex-1 max-w-2xl relative"
            >
              <input
                type="search"
                placeholder="Ürün, marka veya kategori ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => searchQuery.trim() && setShowDropdown(true)}
                className="w-full h-11 pl-5 pr-14 rounded-2xl border-2 border-navy-100 bg-navy-50 text-sm text-navy-900 placeholder:text-navy-400 focus:outline-none focus:border-turquoise-400 focus:bg-white transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-turquoise-500 hover:bg-turquoise-600 text-white rounded-xl flex items-center justify-center transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl shadow-navy-900/10 border border-navy-100 overflow-hidden z-50">
                  {isSearching ? (
                    <div className="p-4 text-center text-sm text-navy-500">Aranıyor...</div>
                  ) : searchResults.length > 0 ? (
                    <div className="flex flex-col">
                      {searchResults.slice(0, 6).map((product, i) => (
                        <Link
                          key={product.id}
                          href={`/urun/${product.slug}`}
                          className={cn(
                            "flex items-center gap-3 p-3 hover:bg-navy-50 transition-colors border-b border-navy-50 last:border-0",
                            selectedIndex === i && "bg-navy-50"
                          )}
                        >
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white border border-navy-100 shrink-0">
                            <Image src={product.images[0]} alt={product.title} fill className="object-contain p-1" sizes="48px" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-navy-900 truncate">{product.title}</p>
                            <p className="text-xs text-navy-500 truncate">{product.brand} • {product.category}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-bold text-turquoise-600">{formatCurrency(product.price)}</p>
                            {product.stock > 0 ? (
                              <p className="text-[10px] text-green-500 font-medium">Stokta var</p>
                            ) : (
                              <p className="text-[10px] text-red-500 font-medium">Stokta yok</p>
                            )}
                          </div>
                        </Link>
                      ))}
                      {searchResults.length > 6 && (
                        <button
                          type="button"
                          onClick={() => {
                            router.push(`/arama?q=${encodeURIComponent(searchQuery)}`);
                            setShowDropdown(false);
                          }}
                          className={cn(
                            "p-3 text-center text-sm font-semibold text-turquoise-600 hover:bg-navy-50 transition-colors border-t border-navy-100",
                            selectedIndex === 6 && "bg-navy-50"
                          )}
                        >
                          Tüm sonuçları gör ({searchResults.length})
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-navy-500">
                      Aramanızla eşleşen ürün bulunamadı.
                    </div>
                  )}
                </div>
              )}
            </form>

            {/* Actions */}
            <div className="flex items-center gap-1 ml-auto">
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-2 p-2.5 rounded-xl hover:bg-navy-50 text-navy-600 hover:text-turquoise-600 transition-all font-semibold text-sm"
              >
                Giriş Yap
              </Link>
              <Link
                href="/register"
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-turquoise-500 hover:bg-turquoise-600 text-white transition-all font-semibold text-sm shadow-sm hover:shadow-md"
              >
                Üye Ol
              </Link>
              
              <Link
                href="/favoriler"
                className="relative p-2.5 rounded-xl hover:bg-navy-50 text-navy-600 hover:text-turquoise-600 transition-all group"
                aria-label="Favoriler"
              >
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {favCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
                    {favCount}
                  </span>
                )}
              </Link>

              <Link
                href="/sepet"
                className="relative p-2.5 rounded-xl hover:bg-navy-50 text-navy-600 hover:text-turquoise-600 transition-all group"
                aria-label="Sepet"
              >
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {totalItems > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-turquoise-500 text-white text-[10px] font-bold rounded-full px-1">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-3">
            <form ref={mobileSearchRef} onSubmit={handleSearch} className="relative">
              <input
                type="search"
                placeholder="Ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => searchQuery.trim() && setShowDropdown(true)}
                className="w-full h-10 pl-4 pr-12 rounded-xl border border-navy-200 bg-navy-50 text-sm focus:outline-none focus:border-turquoise-400"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-turquoise-500 text-white rounded-lg flex items-center justify-center">
                <Search className="w-3.5 h-3.5" />
              </button>

              {/* Mobile Dropdown */}
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl shadow-navy-900/10 border border-navy-100 overflow-hidden z-50">
                  {isSearching ? (
                    <div className="p-4 text-center text-sm text-navy-500">Aranıyor...</div>
                  ) : searchResults.length > 0 ? (
                    <div className="flex flex-col">
                      {searchResults.slice(0, 6).map((product, i) => (
                        <Link
                          key={product.id}
                          href={`/urun/${product.slug}`}
                          className={cn(
                            "flex items-center gap-3 p-3 hover:bg-navy-50 transition-colors border-b border-navy-50 last:border-0",
                            selectedIndex === i && "bg-navy-50"
                          )}
                        >
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white border border-navy-100 shrink-0">
                            <Image src={product.images[0]} alt={product.title} fill className="object-contain p-1" sizes="40px" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-navy-900 truncate">{product.title}</p>
                            <p className="text-[10px] text-navy-500 truncate">{product.brand}</p>
                          </div>
                        </Link>
                      ))}
                      {searchResults.length > 6 && (
                        <button
                          type="button"
                          onClick={() => {
                            router.push(`/arama?q=${encodeURIComponent(searchQuery)}`);
                            setShowDropdown(false);
                          }}
                          className={cn(
                            "p-3 text-center text-sm font-semibold text-turquoise-600 hover:bg-navy-50 transition-colors border-t border-navy-100",
                            selectedIndex === 6 && "bg-navy-50"
                          )}
                        >
                          Tüm sonuçları gör ({searchResults.length})
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-navy-500">
                      Sonuç bulunamadı.
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Desktop Category Nav */}
          <nav className="hidden lg:flex items-center gap-1 border-t border-navy-50 py-2">
            {categories.map((cat) => (
              <div
                key={cat.slug}
                className="relative"
                onMouseEnter={() => handleMouseEnter(cat.slug)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={`/kategori/${cat.slug}`}
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap",
                    activeDropdown === cat.slug
                      ? "bg-turquoise-50 text-turquoise-700"
                      : "text-navy-700 hover:bg-navy-50 hover:text-navy-900"
                  )}
                >
                  {cat.name}
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", activeDropdown === cat.slug && "rotate-180")} />
                </Link>

                {activeDropdown === cat.slug && (
                  <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-2xl shadow-2xl shadow-navy-900/15 border border-navy-100 overflow-hidden z-50">
                    <div className="p-2">
                      {cat.subs.map((sub) => (
                        <Link
                          key={sub}
                          href={`/kategori/${cat.slug}`}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-navy-700 hover:bg-turquoise-50 hover:text-turquoise-700 transition-colors"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-turquoise-400 flex-shrink-0" />
                          {sub}
                        </Link>
                      ))}
                      <div className="border-t border-navy-50 mt-2 pt-2">
                        <Link
                          href={`/kategori/${cat.slug}`}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-turquoise-600 hover:bg-turquoise-50 transition-colors"
                          onClick={() => setActiveDropdown(null)}
                        >
                          Tümünü Gör →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-navy-100 bg-white">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <nav className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/kategori/${cat.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-navy-50 text-sm font-semibold text-navy-800 hover:bg-turquoise-50 hover:text-turquoise-700 transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
