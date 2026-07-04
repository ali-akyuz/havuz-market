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

## 💡 Neler Öğrendim?
Bu projeyi yaparken; bir API'nin (Express) frontend (Next.js) ile nasıl haberleştiğini, ORM (Prisma) kullanarak veritabanı tablolarının nasıl yönetildiğini ve karmaşık form yapılarında state (Zustand) yönetiminin nasıl yapıldığını deneyimleme fırsatım oldu. Admin panelinde yazdığım CRUD işlemleri sayesinde arka plan mantığını pekiştirdim.
