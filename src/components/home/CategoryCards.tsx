import Link from "next/link";
import Image from "next/image";
import { Cpu, Droplets, Zap, Lightbulb, Settings, Waves } from "lucide-react";

const categories = [
  {
    slug: "havuz-robotlari", name: "Havuz Robotları", desc: "Akıllı Temizleme",
    image: "/images/products/robot.jpg", icon: <Cpu className="w-5 h-5" />,
    color: "from-blue-500/20 to-turquoise-500/20", iconBg: "bg-blue-50 text-blue-600",
  },
  {
    slug: "havuz-kimyasallari", name: "Kimyasallar", desc: "Kristal Berraklık",
    image: "/images/products/chemicals.jpg", icon: <Droplets className="w-5 h-5" />,
    color: "from-cyan-500/20 to-sky-500/20", iconBg: "bg-cyan-50 text-cyan-600",
  },
  {
    slug: "havuz-pompalari", name: "Havuz Pompaları", desc: "Güçlü Sirkülasyon",
    image: "/images/products/pump.jpg", icon: <Zap className="w-5 h-5" />,
    color: "from-violet-500/20 to-purple-500/20", iconBg: "bg-violet-50 text-violet-600",
  },
  {
    slug: "havuz-aydinlatmalari", name: "Aydınlatma", desc: "Büyülü Işık",
    image: "/images/products/light.jpg", icon: <Lightbulb className="w-5 h-5" />,
    color: "from-amber-500/20 to-yellow-500/20", iconBg: "bg-amber-50 text-amber-600",
  },
  {
    slug: "havuz-ekipmanlari", name: "Ekipmanlar", desc: "Tam Donanım",
    image: "/images/products/filter.jpg", icon: <Settings className="w-5 h-5" />,
    color: "from-emerald-500/20 to-green-500/20", iconBg: "bg-emerald-50 text-emerald-600",
  },
  {
    slug: "tuz-klor-jeneratorleri", name: "Tuz Klor", desc: "Otomasyon",
    image: "/images/products/salt-gen.jpg", icon: <Waves className="w-5 h-5" />,
    color: "from-rose-500/20 to-pink-500/20", iconBg: "bg-rose-50 text-rose-600",
  },
];

export function CategoryCards() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-turquoise-600 font-semibold text-sm uppercase tracking-widest mb-3">Kategoriler</p>
          <h2 className="text-3xl lg:text-4xl font-black text-navy-900">Havuzunuz İçin Her Şey</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/kategori/${cat.slug}`}
              className="group relative flex flex-col items-center text-center p-5 rounded-2xl bg-navy-50 hover:bg-white border border-transparent hover:border-navy-100 hover:shadow-xl hover:shadow-navy-900/8 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image thumbnail */}
              <div className={`relative w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br ${cat.color} mb-4 flex-shrink-0`}>
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-contain p-2 transition-transform duration-300 group-hover:scale-110"
                  sizes="64px"
                />
              </div>

              {/* Icon badge */}
              <div className={`absolute top-3 right-3 w-7 h-7 rounded-lg ${cat.iconBg} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity`}>
                {cat.icon}
              </div>

              <h3 className="text-sm font-bold text-navy-800 group-hover:text-navy-900 transition-colors leading-snug">{cat.name}</h3>
              <p className="text-xs text-navy-400 mt-0.5">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
