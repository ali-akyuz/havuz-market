import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Truck,
  HeadphonesIcon,
  BookOpen,
  Target,
  Eye,
  ArrowRight,
  CheckCircle2,
  Award,
  Users,
  Package,
} from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Arpeta, 2010'dan bu yana Türkiye'nin önde gelen havuz ekipmanları platformudur. Dolphin, Hayward, Zodiac ve daha fazla markanın yetkili distribütörüyüz.",
};

const whyUs = [
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Kaliteli Ürünler",
    desc: "Stokumuzda yalnızca dünya markalarının orijinal ve yetkili ürünleri yer alır. Satın aldığınız her ürün orijinallik güvencesiyle gelir.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: <Truck className="w-6 h-6" />,
    title: "Hızlı Teslimat",
    desc: "1.000₺ üzeri siparişlerde ücretsiz, tüm Türkiye'ye 1-3 iş günü içinde kapı teslimi. Büyük ekipmanlar için özel kurulum desteği.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: <HeadphonesIcon className="w-6 h-6" />,
    title: "Uzman Desteği",
    desc: "Hafta içi 09:00–18:00 saatleri arasında alanında uzman teknisyenlerden satış öncesi ve sonrası teknik destek alabilirsiniz.",
    color: "bg-violet-50 text-violet-600",
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Uzman Rehberlik",
    desc: "Havuz tipi, kapasitesi ve bütçenize göre doğru ekipmanı seçmeniz için kişiselleştirilmiş danışmanlık hizmeti sunuyoruz.",
    color: "bg-amber-50 text-amber-600",
  },
];

const stats = [
  { icon: <Users className="w-5 h-5" />, value: siteConfig.customerCount, label: "Mutlu Müşteri" },
  { icon: <Package className="w-5 h-5" />, value: siteConfig.productCount, label: "Ürün Çeşidi" },
  { icon: <Award className="w-5 h-5" />, value: siteConfig.brandCount, label: "Yetkili Marka" },
  { icon: <ShieldCheck className="w-5 h-5" />, value: `${new Date().getFullYear() - siteConfig.founding}+`, label: "Yıllık Deneyim" },
];

