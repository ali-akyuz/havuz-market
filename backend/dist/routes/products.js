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
const zod_1 = require("zod");
const productSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Ürün adı gerekli'),
    slug: zod_1.z.string().min(1, 'Slug gerekli'),
    description: zod_1.z.string().optional().default(''),
    priceKurus: zod_1.z.number().int().positive('Fiyat 0\'dan büyük olmalı'),
    stock: zod_1.z.number().int().min(0, 'Stok eksi olamaz'),
    imageUrls: zod_1.z.array(zod_1.z.string()).default([]),
    isFeatured: zod_1.z.boolean().default(false),
    isActive: zod_1.z.boolean().default(true),
    categoryId: zod_1.z.string().uuid('Geçerli bir kategori seçin'),
});
// POST /api/products (Admin)
router.post('/', async (req, res, next) => {
    try {
        const validatedData = productSchema.parse(req.body);
        // Slug benzersiz olmalı
        const existing = await prisma_js_1.default.product.findUnique({ where: { slug: validatedData.slug } });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Bu slug zaten kullanılıyor.' });
        }
        const newProduct = await prisma_js_1.default.product.create({
            data: validatedData,
            include: { category: true },
        });
        res.status(201).json({ success: true, data: newProduct });
    }
    catch (error) {
        next(error);
    }
});
// PUT /api/products/:id (Admin)
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const validatedData = productSchema.parse(req.body);
        // Kendi id'si haricinde slug çakışması var mı?
        const existing = await prisma_js_1.default.product.findUnique({ where: { slug: validatedData.slug } });
        if (existing && existing.id !== id) {
            return res.status(400).json({ success: false, message: 'Bu slug başka bir ürün tarafından kullanılıyor.' });
        }
        const updatedProduct = await prisma_js_1.default.product.update({
            where: { id },
            data: validatedData,
            include: { category: true },
        });
        res.json({ success: true, data: updatedProduct });
    }
    catch (error) {
        next(error);
    }
});
// DELETE /api/products/:id (Admin)
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        await prisma_js_1.default.product.delete({
            where: { id },
        });
        res.json({ success: true, message: 'Ürün silindi.' });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
