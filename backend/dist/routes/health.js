"use strict";
/**
 * routes/health.ts — Sunucu sağlık kontrolü.
 *
 * GET /api/health
 * Sunucunun ayakta olup olmadığını kontrol etmek için kullanılır.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Havuz Market API çalışıyor.',
        timestamp: new Date().toISOString(),
    });
});
exports.default = router;
