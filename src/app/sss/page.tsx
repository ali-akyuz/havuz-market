"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/lib/siteConfig";
import { ChevronRight, ChevronDown, MessageCircleQuestion } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Siparişim ne zaman kargoya verilir?",
    a: "Siparişleriniz kalite kontrolleri yapılıp özenle paketlendikten sonra 1-2 iş günü içerisinde kargo firmasına teslim edilmektedir. Kampanya dönemlerinde bu süre nadiren uzayabilmektedir."
  },
  {
    q: "Kargo takibini nasıl yapabilirim?",
    a: "Siparişiniz kargoya teslim edildiğinde size SMS ve e-posta yoluyla bir kargo takip numarası iletilir. Ayrıca sitemizdeki 'Hesabım' paneli üzerinden siparişlerinizin durumunu anlık olarak takip edebilirsiniz."
  },
  {
    q: "İade işlemini nasıl başlatabilirim?",
    a: "Teslim aldığınız ürünleri kullanılmamış ve ambalajı bozulmamış olmak şartıyla 14 gün içinde iade edebilirsiniz. Destek ekibimize ulaşarak ücretsiz iade gönderim kodunuzu talep edebilirsiniz."
  },
  {
    q: "Ürün değişimi yapabilir miyim?",
    a: "Evet, iade koşullarını sağlayan ürünler için değişim yapabilirsiniz. İade gönderimi yaparken paketinizin içine değişim yapmak istediğinizi ve yerine hangi ürünü/modeli talep ettiğinizi belirten bir not eklemeniz veya müşteri hizmetlerimize bilgi vermeniz yeterlidir."
  },
  {
    q: "Ödeme yöntemleri nelerdir?",
    a: "Sitemiz üzerinden kredi kartı (taksit imkanlarıyla) ve banka havalesi/EFT yöntemleriyle güvenle ödeme yapabilirsiniz."
  },
  {
    q: "Kapıda ödeme var mı?",
    a: "Havuz ekipmanları yüksek hacimli ve özellikli gönderiler olduğu için şu an operasyonel nedenlerle kapıda ödeme seçeneğimiz bulunmamaktadır."
  },
  {
    q: "Siparişimi iptal edebilir miyim?",
    a: "Siparişiniz kargoya teslim edilmediği sürece iptal işlemi yapabilirsiniz. İptal talebinizi müşteri hizmetlerimize iletmeniz durumunda tutar iadesi anında başlatılır."
  },
  {
    q: "Ürün stokta yoksa ne olur?",
    a: "Stokta kalmayan ancak tekrar temin edilebilir durumdaki ürünler için ürün sayfasında yer alan 'Gelince Haber Ver' butonunu kullanabilirsiniz. Ürün stoklarımıza girdiğinde e-posta ile otomatik olarak bilgilendirilirsiniz."
  },
  {
    q: "Destek ekibine nasıl ulaşabilirim?",
    a: `Müşteri hizmetlerimize ${siteConfig.workingHours.weekdays.toLowerCase()} saatleri arasında ${siteConfig.phone} numaralı telefondan veya ${siteConfig.email} e-posta adresinden ulaşabilirsiniz.`
  },
  {
    q: "Fatura bilgilerimi nasıl güncelleyebilirim?",
    a: "Sipariş oluşturma aşamasında adres bilgilerinizle birlikte bireysel veya kurumsal fatura bilgilerinizi girebilirsiniz. Geçmiş faturalarınızla ilgili bir değişiklik için siparişinizin faturalanmamış olması gerekmekte olup, böyle durumlarda hızlıca destek ekibimize ulaşmalısınız."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* ── HERO ── */}
      <section className="bg-navy-950 pt-10 pb-20 relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 relative z-10 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-navy-400 mb-6">
            <Link href="/" className="hover:text-turquoise-300 transition-colors">Ana Sayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-navy-200">Sık Sorulan Sorular</span>
          </div>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-turquoise-500/20 flex items-center justify-center text-turquoise-400">
              <MessageCircleQuestion className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">Size Nasıl Yardımcı Olabiliriz?</h1>
          <p className="text-navy-300 text-lg">Müşterilerimizden en çok aldığımız soruların yanıtları.</p>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="max-w-3xl mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl border border-navy-100 p-6 lg:p-10 shadow-xl shadow-navy-900/5">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={cn(
                  "border rounded-2xl overflow-hidden transition-all duration-300",
                  openIndex === index ? "border-turquoise-300 bg-turquoise-50/30" : "border-navy-100 hover:border-navy-200"
                )}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                >
                  <span className={cn(
                    "font-bold pr-4 transition-colors",
                    openIndex === index ? "text-turquoise-700" : "text-navy-900"
                  )}>
                    {faq.q}
                  </span>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300",
                    openIndex === index ? "bg-turquoise-100 text-turquoise-600 rotate-180" : "bg-slate-100 text-navy-400"
                  )}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                <div 
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="p-5 pt-0 text-navy-600 text-sm leading-relaxed border-t border-transparent">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-navy-500 mb-4">Aradığınız cevabı bulamadınız mı?</p>
            <Link 
              href="/iletisim" 
              className="inline-flex items-center justify-center bg-navy-900 hover:bg-turquoise-600 text-white font-bold py-3 px-8 rounded-xl transition-all"
            >
              İletişime Geçin
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