const timeline = [
  { year: "2010", title: "Kuruluş", desc: "Ankara Ostim'de küçük bir ekip ve büyük bir vizyonla yolculuğumuza başladık." },
  { year: "2014", title: "Bayi Ağı", desc: "Dolphin ve Hayward markalarının Türkiye distribütörlüğünü üstlenerek bayi ağımızı genişlettik." },
  { year: "2018", title: "E-Ticaret", desc: "Online platformumuzu açarak müşterilerimize 7/24 alışveriş imkânı sunduk." },
  { year: "2022", title: "Premium Deneyim", desc: "Müşteri memnuniyetinde %96 oranına ulaştık ve 2.500+ mutlu müşteriye hizmet ettik." },
  { year: "2024", title: "Yeni Nesil Platform", desc: "Tamamen yenilenen Arpeta platformuyla daha hızlı, daha akıllı ve daha kolay alışveriş deneyimi." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── HERO ── */}
      <section className="relative bg-navy-950 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/banners/hero.jpg"
            alt="Hakkımızda"
            fill
            priority
            className="object-cover opacity-20"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/90 to-navy-950/60" />
        </div>
        <div className="absolute top-20 right-[15%] w-80 h-80 rounded-full bg-turquoise-500/10 blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 lg:py-32">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-navy-400 mb-8">
            <Link href="/" className="hover:text-turquoise-300 transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-navy-200">Hakkımızda</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-turquoise-500/20 border border-turquoise-400/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-turquoise-400 animate-pulse" />
              <span className="text-turquoise-300 text-sm font-semibold">{siteConfig.founding}'dan Bu Yana</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight mb-6">
              Havuzunuz İçin{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-turquoise-300 to-turquoise-500">
                En İyisini
              </span>{" "}
              Sunuyoruz.
            </h1>
            <p className="text-lg text-navy-300 leading-relaxed max-w-2xl">
              Arpeta, {siteConfig.founding} yılında Ankara'da kurulmuş, havuz ekipmanları, kimyasallar ve bakım ürünleri
              alanında Türkiye'nin güvenilir platformlarından biridir. Dolphin, Hayward, Zodiac, AstralPool ve BWT gibi
              dünya markalarının yetkili distribütörüyüz.
            </p>
          </div>
        </div>
      </section>

      {/* ── İSTATİSTİKLER ── */}
      <section className="bg-white border-b border-navy-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-navy-100">
            {stats.map(({ icon, value, label }) => (
              <div key={label} className="flex flex-col items-center justify-center py-10 px-6 text-center group">
                <div className="w-12 h-12 rounded-2xl bg-turquoise-50 flex items-center justify-center text-turquoise-600 mb-4 group-hover:bg-turquoise-500 group-hover:text-white transition-all">
                  {icon}
                </div>
                <span className="text-3xl font-black text-navy-900">{value}</span>
                <span className="text-sm text-navy-500 mt-1">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BİZ KİMİZ ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-turquoise-600 font-semibold text-sm uppercase tracking-widest mb-3">Biz Kimiz</p>
              <h2 className="text-3xl lg:text-4xl font-black text-navy-900 mb-6 leading-snug">
                Türkiye'nin Havuz Ekipmanları Uzmanı
              </h2>
              <div className="space-y-4 text-navy-600 leading-relaxed">
                <p>
                  Arpeta, {siteConfig.founding} yılında Ankara Ostim'de kurulmuş; havuz robotları, kimyasallar, pompalar,
                  aydınlatmalar ve tuz klor jeneratörleri alanında uzmanlaşmış bir e-ticaret platformudur.
                </p>
                <p>
                  Yıllar içinde büyüyen bayi ve servis ağımız sayesinde Türkiye'nin dört bir yanındaki havuz sahiplerine,
                  otellere, tatil köylerine ve site yönetimlerine güvenilir ekipman ve teknik destek sunuyoruz.
                </p>
                <p>
                  Sattığımız her ürün, dünya genelinde kanıtlanmış markaların orijinal ürünleridir. Satış sonrası
                  yetkili servis desteği ve 2 yıla kadar garanti ile müşterilerimizin yanındayız.
                </p>
              </div>
              <div className="mt-8 space-y-3">
                {[
                  "Yetkili distribütör ve orijinal ürün garantisi",
                  "Tüm Türkiye'ye 1-3 iş günü teslimat",
                  "Uzman teknik destek ve danışmanlık",
                  "2 yıla kadar garanti ve yetkili servis",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-turquoise-500 flex-shrink-0 mt-0.5" />
                    <span className="text-navy-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual panel */}
            <div className="relative">
              <div className="relative h-[420px] rounded-3xl overflow-hidden">
                <Image src="/images/banners/campaign.jpg" alt="Arpeta Showroom" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
                    <p className="text-white font-bold text-lg">"Güvenilir Havuz Ekipmanı"</p>
                    <p className="text-navy-200 text-sm mt-1">
                      {siteConfig.founding}'dan bu yana {siteConfig.customerCount} mutlu müşteri
                    </p>
                  </div>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-turquoise-500 rounded-2xl flex flex-col items-center justify-center text-white shadow-xl shadow-turquoise-500/30 rotate-3">
                <span className="text-2xl font-black">{new Date().getFullYear() - siteConfig.founding}+</span>
                <span className="text-[10px] font-semibold text-center leading-tight">Yıllık<br />Deneyim</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEDEN ARPETA ── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-turquoise-600 font-semibold text-sm uppercase tracking-widest mb-3">Avantajlarımız</p>
            <h2 className="text-3xl lg:text-4xl font-black text-navy-900">Neden Arpeta'yı Seçmelisiniz?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map(({ icon, title, desc, color }) => (
              <div key={title} className="bg-white rounded-2xl border border-navy-100 p-6 hover:shadow-xl hover:shadow-navy-900/8 hover:-translate-y-1 transition-all duration-300">
                <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-5`}>
                  {icon}
                </div>
                <h3 className="font-black text-navy-900 text-lg mb-3">{title}</h3>
                <p className="text-navy-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TARİHSEL YOLCULUK ── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-turquoise-600 font-semibold text-sm uppercase tracking-widest mb-3">Yolculuğumuz</p>
            <h2 className="text-3xl lg:text-4xl font-black text-navy-900">Büyüme Hikâyemiz</h2>
          </div>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-turquoise-200 via-turquoise-400 to-transparent -translate-x-1/2 hidden sm:block" />
            <div className="space-y-10">
              {timeline.map((item, i) => (
                <div key={item.year} className={`relative flex gap-6 lg:gap-0 ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}>
                  {/* Content */}
                  <div className={`w-full lg:w-[calc(50%-2rem)] ${i % 2 === 0 ? "lg:pr-12" : "lg:pl-12"}`}>
                    <div className="bg-white rounded-2xl border border-navy-100 p-6 hover:border-turquoise-200 hover:shadow-lg transition-all">
                      <span className="inline-block bg-turquoise-500 text-white text-sm font-black px-3 py-1 rounded-xl mb-3">
                        {item.year}
                      </span>
                      <h3 className="font-black text-navy-900 text-lg mb-2">{item.title}</h3>
                      <p className="text-navy-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  {/* Dot on timeline */}
                  <div className="hidden lg:flex absolute left-1/2 top-6 -translate-x-1/2 w-4 h-4 rounded-full bg-turquoise-500 border-4 border-white shadow-lg z-10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MİSYON & VİZYON ── */}
      <section className="py-20 bg-navy-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-turquoise-500/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Misyon */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 lg:p-10">
              <div className="w-12 h-12 rounded-2xl bg-turquoise-500/20 flex items-center justify-center text-turquoise-400 mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white mb-4">Misyonumuz</h2>
              <p className="text-navy-300 leading-relaxed">
                Türkiye'deki her havuz sahibine doğru ekipmanı doğru fiyatla ulaştırmak; satış öncesi danışmanlıktan
                satış sonrası teknik desteğe kadar kesintisiz bir hizmet zinciri kurmak. Kaliteden ödün vermeden
                uygun fiyatlı ve güvenilir havuz ekipmanlarını herkesin erişimine açmak.
              </p>
            </div>
            {/* Vizyon */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 lg:p-10">
              <div className="w-12 h-12 rounded-2xl bg-turquoise-500/20 flex items-center justify-center text-turquoise-400 mb-6">
                <Eye className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white mb-4">Vizyonumuz</h2>
              <p className="text-navy-300 leading-relaxed">
                Havuz ekipmanları sektöründe Türkiye'nin en güvenilir ve teknoloji odaklı platformu olmak. Akıllı havuz
                sistemleri, enerji verimliliği ve sürdürülebilir kimyasal kullanımı konularında öncü bir rol üstlenerek
                sektörün dijital dönüşümüne liderlik etmek.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-black text-navy-900 mb-4">
            Havuzunuz için doğru ekipmanı birlikte bulalım.
          </h2>
          <p className="text-navy-500 text-lg mb-8">
            {siteConfig.productCount} ürün çeşidi ve {siteConfig.brandCount} yetkili marka ile her bütçeye uygun çözüm.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/kategori/havuz-robotlari"
              className="inline-flex items-center gap-2 bg-turquoise-500 hover:bg-turquoise-600 text-white font-bold px-8 py-4 rounded-2xl transition-all hover:shadow-xl hover:shadow-turquoise-500/20 hover:-translate-y-0.5"
            >
              Ürünleri İncele
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/iletisim"
              className="inline-flex items-center gap-2 bg-navy-50 hover:bg-navy-100 text-navy-800 font-semibold px-8 py-4 rounded-2xl border border-navy-200 transition-all"
            >
              Bize Ulaşın
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
