import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { ChevronRight, Shield, Lock, Eye, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description: `${siteConfig.name} gizlilik politikası, çerez kullanımı ve kişisel verilerin korunması hakkında detaylı bilgilendirme.`,
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* ── HERO ── */}
      <section className="bg-navy-950 pt-10 pb-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-navy-400 mb-6">
            <Link href="/" className="hover:text-turquoise-300 transition-colors">Ana Sayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-navy-200">Gizlilik Politikası</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">Gizlilik Politikası</h1>
          <p className="text-navy-300 text-lg">Kişisel verilerinizin güvenliği bizim için en büyük önceliktir.</p>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="max-w-4xl mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl border border-navy-100 p-8 lg:p-12 shadow-xl shadow-navy-900/5">
          
          <div className="grid sm:grid-cols-3 gap-4 mb-12">
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col items-center text-center">
              <Shield className="w-6 h-6 text-turquoise-600 mb-3" />
              <h3 className="font-bold text-navy-900 text-sm mb-1">Veri Güvenliği</h3>
              <p className="text-xs text-navy-500">Bilgileriniz en güncel şifreleme teknolojileri ile korunur.</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col items-center text-center">
              <Eye className="w-6 h-6 text-turquoise-600 mb-3" />
              <h3 className="font-bold text-navy-900 text-sm mb-1">Şeffaflık</h3>
              <p className="text-xs text-navy-500">Verilerinizi ne amaçla kullandığımızı daima açıklarız.</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col items-center text-center">
              <Lock className="w-6 h-6 text-turquoise-600 mb-3" />
              <h3 className="font-bold text-navy-900 text-sm mb-1">Erişim Kontrolü</h3>
              <p className="text-xs text-navy-500">Bilgileriniz asla izniniz olmadan üçüncü kişilerle paylaşılmaz.</p>
            </div>
          </div>

          <div className="prose prose-navy max-w-none prose-headings:font-black prose-headings:text-navy-900 prose-p:text-navy-600">
            <p>
              <strong>{siteConfig.name}</strong> olarak müşteri gizliliğine ve kişisel verilerinizin güvenliğine en üst düzeyde 
              önem veriyoruz. Bu politika, sitemizi kullanırken topladığımız veriler, bu verilerin nasıl kullanıldığı ve nasıl korunduğu hakkında 
              bilgilendirme amacıyla hazırlanmıştır.
            </p>

            <h2>1. Hangi Veriler Toplanır?</h2>
            <p>
              Sitemize üye olurken, alışveriş yaparken veya iletişim formu doldururken ad, soyad, e-posta adresi, telefon numarası 
              ve teslimat/fatura adresleriniz gibi temel kişisel bilgileri talep ederiz. Ayrıca, alışveriş deneyiminizi iyileştirmek amacıyla 
              sitemizdeki tarama davranışlarınız ve IP adresiniz anonimleştirilmiş olarak kayıt altına alınabilir.
            </p>

            <h2>2. Veriler Nasıl Kullanılır?</h2>
            <p>Topladığımız veriler şu amaçlarla kullanılır:</p>
            <ul>
              <li>Siparişlerinizin işlenmesi, teslimatı ve faturalandırılması.</li>
              <li>Size özel ürün önerileri ve (izniniz dâhilinde) kampanya bilgilendirmeleri sunulması.</li>
              <li>İade, iptal ve destek taleplerinizin hızlı bir şekilde çözümlenmesi.</li>
              <li>Sitemizin performansının izlenmesi ve alışveriş deneyiminizin iyileştirilmesi.</li>
            </ul>

            <h2>3. Çerez (Cookie) Kullanımı</h2>
            <p>
              Çerezler, web sitemizin daha verimli çalışmasını sağlamak için tarayıcınıza yerleştirilen küçük veri dosyalarıdır. 
              {siteConfig.name}, oturumunuzu açık tutmak, sepetinizdeki ürünleri hatırlamak ve site içi analizler yapmak amacıyla 
              zorunlu ve performans çerezleri kullanmaktadır. Tarayıcı ayarlarınızdan çerezleri dilediğiniz zaman yönetebilirsiniz.
            </p>

            <h2>4. Veri Güvenliği ve Üçüncü Taraf Paylaşımları</h2>
            <p>
              Tüm işlemleriniz sırasında paylaştığınız kişisel ve ödeme bilgileriniz 256-bit SSL şifreleme yöntemi ile korunmaktadır. 
              Kredi kartı bilgileriniz sistemlerimizde kesinlikle saklanmaz ve doğrudan ödeme kuruluşuna iletilir. 
              Kişisel verileriniz, yalnızca yasal zorunluluklar dâhilinde siparişinizin teslimatı için kargo firmaları ve ödeme onayı 
              için bankalar gibi iş ortaklarımızla güvenli çerçevede paylaşılır; bunun dışında asla üçüncü şahıslara satılamaz.
            </p>

            <h2>5. Müşteri Hakları ve İletişim</h2>
            <p>
              Sakladığımız kişisel verilerinize erişme, güncelleme veya bu verilerin silinmesini talep etme hakkına sahipsiniz. 
              Verilerinizle ilgili her türlü soru ve talebiniz için bize <a href={siteConfig.emailHref} className="text-turquoise-600 font-bold hover:underline mx-1">{siteConfig.email}</a> 
              adresinden ulaşabilirsiniz.
            </p>

            <div className="mt-10 p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-3 text-sm text-amber-800">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="m-0 font-semibold">Önemli Not</p>
                <p className="m-0 mt-1 opacity-90">
                  Bu gizlilik politikası genel bir bilgilendirme metnidir. Sitenin yayına alınmasından önce 6698 sayılı KVKK (Kişisel Verilerin Korunması Kanunu) ve ilgili mevzuatlar çerçevesinde profesyonel bir hukuk danışmanı tarafından incelenmesi tavsiye edilir.
                </p>
              </div>
            </div>
            
            <p className="text-xs text-navy-400 mt-8 text-right">
              Son güncellenme tarihi: {new Date().toLocaleDateString('tr-TR')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
