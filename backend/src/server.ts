/**
 * server.ts — Backend uygulamasının ana giriş noktası.
 *
 * Bu dosya Express sunucusunu başlatır, middleware'leri tanımlar
 * ve tüm route'ları bir araya getirir.
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler.js';
import healthRoutes from './routes/health.js';
import categoryRoutes from './routes/categories.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';

// .env dosyasını oku
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// --- MIDDLEWARE ---

// CORS: Hangi frontend adreslerinden istek kabul edilecek
const allowedOrigins = (process.env.FRONTEND_ORIGINS || 'http://localhost:3000').split(',');
app.use(
  cors({
    origin: (origin, callback) => {
      // origin yoksa (Postman gibi araçlar) veya whitelist'teyse izin ver
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Bu adres CORS politikası tarafından engellendi.'));
      }
    },
  })
);

// Gelen JSON isteklerini otomatik parse et
app.use(express.json());

// --- ROUTE'LAR ---
app.use('/api/health', healthRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// 404 Handler — Bilinmeyen endpoint'ler için
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint bulunamadı: ${req.method} ${req.url}`,
  });
});

// Merkezi hata yönetimi (tüm route'lardan sonra olmalı)
app.use(errorHandler);

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`✅ Backend sunucusu çalışıyor: http://localhost:${PORT}`);
});
