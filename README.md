# Havuz Market E-Ticaret Projesi 🏊‍♂️

Merhaba! Bu proje staj dönemi çalışmam kapsamında geliştirdiğim "Havuz Market" e-ticaret uygulamasıdır. Projede modern web teknolojilerini kullanarak baştan uca (Full-Stack) bir e-ticaret deneyimi sunmayı hedefledim.

## 🛠 Kullanılan Teknolojiler

**Frontend (Önyüz):**
* **Next.js 14** (App Router mimarisi)
* **React** (Server Components & Client Components ayrımı)
* **Tailwind CSS** (Hızlı ve responsive tasarım için)
* **Zustand** (Sepet ve Favoriler state yönetimi için - Redux'a daha hafif bir alternatif olarak seçtim)
* **Lucide React** (İkonlar)

**Backend (Arkayüz) & Veritabanı:**
* **Node.js & Express.js** (RESTful API geliştirmek için)
* **Prisma ORM** (Veritabanı işlemleri ve tip güvenliği için)
* **PostgreSQL (Neon)** (İlişkisel veritabanı olarak)
* **Zod** (API'ye gelen verilerin doğrulanması için)

## 📂 Proje Mimarisi

Proje iki ana klasörden oluşmaktadır:
1. **Ana Dizin (Frontend):** Kullanıcı arayüzü ve Next.js kodları burada yer alır. Sadece UI işlerinden ve backend API'sine istek atmaktan sorumludur.
2. **`/backend` Dizini:** Express.js sunucusu, Prisma şemaları ve REST API rotaları burada çalışır. Veritabanı ile sadece bu katman haberleşir (Güvenlik için).

*Ödeme ve Kullanıcı (Auth) sistemleri şimdilik tasarım (mockup) aşamasında bırakılmış olup, ürün kısımları (listeleme, filtreleme, detay) ve **Admin Paneli** tamamen fonksiyonel olarak arka plana (veritabanına) bağlı çalışmaktadır.*

## 🚀 Kurulum ve Çalıştırma

Projeyi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyebilirsiniz:

1. **Gerekli Paketlerin Yüklenmesi**
   ```bash
   # Ana dizinde (Frontend) paketleri yükleyin
   npm install

   # Backend klasörüne geçip paketleri yükleyin
   cd backend
   npm install
   ```

2. **Çevre Değişkenleri (.env)**
   * `backend` klasörünün içinde bir `.env` dosyası oluşturun ve Neon PostgreSQL veritabanı url'nizi ekleyin:
     `DATABASE_URL="postgresql://kullanici_adi:sifre@ep-...neon.tech/neondb"`
   * Ana dizinde (Frontend) `.env.local` oluşturun:
     `NEXT_PUBLIC_API_URL="http://localhost:4000/api"`

3. **Veritabanını Hazırlama**
   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   # Opsiyonel: Test verilerini (ürünler ve kategoriler) yüklemek için
   npm run seed
   ```

4. **Projeyi Başlatma**
   Tek bir terminal penceresinden hem frontend'i hem de backend'i aynı anda çalıştırmak için ana dizine dönüp şu komutu kullanabilirsiniz:
   ```bash
   npm run dev:all
   ```
   * Frontend: `http://localhost:3000`
   * Backend API: `http://localhost:4000`
   * Yönetici (Admin) Paneli: `http://localhost:3000/admin`

## 💳 Ödeme Entegrasyonu

Bu proje iki ödeme modunu destekler:

| Mod | Açıklama |
|-----|----------|
| `mock` | **Demo/Geliştirme modu.** PayTR credentials gerekmez. Staj ve sunum için idealdir. |
| `paytr` | **Gerçek PayTR iFrame ödemesi.** Merchant credentials zorunludur. |

### Mod Seçimi (`backend/.env`)

```env
# Demo/gelistirme (varsayilan):
PAYMENT_MODE=mock

# Gercek PayTR odeme:
PAYMENT_MODE=paytr
```

---

### 🧪 Mock Mod (Staj / Demo / Geliştirme)

PayTR merchant bilgileriniz olmadan tüm ödeme akışını test edebilirsiniz.

**Ne yapar?**
- PayTR API'sine istek atmaz
- `/payment/[orderCode]` sayfasında iki buton gösterir:
  - ✅ **Başarılı Ödemeyi Simüle Et** → Sipariş `PAID + PROCESSING`, stok düşer
  - ❌ **Başarısız Ödemeyi Simüle Et** → Sipariş `FAILED + CANCELLED`, stok düşmez
- Tüm işlemler backend'de veritabanına yansır (gerçek akışla aynı mantık)
- Aynı sipariş iki kez başarılı olarak simüle edilirse stok tekrar düşmez (idempotent)

**Mock mod kurulumu:**
```bash
# backend/.env
PAYMENT_MODE=mock
# PayTR değişkenlerine gerek yok
```

```bash
cd backend && npm run dev
# Çıkti: 💳 Odeme modu: MOCK (demo/gelistirme)
```

---

### 💰 PayTR Gerçek Mod

Gerçek PayTR iFrame ödemesi için:

1. **PayTR merchant panelinden bilgileri alın:**  
   https://merchant.paytr.com → İşyeri Bilgileri

2. **`backend/.env` dosyasını doldurun:**

```env
PAYMENT_MODE=paytr

PAYTR_MERCHANT_ID=buraya_merchant_id
PAYTR_MERCHANT_KEY=buraya_merchant_key
PAYTR_MERCHANT_SALT=buraya_merchant_salt

PAYTR_TEST_MODE=1        # Test modunda 1, canlıda 0
PAYTR_DEBUG_ON=1         # Hata detayları (canlıda 0 yapın)
PAYTR_NO_INSTALLMENT=0
PAYTR_MAX_INSTALLMENT=0
PAYTR_CURRENCY=TL
PAYTR_LANG=tr

FRONTEND_URL=http://localhost:3000

# PayTR callback localhost'a ulasamaz — ngrok gereklidir:
# ngrok http 4000  →  asagidaki URL'yi kopyala
BACKEND_PUBLIC_URL=https://xxxx.ngrok.io
```

3. **Callback URL için ngrok:**
```bash
ngrok http 4000
# Cikan https://xxxx.ngrok.io adresini BACKEND_PUBLIC_URL'ye yaz
```

---

### Ödeme Akışı

```
Sepet → /odeme (adres) → POST /api/orders
     → /payment/{orderCode}
          ├── mock mod:  Demo butonlar → /api/payments/mock/success veya /fail
          └── paytr mod: PayTR iFrame → PayTR callback → /api/paytr/callback
     → /payment/success?orderCode=...  (basarili)
     → /payment/fail?orderCode=...     (basarisiz)
```

### Test Senaryoları

| Senaryo | Beklenen Sonuç |
|---------|----------------|
| Sipariş oluştur | `orderCode` döner, `paymentStatus=WAITING_PAYMENT` |
| Mock başarılı | `status=PROCESSING`, `paymentStatus=PAID`, stok düşer |
| Mock başarısız | `status=CANCELLED`, `paymentStatus=FAILED`, stok düşmez |
| Aynı mock 2 kez | 2. istekte stok tekrar düşmez (idempotent) |
| PayTR başarılı callback | Hash doğrulama → PAID, stok düşer |
| PayTR geçersiz hash | Sipariş güncellenmez, `OK` döner |
| PAYMENT_MODE=paytr + eksik credentials | Açık hata mesajı döner |

## 💡 Neler Öğrendim?
Bu projeyi yaparken; bir API'nin (Express) frontend (Next.js) ile nasıl haberleştiğini, ORM (Prisma) kullanarak veritabanı tablolarının nasıl yönetildiğini ve karmaşık form yapılarında state (Zustand) yönetiminin nasıl yapıldığını deneyimleme fırsatım oldu. Admin panelinde yazdığım CRUD işlemleri sayesinde arka plan mantığını pekiştirdim. PayTR entegrasyonuyla gerçek dünya ödeme akışlarını, HMAC-SHA256 güvenlik kontrollerini ve idempotent callback işlemeyi de öğrendim.


