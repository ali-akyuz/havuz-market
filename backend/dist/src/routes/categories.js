"use strict";
/**
 * routes/categories.ts — Kategori listesi.
 *
 * GET /api/categories
 * Tüm kategorileri döndürür. Frontend navigasyon menüsü için kullanılır.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_js_1 = __importDefault(require("../lib/prisma.js"));
const router = (0, express_1.Router)();
router.get('/', async (req, res, next) => {
    try {
        const categories = await prisma_js_1.default.category.findMany({
            orderBy: { name: 'asc' }, // Alfabetik sırala
        });
        res.json({ success: true, data: categories });
    }
    catch (error) {
        next(error); // Hataları merkezi error handler'a ilet
    }
});
exports.default = router;
