"use strict";
/**
 * routes/products.ts — Ürün listeleme ve detay.
 *
 * GET /api/products          → Tüm ürünleri listeler
 * GET /api/products?q=robot  → Ürün adına göre arama
 * GET /api/products?category=havuz-robotlari → Kategoriye göre filtrele
 * GET /api/products/:slug    → Tekil ürün detayı
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_js_1 = __importDefault(require("../lib/prisma.js"));
const router = (0, express_1.Router)();
// GET /api/products
router.get('/', async (req, res, next) => {
    try {
        const { q, category } = req.query;
        // Veritabanı filtreleme koşullarını dinamik olarak oluşturuyoruz
        const where = { isActive: true };
        // Arama terimi varsa ürün adında ara (büyük/küçük harf duyarsız)
        if (q && typeof q === 'string') {
            where.name = { contains: q, mode: 'insensitive' };
        }
        // Kategori slug'ı varsa o kategoriye ait ürünleri getir
        if (category && typeof category === 'string') {
            where.category = { slug: category };
        }
        const products = await prisma_js_1.default.product.findMany({
            where,
            include: {
                category: true, // Kategori bilgisini de getir (join)
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json({ success: true, data: products });
    }
    catch (error) {
        next(error);
    }
});
// GET /api/products/:slug
router.get('/:slug', async (req, res, next) => {
    try {
        const { slug } = req.params;
        const product = await prisma_js_1.default.product.findUnique({
            where: { slug },
            include: { category: true },
        });
        // Ürün bulunamazsa 404 döndür
        if (!product || !product.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Ürün bulunamadı.',
            });
        }
        res.json({ success: true, data: product });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
