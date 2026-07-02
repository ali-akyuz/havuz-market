import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield, Truck, Star } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";

export function Hero() {
  return (
    <section className="relative min-h-[580px] lg:min-h-[680px] overflow-hidden bg-navy-950 flex items-center">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/banners/hero.jpg"
          alt="Premium Havuz Ekipmanları"
          fill
          priority
          className="object-cover opacity-40"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-[10%] w-72 h-72 rounded-full bg-turquoise-500/10 blur-3xl" />
      <div className="absolute bottom-10 right-[30%] w-48 h-48 rounded-full bg-turquoise-400/15 blur-2xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 lg:py-32 w-full">
        <div className="max-w-2xl">
          {/* Label */}
          <div className="inline-flex items-center gap-2 bg-turquoise-500/20 border border-turquoise-400/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-turquoise-400 animate-pulse" />
            <span className="text-turquoise-300 text-sm font-semibold">2026 Yaz Sezonu</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
            Havuzunuz
            <br />
            İçin{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-turquoise-300 to-turquoise-500">
              En İyisi.
            </span>
          </h1>

          <p className="text-lg text-navy-300 mb-10 leading-relaxed max-w-lg">
            Robotlardan kimyasallara, pompalardan aydınlatmaya — havuzunuzun ihtiyacı olan 
            her şey {siteConfig.name}'te. Uzman destek, 2 yıl garanti, ücretsiz kargo.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mb-12">
            <Link
              href="/kategori/havuz-robotlari"
              className="inline-flex items-center justify-center gap-2 bg-turquoise-500 hover:bg-turquoise-400 text-white font-bold px-8 py-4 rounded-2xl transition-all hover:shadow-xl hover:shadow-turquoise-500/30 hover:-translate-y-0.5 text-base"
            >
              Ürünleri Keşfet
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/kategori/havuz-robotlari"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-2xl border border-white/20 transition-all backdrop-blur-sm text-base"
            >
              Kampanyaları Gör
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center gap-6">
            {[
              { icon: <Truck className="w-4 h-4" />, text: "1000₺ Üzeri Ücretsiz Kargo" },
              { icon: <Shield className="w-4 h-4" />, text: "2 Yıl Garanti" },
              { icon: <Star className="w-4 h-4" />, text: "4.8/5 Müşteri Puanı" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm text-navy-300">
                <span className="text-turquoise-400">{icon}</span>
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10">
        <div className="w-[1px] h-8 bg-gradient-to-b from-transparent to-turquoise-400/50" />
        <div className="w-1 h-1 rounded-full bg-turquoise-400 animate-bounce" />
      </div>
    </section>
  );
}
