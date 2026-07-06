import { Metadata } from "next";
import { Shield, MapPin, Phone, Mail, AlertTriangle } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: `Mesafeli Satış Sözleşmesi | ${siteConfig.name}`,
  description: "Mesafeli Satış Sözleşmesi şartları, iptal, iade ve teslimat koşulları.",
};

export default function SalesAgreementPage() {
  const lastUpdated = "01.07.2026";

  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-navy-100 text-navy-900 mb-6">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-navy-900 mb-4 tracking-tight">
            Mesafeli Satış Sözleşmesi
          </h1>
          <p className="text-navy-500 text-lg">
            Son Güncelleme: {lastUpdated}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-navy-100 prose prose-navy max-w-none prose-headings:font-black prose-headings:text-navy-900 prose-a:text-turquoise-500 hover:prose-a:text-turquoise-600 prose-p:text-navy-600 prose-li:text-navy-600">
          
          <h2>1. TARAFLAR</h2>
          <h3>1.1. SATICI BİLGİLERİ</h3>
          <ul>
            <li><strong>Ünvanı:</strong> {siteConfig.name}</li>
            <li><strong>Adresi:</strong> Modern Çarşı, Savaş Mahallesi, Mareşal Fevzi Çakmak Caddesi, 31200 İskenderun / Hatay, Türkiye</li>
            <li><strong>Telefon:</strong> 0539 130 22 14</li>
            <li><strong>E-posta:</strong> {siteConfig.email}</li>
          </ul>

          <h3>1.2. ALICI BİLGİLERİ</h3>
          <p>
            Alıcı; www.havuzmarket.com (bundan sonra "Site" olarak anılacaktır) üzerinden sipariş veren, 
            kişisel bilgilerini ve fatura detaylarını ödeme sayfasında belirten gerçek veya tüzel kişidir. 
            Alıcı'nın ödeme ekranında beyan ettiği bilgiler temel alınır.
          </p>

          <h2>2. SÖZLEŞMENİN KONUSU VE KAPSAMI</h2>
          <p>
            İşbu sözleşmenin konusu, ALICI'nın SATICI'ya ait site üzerinden elektronik ortamda siparişini yaptığı 
            ürünlerin satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve 
            Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin belirlenmesidir.
          </p>

          <h2>3. ÜRÜN VE SİPARİŞ BİLGİLERİ</h2>
          <p>
            Sözleşme konusu malın veya hizmetin temel özellikleri (türü, miktarı, marka/modeli, rengi ve tüm vergiler dâhil satış bedeli) 
            SATICI'nın internet sitesinde yer almaktadır. Sipariş tamamlandığında oluşan elektronik fatura veya 
            sipariş onay e-postası işbu sözleşmenin ayrılmaz bir parçasıdır.
          </p>

          <h2>4. ÖDEME VE TESLİMAT BİLGİLERİ</h2>
          <p>
            Sitede ilan edilen fiyatlar satış fiyatıdır. İlan edilen fiyatlar ve vaatler güncelleme yapılana ve 
            değiştirilene kadar geçerlidir. Süreli olarak ilan edilen fiyatlar ise belirtilen süre sonuna kadar geçerlidir.
          </p>
          <ul>
            <li>Siparişin kesinleşmesi için kredi kartı, banka kartı veya havale/EFT yöntemlerinden biri ile tam ödemenin yapılması şarttır.</li>
            <li>Sipariş tutarına yansıyan kargo ücretleri (varsa) Alıcı tarafından ödenir. 1000 TL ve üzeri alışverişlerde kargo bedelsizdir.</li>
          </ul>

          <h2>5. SEVKİYAT VE TESLİMAT KOŞULLARI</h2>
          <p>
            SATICI, sipariş konusu ürün veya hizmetin ifasının imkânsızlaşması hali saklı kalmak kaydıyla, 
            sözleşme konusu ürünü yasal 30 günlük süreyi aşmamak koşulu ile Alıcı'nın gösterdiği adresteki kişi/kuruluşa teslim eder.
            Tahmini teslimat süreleri ürün sayfasında belirtildiği gibidir ve olağanüstü hava koşulları, mücbir sebepler vb. durumlarda bu süre uzayabilir.
          </p>

          <h2>6. CAYMA HAKKI VE İPTAL KOŞULLARI</h2>
          <p>
            ALICI, sözleşme konusu ürünün kendisine veya gösterdiği adresteki kişi/kuruluşa tesliminden itibaren 14 (on dört) gün 
            içinde hiçbir gerekçe göstermeksizin ve cezai şart ödemeksizin cayma hakkını kullanabilir.
          </p>
          <p>Cayma hakkının kullanılabilmesi için:</p>
          <ul>
            <li>Bu süre içinde SATICI'ya yazılı olarak bildirimde bulunulması,</li>
            <li>Ürünün ambalajının açılmamış, kullanılmamış ve yeniden satılabilir özelliğini yitirmemiş olması gerekmektedir.</li>
            <li>Açılmış veya kullanılmış havuz kimyasalları ve elektronik cihazların (filtre, pompa vb. su ile temas etmiş) iadesi sağlık, hijyen ve teknik nedenlerle kabul edilmemektedir.</li>
          </ul>

          <h2>7. GİZLİLİK VE KİŞİSEL VERİLERİN KORUNMASI</h2>
          <p>
            ALICI tarafından işbu sözleşmede belirtilen bilgiler ile ödeme yapmak amacı ile SATICI'ya bildirdiği bilgiler 
            SATICI tarafından 3. şahıslarla paylaşılmayacaktır. Bu veriler sadece siparişin işlenmesi ve teslimatı 
            için lojistik/kargo firmaları ile paylaşılır. Detaylı bilgi için Gizlilik Politikası sayfamızı inceleyebilirsiniz.
          </p>

          <h2>8. İLETİŞİM VE DESTEK</h2>
          <p>
            ALICI, talep ve şikayetlerini SATICI'nın aşağıda belirtilen iletişim kanallarına iletebilir:
          </p>
          <div className="bg-navy-50 rounded-2xl p-6 not-prose my-6 border border-navy-100">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Phone className="w-4 h-4 text-turquoise-500" />
                </div>
                <div>
                  <p className="text-xs text-navy-500 font-medium">Telefon</p>
                  <p className="text-navy-900 font-semibold">{siteConfig.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Mail className="w-4 h-4 text-turquoise-500" />
                </div>
                <div>
                  <p className="text-xs text-navy-500 font-medium">E-posta</p>
                  <p className="text-navy-900 font-semibold">{siteConfig.email}</p>
                </div>
              </div>
              <div className="flex gap-3 sm:col-span-2">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                  <MapPin className="w-4 h-4 text-turquoise-500" />
                </div>
                <div>
                  <p className="text-xs text-navy-500 font-medium">Adres</p>
                  <p className="text-navy-900 font-semibold">
                    Modern Çarşı, Savaş Mahallesi, Mareşal Fevzi Çakmak Caddesi,<br />
                    31200 İskenderun / Hatay, Türkiye
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-amber-50 rounded-2xl p-6 border border-amber-200 not-prose">
            <div className="flex gap-3 items-start">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-900 mb-1">Geliştirici Notu</h4>
                <p className="text-sm text-amber-800 leading-relaxed">
                  Bu sözleşme metni taslak niteliğinde olup, projenin canlı ortama (production) alınmasından önce 
                  mutlaka uzman bir hukuk danışmanı veya avukat tarafından incelenmeli, firmanın güncel ticari ve hukuki 
                  ihtiyaçlarına göre revize edilmelidir.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
