import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { ChevronRight, Package, Truck, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Kargo & Teslimat",
  description: `${siteConfig.name} kargo, gönderim süreçleri ve teslimat koşulları hakkında detaylı bilgi.`,
};

export default function ShippingDeliveryPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* ── HERO ── */}
      <section className="bg-navy-950 pt-10 pb-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-navy-400 mb-6">
            <Link href="/" className="hover:text-turquoise-300 transition-colors">Ana Sayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-navy-200">Kargo & Teslimat</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">Kargo ve Teslimat</h1>
          <p className="text-navy-300 text-lg">Siparişlerinizin size ulaşma süreci hakkında bilmeniz gerekenler.</p>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="max-w-4xl mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl border border-navy-100 p-8 lg:p-12 shadow-xl shadow-navy-900/5">
          
          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
              <Package className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-bold text-navy-900 mb-2">Sipariş Hazırlık</h3>
              <p className="text-sm text-navy-600">Siparişleriniz genellikle 1-2 iş günü içerisinde özenle hazırlanarak kargoya teslim edilmektedir.</p>
            </div>
            <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100">
              <Truck className="w-8 h-8 text-emerald-600 mb-4" />
              <h3 className="font-bold text-navy-900 mb-2">Teslimat Süresi</h3>
              <p className="text-sm text-navy-600">Kargoya teslim edildikten sonra bulunduğunuz bölgeye göre ortalama 1-4 iş günü içinde adresinize ulaşır.</p>
            </div>
          </div>

          <div className="prose prose-navy max-w-none prose-headings:font-black prose-headings:text-navy-900 prose-p:text-navy-600">
            <h2>Gönderim Süreci</h2>
            <p>
              {siteConfig.name} üzerinden verdiğiniz tüm siparişler, kalite kontrolünden geçtikten sonra hasar görmeyecek şekilde özenle paketlenir. 
              Siparişiniz kargo firmasına teslim edildiğinde, size bir SMS ve E-posta ile kargo takip numarası iletilmektedir.
            </p>

            <h2>Kargo Takibi</h2>
            <p>
              Size iletilen kargo takip numarası ile ilgili kargo firmasının web sitesi üzerinden siparişinizin nerede olduğunu anlık olarak takip edebilirsiniz. 
              Ayrıca sitemize üyeyseniz, "Hesabım" bölümündeki "Siparişlerim" sayfasından da takip bağlantısına ulaşabilirsiniz.
            </p>

            <h2>Teslimat Adresi</h2>
            <p>
              Kargonuzun hızlı ve sorunsuz teslim edilebilmesi için adres bilgilerinizi (mahalle, cadde, sokak, bina, daire vb.) eksiksiz ve açık bir şekilde yazmanız gerekmektedir. 
              Kargo teslimatı sırasında adresinizde bulunmamanız durumunda, kargonuz bölgenizdeki en yakın kargo şubesine bırakılır ve genellikle 3 iş günü içerisinde şubeden teslim almanız beklenir.
            </p>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-xl my-8">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-amber-900 m-0 mb-1">Hasarlı Paket Durumu</h3>
                  <p className="text-sm text-amber-800 m-0">
                    Lütfen kargonuzu teslim alırken paketini kontrol ediniz. Eğer pakette yırtılma, ezilme veya ıslanma gibi hasar belirtileri varsa, 
                    kargoyu teslim almayarak kargo görevlisine <strong>"Hasar Tespit Tutanağı"</strong> tutturmanız gerekmektedir. 
                    Tutanak tutulan kargoların değişimi veya iadesi tarafımızca hızla yapılacaktır.
                  </p>
                </div>
              </div>
            </div>

            <h2>Bize Ulaşın</h2>
            <p>
              Kargo ve teslimat ile ilgili tüm sorularınız için çalışma saatlerimiz ({siteConfig.workingHours.weekdays}) içerisinde 
              <a href={siteConfig.phoneHref} className="text-turquoise-600 font-bold hover:underline mx-1">{siteConfig.phone}</a>
              numaralı telefondan veya 
              <a href={siteConfig.emailHref} className="text-turquoise-600 font-bold hover:underline mx-1">{siteConfig.email}</a> 
              adresinden destek ekibimizle iletişime geçebilirsiniz.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
