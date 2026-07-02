"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Waves, MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";
import { cn } from "@/lib/utils";

export function Footer() {
  const pathname = usePathname();
  return (
    <footer className="bg-navy-950 text-navy-300">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16 border-b border-navy-800/50">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-turquoise-400 to-turquoise-600 flex items-center justify-center shadow-lg">
                <Waves className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">{siteConfig.name}</span>
            </Link>
            <p className="text-sm leading-relaxed text-navy-400 max-w-xs">
              Türkiye'nin premium havuz ekipmanları platformu. 2010'dan bu yana güvenilir hizmet, 
              yetkili servis ağı ve uzman müşteri desteği.
            </p>
            <div className="flex items-center gap-3">
              {["VISA", "MC", "TROY", "AMEX"].map((card) => (
                <div key={card} className="h-7 px-2 bg-navy-800/60 rounded-md flex items-center justify-center">
                  <span className="text-[10px] font-bold text-navy-400">{card}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-widest">Kategoriler</h3>
            <ul className="space-y-3 text-sm">
              {[
                ["Havuz Robotları", "/kategori/havuz-robotlari"],
                ["Havuz Kimyasalları", "/kategori/havuz-kimyasallari"],
                ["Havuz Pompaları", "/kategori/havuz-pompalari"],
                ["Havuz Aydınlatmaları", "/kategori/havuz-aydinlatmalari"],
                ["Havuz Ekipmanları", "/kategori/havuz-ekipmanlari"],
                ["Tuz Klor Jeneratörleri", "/kategori/tuz-klor-jeneratorleri"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="flex items-center gap-2 text-navy-400 hover:text-turquoise-400 transition-colors group">
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-widest">Kurumsal</h3>
            <ul className="space-y-3 text-sm">
              {[
                ["Hakkımızda", "/hakkimizda"],
                ["Müşteri Hizmetleri", "/iletisim"],
                ["Kargo & Teslimat", "/kargo-teslimat"],
                ["İade & Değişim", "/iade-degisim"],
                ["Gizlilik Politikası", "/gizlilik-politikasi"],
                ["SSS", "/sss"],
              ].map(([label, href]) => {
                const isActive = pathname === href;
                return (
                  <li key={label}>
                    <Link 
                      href={href} 
                      className={cn(
                        "flex items-center gap-2 transition-colors group",
                        isActive ? "text-turquoise-400 font-semibold" : "text-navy-400 hover:text-turquoise-400"
                      )}
                    >
                      <ArrowRight className={cn(
                        "w-3 h-3 transition-all",
                        isActive ? "opacity-100 ml-0 text-turquoise-400" : "opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0"
                      )} />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-widest">İletişim</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-turquoise-500 mt-0.5 flex-shrink-0" />
                <span className="text-navy-400">
                  {siteConfig.address.line1}<br />
                  {siteConfig.address.line2}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-turquoise-500 flex-shrink-0" />
                <a href={siteConfig.phoneHref} className="text-navy-400 hover:text-turquoise-400 transition-colors">{siteConfig.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-turquoise-500 flex-shrink-0" />
                <a href={siteConfig.emailHref} className="text-navy-400 hover:text-turquoise-400 transition-colors">{siteConfig.email}</a>
              </li>
            </ul>

            <div className="mt-6 p-4 bg-navy-800/40 rounded-2xl border border-navy-700/50">
              <p className="text-xs font-semibold text-white mb-1">Müşteri Hizmetleri</p>
              <p className="text-xs text-navy-400">{siteConfig.workingHours.weekdays}</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-6 text-xs text-navy-500">
          <p>© {new Date().getFullYear()} {siteConfig.name}. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-1 text-navy-400">
            <span>Powered by</span>
            <span className="font-bold text-navy-300 tracking-widest">ARPETA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
