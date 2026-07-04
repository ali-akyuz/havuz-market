"use strict";
/**
 * errorHandler.ts — Merkezi hata yönetimi middleware'i.
 *
 * Express'te bir route'dan next(error) çağrıldığında bu middleware devreye girer.
 * Zod doğrulama hatalarını ve genel sunucu hatalarını burada yakalayıp
 * düzenli bir JSON yanıtı döndürürüz.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const errorHandler = (err, req, res, _next) => {
    console.error('Sunucu hatası:', err);
    // Zod doğrulama hatası mı? (örn: eksik alan, yanlış format)
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            success: false,
            message: 'Gönderilen veriler geçersiz.',
            errors: err.issues.map((e) => ({
                field: e.path.join('.'),
                message: e.message,
            })),
        });
    }
    // Genel hata
    const message = err instanceof Error ? err.message : 'Sunucu hatası oluştu.';
    res.status(500).json({
        success: false,
        message,
    });
};
exports.errorHandler = errorHandler;
