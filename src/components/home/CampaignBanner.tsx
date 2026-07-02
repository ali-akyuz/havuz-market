import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Tag, Clock, Package } from "lucide-react";

export function CampaignBanner() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-navy-950 min-h-[400px] flex items-center">
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src="/images/banners/campaign.jpg"
              alt="Yaz Kampanyası"
              fill
              className="object-cover opacity-30"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/70 to-navy-950/20" />
          </div>

          {/* Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-turquoise-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-500/15 rounded-full blur-2xl translate-y-1/2" />

          {/* Content */}
          <div className="relative z-10 p-10 lg:p-16 flex-1">
            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-400/30 rounded-full px-4 py-1.5 mb-6">
              <Tag className="w-3.5 h-3.5 text-red-400" />
              <span className="text-red-300 text-sm font-semibold">Sınırlı Süre Kampanyası</span>
            </div>

            <h2 className="text-4xl lg:text-6xl font-black text-white leading-tight mb-4">
              Tüm Havuz
              <br />
              Robotlarında
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-turquoise-300 to-turquoise-500">
                %24&apos;e Varan İndirim
              </span>
            </h2>

            <p className="text-navy-300 text-lg mb-8 max-w-md leading-relaxed">
              Akıllı robot teknolojisi ile havuzunuzu pırıl pırıl tutun. 
              Bu yaz sezonu en popüler modellerde tarihin en büyük indirimi.
            </p>

            <div className="flex flex-wrap gap-6 mb-10">
              {[
                { icon: <Clock className="w-4 h-4" />, text: "Kampanya 31 Ağustos'ta bitiyor" },
                { icon: <Package className="w-4 h-4" />, text: "Ücretsiz hızlı teslimat" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-navy-300">
                  <span className="text-turquoise-400">{icon}</span>
                  {text}
                </div>
              ))}
            </div>

            <Link
              href="/kategori/havuz-robotlari"
              className="inline-flex items-center gap-2 bg-turquoise-500 hover:bg-turquoise-400 text-white font-bold px-8 py-4 rounded-2xl transition-all hover:shadow-xl hover:shadow-turquoise-500/30 hover:-translate-y-0.5 text-base"
            >
              Kampanyaya Git
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Stat cards */}
          <div className="hidden lg:flex flex-col gap-4 p-10 lg:p-16 relative z-10 flex-shrink-0">
            {[
              { value: "2.500+", label: "Mutlu Müşteri" },
              { value: "%24", label: "Maksimum İndirim" },
              { value: "3 Yıl", label: "Garanti" },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center min-w-[140px]">
                <div className="text-3xl font-black text-white mb-1">{value}</div>
                <div className="text-xs text-navy-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
