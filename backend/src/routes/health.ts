/**
 * routes/health.ts — Sunucu sağlık kontrolü.
 *
 * GET /api/health
 * Sunucunun ayakta olup olmadığını kontrol etmek için kullanılır.
 */

import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Havuz Market API çalışıyor.',
    timestamp: new Date().toISOString(),
  });
});

export default router;
