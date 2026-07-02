# Havuz Market (E-Ticaret Projesi)

Havuz Market, modern web teknolojileri ile geliştirilmiş, kullanıcı dostu ve yüksek performanslı bir e-ticaret platformudur. Bu proje, React ve Next.js öğrenen veya staj yapan geliştiricilerin modern bir uygulamanın nasıl yapılandırıldığını anlaması için harika bir referanstır.

## Kullanılan Teknolojiler
- **Next.js 14/15 (App Router)**: Sayfa yönlendirmeleri, Server-Side Rendering (SSR) ve SEO uyumluluğu için ana framework.
- **React 19**: Modern arayüz bileşenleri oluşturmak için kullanıldı.
- **Tailwind CSS**: Hızlı, responsive (mobil uyumlu) ve modern tasarımlar yapmak için stil kütüphanesi.
- **Zustand**: Sepet ve favoriler gibi global durum (state) yönetimi için, Redux'a kıyasla çok daha hafif ve pratik bir kütüphane.
- **Lucide React**: Projedeki tüm ikonların SVG tabanlı olarak kullanıldığı modern ikon kütüphanesi.

---

## Proje Klasör Yapısı
Proje, Next.js App Router mimarisine uygun olarak dizayn edilmiştir:

- `/src/app`: Uygulamanın sayfaları ve rotaları (routes) burada bulunur. Her klasör bir URL'i temsil eder (Örn: `/sepet` için `src/app/sepet/page.tsx`).
- `/src/components`: Tekrar kullanılabilir UI (Arayüz) bileşenlerini barındırır.
  - `/home`: Ana sayfaya özel (Slider, Hero vb.) bileşenler.
  - `/layout`: Her sayfada ortak olan Header (Üst Menü) ve Footer (Alt Menü) bileşenleri.
  - `/product`: Ürün kartları ve kategori filtreleme yan çubuğu (Sidebar) bileşenleri.
  - `/ui`: Basit ve ortak form elemanları (Input vb.).
- `/src/lib/store`: Zustand kullanarak sepet ve favori verilerinin tutulduğu alan (`useCart.ts`, `useFavorites.ts`).
- `/src/services`: Ürünler ve kategorilerle ilgili API veya sahte (mock) veri işlemlerinin yapıldığı dosyalar.

---

## Projeyi Yerelde Çalıştırma (Kurulum)

Projeyi kendi bilgisayarınızda çalıştırmak için terminalde şu komutları sırasıyla uygulayın:

1. **Bağımlılıkları Yükleme:**
   ```bash
   npm install
   ```
2. **Geliştirici Modunda (Development) Başlatma:**
   ```bash
   npm run dev
   ```
   *Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine giderek siteyi görebilirsiniz.*

3. **Hata Kontrolü (Linting):**
   Kod yazarken veya bitirdikten sonra kodunuzun kurallara uygunluğunu test etmek için:
   ```bash
   npm run lint
   ```
4. **Canlı Ortam İçin Derleme (Build):**
   Projeyi yayına almadan önce üretim optimizasyonunu test etmek için:
   ```bash
   npm run build
   ```

---

## Temel Sayfalar ve İşleyişleri

- **Ana Sayfa (`/`)**: Kampanyaların, slider'ların ve çok satan ürünlerin listelendiği vitrin sayfasıdır.
- **Kategoriler (`/kategori/[slug]`)**: Ürünlerin kategorilere (Havuz Robotu, Kimyasallar vb.) göre listelendiği alandır.
- **Arama (`/arama`)**: Arama çubuğuna yazılan metne (Türkçe karakter uyumlu) göre sonuç döndürür. Arama anında "Debounce" (300ms gecikme) kullanılarak gereksiz işlem engellenir.
- **Sepet (`/sepet`)**: Eklenen ürünlerin listelendiği, adetlerinin değiştirilebildiği ve toplam fiyatın hesaplandığı sayfadır.
- **Ödeme / Checkout (`/odeme`)**: Siparişin tamamlanması için kullanıcı bilgilerinin ve kredi kartının girildiği ekran.
- **Favoriler (`/favoriler`)**: Kullanıcının beğendiği ürünlerin (kalp ikonuna basarak) listelendiği sayfadır.

### Veri Yönetimi ve Sahte Veri (Dummy Data)
Sepet ve favorilere eklenen ürünler, tarayıcıyı kapatsanız bile kaybolmaz. Bunu `Zustand`'ın **localStorage** (persist) özelliği ile sağlarız.
Projeye henüz bir veritabanı (Backend) bağlanmadığı için `/src/services/mockData.json` içindeki sahte (dummy) veriler kullanılmaktadır.

### Ödeme Doğrulaması ve Animasyonlar
Ödeme sayfasındaki alanlarda, kullanıcı hatalarını önlemek için (validation) filtreler bulunur:
- Telefon numarası otomatik olarak `05XX XXX XX XX` şeklinde boşluklu formatlanır.
- Kredi kartı 4 hanede bir ayrılır. CVV alanına (kartın arkasındaki güvenlik kodu) tıklandığında kredi kartı 3D animasyon ile arkaya doğru döner (Card Flip Animasyonu).

---

## Vercel Üzerinde Yayına Alma (Deploy)

Proje Next.js olduğu için en sorunsuz yayın ortamı Vercel'dir.
1. Projenizi GitHub'a yükleyin.
2. [Vercel](https://vercel.com) adresine giderek GitHub hesabınızla giriş yapın.
3. "Add New Project" diyerek GitHub'daki deponuzu seçin.
4. "Deploy" butonuna basmanız yeterlidir. Vercel her şeyi otomatik ayarlayacaktır.

---

## Gelecek Geliştirmeler (Future Improvements)
Bu proje bir şablondur. Geliştirilmeye açık olan eksik kısımları (stajyerler için iyi birer bitirme projesi hedefi olabilir):
- **Backend & Veritabanı:** Ürünlerin Node.js, Express, Firebase veya Supabase ile gerçek bir veritabanından çekilmesi.
- **Kullanıcı Girişi (Authentication):** Müşterilerin üye olabilmesi, geçmiş siparişlerini görebilmesi (NextAuth / Auth.js).
- **Gerçek Ödeme Entegrasyonu:** İyzico, Stripe, PayTR gibi gerçek sanal POS sistemlerinin bağlanması.
- **Yönetim Paneli (Admin Panel):** Site sahibinin yeni ürün, kampanya resmi ve kategori ekleyebileceği gizli bir arayüz geliştirilmesi.
