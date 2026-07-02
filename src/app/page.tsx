import { getBestsellerProducts, getCampaignProducts, getNewProducts } from "@/services/products";
import { Hero } from "@/components/home/Hero";
import { CategoryCards } from "@/components/home/CategoryCards";
import { ProductSlider } from "@/components/home/ProductSlider";
import { CampaignBanner } from "@/components/home/CampaignBanner";
import { BrandStrip } from "@/components/home/BrandStrip";
import { Newsletter } from "@/components/home/Newsletter";
import { Shield, Truck, HeadphonesIcon, RotateCcw } from "lucide-react";

const trustFeatures = [
  { icon: <Truck className="w-6 h-6" />, title: "Ücretsiz Kargo", desc: "1.000₺ üzeri tüm siparişlerde" },
  { icon: <Shield className="w-6 h-6" />, title: "2 Yıl Garanti", desc: "Yetkili servis güvencesi" },
  { icon: <HeadphonesIcon className="w-6 h-6" />, title: "Uzman Destek", desc: "Hft içi 09:00–18:00" },
  { icon: <RotateCcw className="w-6 h-6" />, title: "14 Gün İade", desc: "Koşulsuz iade hakkı" },
];

export default async function Home() {
  const [bestsellers, campaigns, newArrivals] = await Promise.all([
    getBestsellerProducts(),
    getCampaignProducts(),
    getNewProducts(),
  ]);

  return (
    <>
      <Hero />

      {/* Trust features */}
      <section className="bg-white border-b border-navy-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-navy-100 divide-y lg:divide-y-0">
            {trustFeatures.map(({ icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4 p-6 group">
                <div className="w-12 h-12 rounded-xl bg-turquoise-50 flex items-center justify-center text-turquoise-600 flex-shrink-0 group-hover:bg-turquoise-500 group-hover:text-white transition-all">
                  {icon}
                </div>
                <div>
                  <p className="font-bold text-navy-900 text-sm">{title}</p>
                  <p className="text-navy-500 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CategoryCards />
      
      <ProductSlider
        title="Çok Satanlar"
        subtitle="En Popüler"
        products={bestsellers}
        bgColor="bg-slate-50"
        viewAllHref="/kategori/havuz-robotlari"
      />

      <CampaignBanner />

      <ProductSlider
        title="Kampanyalı Ürünler"
        subtitle="Sınırlı Süre"
        products={campaigns}
        bgColor="bg-white"
        viewAllHref="/kategori/havuz-robotlari"
      />

      <BrandStrip />

      <ProductSlider
        title="Yeni Gelenler"
        subtitle="Yeni Ürünler"
        products={newArrivals}
        bgColor="bg-slate-50"
        viewAllHref="/kategori/havuz-robotlari"
      />

      <Newsletter />
    </>
  );
}
