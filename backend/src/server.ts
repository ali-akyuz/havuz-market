/**
 * server.ts — Backend'in Ana Baslangic Noktasi
 *
 * Bu dosya projenin "kalbi" sayilabilir. Express sunucusunu burada
 * baslatiyoruz, ara yazilimlari (middleware) tanimliyoruz ve tum
 * route dosyalarini tek bir yerde birlestiriyoruz.
 *
 * Express'i ogrenirken su akisi aklinda tutmak kolaylastirir:
 *   Istek (Request) → Middleware → Route → Yanit (Response)
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler.js';
import healthRoutes from './routes/health.js';
import categoryRoutes from './routes/categories.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import paytrRoutes from './routes/paytr.js';
import paymentRoutes from './routes/payments.js';

// .env dosyasindaki gizli degerleri (API anahtarlari, veritabani URL'si)
// uygulama geneline yukler. Bu satirdan sonra process.env.XXX seklinde ulasabiliriz.
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
// Middleware'ler her istekten once calisir. Siralama onemlIdir!

// CORS: Tarayici guvenlik kuralları gereği, farkli porttan (3000) gelen
// frontend isteklerine izin vermemiz gerekiyor. Bu staj projesi oldugu icin
// tum adreslere izin verdik; production'da sadece kendi domaine kisitlanmali.
app.use(cors());

// Gelen isteklerin body'sini otomatik olarak JavaScript objesine donusturur.
// Bu olmazsa req.body hep undefined gelir.
app.use(express.json());

// PayTR bize odeme sonucunu "form verisi" (urlencoded) olarak gonderir,
// JSON degil. Bu middleware o formati da anlamamizi saglar.
app.use(express.urlencoded({ extended: true }));

// ─── ROUTE'LAR ────────────────────────────────────────────────────────────────
// Her route dosyasi kendi sorumlulugundaki endpointleri yonetir.
// Bu sekilde kod duzenlI ve okunakli kalir (Separation of Concerns prensibi).

app.use('/api/health', healthRoutes);        // Sunucu saglik kontrolu
app.use('/api/categories', categoryRoutes);  // Kategori islemleri
app.use('/api/products', productRoutes);     // Urun islemleri
app.use('/api/orders', orderRoutes);         // Siparis olusturma ve sorgulama
app.use('/api/paytr', paytrRoutes);          // PayTR iFrame token ve callback
app.use('/api/payment', paymentRoutes);      // GET /api/payment/config (mod bilgisi)
app.use('/api/payments', paymentRoutes);     // POST /api/payments/mock/success|fail

// Hicbir route eslesmezse 404 doner.
// Express'te bu tur "catch-all" handler'lar en sona yazilir.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint bulunamadi: ${req.method} ${req.url}`,
  });
});

// Herhangi bir route'dan next(error) cagrildisinda bu middleware devreye girer.
// Hata yonetimini tek bir yerde toplamak, kod tekrarini onler.
app.use(errorHandler);

// Sunucuyu baslat ve hangi modda calistigini terminale yaz.
// PAYMENT_MODE=mock → gercek odeme alinmaz, demo butonlar aktif
// PAYMENT_MODE=paytr → gercek PayTR iFrame devrede
app.listen(PORT, () => {
  const mode = (process.env.PAYMENT_MODE ?? 'mock').toLowerCase();
  console.log(`✅ Backend sunucusu calisıyor: http://localhost:${PORT}`);
  console.log(`💳 Odeme modu: ${mode.toUpperCase()} ${mode === 'mock' ? '(demo/gelistirme — gercek odeme alinmaz)' : '(gercek PayTR iFrame aktif)'}`);
});