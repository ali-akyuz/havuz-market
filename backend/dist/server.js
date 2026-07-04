"use strict";
/**
 * server.ts — Backend uygulamasının ana giriş noktası.
 *
 * Bu dosya Express sunucusunu başlatır, middleware'leri tanımlar
 * ve tüm route'ları bir araya getirir.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorHandler_js_1 = require("./middleware/errorHandler.js");
const health_js_1 = __importDefault(require("./routes/health.js"));
const categories_js_1 = __importDefault(require("./routes/categories.js"));
const products_js_1 = __importDefault(require("./routes/products.js"));
const orders_js_1 = __importDefault(require("./routes/orders.js"));
// .env dosyasını oku
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// --- MIDDLEWARE ---
// CORS: Tüm frontend adreslerine izin ver (Stajyer projesi olduğu için esnek tutuyoruz)
app.use((0, cors_1.default)());
// Gelen JSON isteklerini otomatik parse et
app.use(express_1.default.json());
// --- ROUTE'LAR ---
app.use('/api/health', health_js_1.default);
app.use('/api/categories', categories_js_1.default);
app.use('/api/products', products_js_1.default);
app.use('/api/orders', orders_js_1.default);
// 404 Handler — Bilinmeyen endpoint'ler için
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Endpoint bulunamadı: ${req.method} ${req.url}`,
    });
});
// Merkezi hata yönetimi (tüm route'lardan sonra olmalı)
app.use(errorHandler_js_1.errorHandler);
// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`✅ Backend sunucusu çalışıyor: http://localhost:${PORT}`);
});
