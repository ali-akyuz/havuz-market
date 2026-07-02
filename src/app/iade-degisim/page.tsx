import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { ChevronRight, RefreshCw, XCircle, HeadphonesIcon, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "İade & Değişim",
  description: `${siteConfig.name} iade ve değişim koşulları, cayma hakkı ve iade süreçleri.`,
};

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* ── HERO ── */}
      <section className="bg-navy-950 pt-10 pb-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-navy-400 mb-6">
            <Link href="/" className="hover:text-turquoise-300 transition-colors">Ana Sayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-navy-200">İade & Değişim</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">İade ve Değişim</h1>
          <p className="text-navy-300 text-lg">Müşteri memnuniyetiniz bizim için önemlidir. İade süreçlerini kolaylaştırdık.</p>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="max-w-4xl mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl border border-navy-100 p-8 lg:p-12 shadow-xl shadow-navy-900/5">
          
          <div className="grid sm:grid-cols-3 gap-4 mb-12">
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col items-center text-center">
              <RefreshCw className="w-6 h-6 text-turquoise-600 mb-3" />
              <h3 className="font-bold text-navy-900 text-sm mb-1">14 Gün İade Hakkı</h3>
              <p className="text-xs text-navy-500">Ürünü teslim aldıktan sonra 14 gün içinde koşulsuz iade edebilirsiniz.</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col items-center text-center">
              <HeadphonesIcon className="w-6 h-6 text-turquoise-600 mb-3" />
              <h3 className="font-bold text-navy-900 text-sm mb-1">Destek Ekibi</h3>
              <p className="text-xs text-navy-500">İade süreci başlatmak için destek ekibimize ulaşın.</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col items-center text-center">
              <XCircle className="w-6 h-6 text-turquoise-600 mb-3" />
              <h3 className="font-bold text-navy-900 text-sm mb-1">İstisnalar</h3>
              <p className="text-xs text-navy-500">Kullanılmış ve ambalajı bozulmuş ürünler iade alınamamaktadır.</p>
            </div>
          </div>

          <div className="prose prose-navy max-w-none prose-headings:font-black prose-headings:text-navy-900 prose-p:text-navy-600">
            <h2>İade ve Değişim Süreci</h2>
            <p>
              Satın aldığınız ürünleri, kargo teslim tarihinden itibaren <strong>14 gün içerisinde</strong> iade etme veya değiştirme hakkına sahipsiniz. 
              İşlemlerinizin hızlı ve sorunsuz gerçekleşmesi için ürünlerin aşağıdaki koşulları sağlaması gerekmektedir.
            </p>

            <h3>İade Koşulları</h3>
            <ul>
              <li>Ürün kesinlikle kullanılmamış, hasar görmemiş ve orijinal ambalajı bozulmamış olmalıdır.</li>
              <li>Kurulumu veya montajı yapılmış ürünler cayma hakkı kapsamında iade edilemez.</li>
              <li>Ürünün tüm aksesuarları, kullanım kılavuzları ve varsa hediyeleri ürünle birlikte eksiksiz gönderilmelidir.</li>
              <li>İade edilecek ürünün faturası, kurumsal alımlarda ise iade faturası kesilerek paketle birlikte gönderilmelidir.</li>
            </ul>

            <h3>İade Edilemeyen Ürünler</h3>
            <p>
              Sağlık ve hijyen açısından uygun olmayan ürünler (havuz kimyasalları vb.) ambalajı açıldıktan sonra iade alınamamaktadır. 
              Özel üretim yapılan veya kullanıcıya özel boyutlandırılan malzemelerin iadesi yapılamaz.
            </p>

            <h2>İade Sürecini Nasıl Başlatabilirim?</h2>
            <ol>
              <li>
                <strong>Talebinizi İletin:</strong> 
                <a href={siteConfig.emailHref} className="text-turquoise-600 font-bold hover:underline mx-1">{siteConfig.email}</a> adresine 
                veya <a href={siteConfig.phoneHref} className="text-turquoise-600 font-bold hover:underline mx-1">{siteConfig.phone}</a> numaralı telefonumuza iade/değişim talebinizi bildirin.
              </li>
              <li>
                <strong>Kargo Kodunuzu Alın:</strong> Müşteri temsilcimiz size ücretsiz iade gönderimi yapabilmeniz için bir kargo anlaşma kodu verecektir.
              </li>
              <li>
                <strong>Paketi Teslim Edin:</strong> Ürünü faturasıyla birlikte sağlam bir şekilde paketleyerek kargo şubesine teslim edin.
              </li>
            </ol>

            <h2>Geri Ödeme Süreci</h2>
            <p>
              İade ettiğiniz ürünler depomuza ulaştığında, kalite kontrol ekibimiz tarafından incelenir. İade koşullarına uygun bulunan ürünlerin 
              ücret iadesi, kullandığınız ödeme yöntemine (kredi kartı veya banka havalesi) göre onaylandıktan sonra ortalama <strong>3-7 iş günü</strong> içerisinde hesabınıza yansıtılır.
            </p>

            <div className="mt-10 p-4 rounded-xl bg-navy-50 flex gap-3 text-sm text-navy-500">
              <HelpCircle className="w-5 h-5 text-navy-400 flex-shrink-0" />
              <p className="m-0">
                Not: Politikalarımız mevzuata uygun olarak belirli periyotlarla güncellenebilir. İşlem tarihindeki koşullar geçerlidir.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
