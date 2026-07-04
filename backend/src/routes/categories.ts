/**
 * routes/categories.ts — Kategori listesi.
 *
 * GET /api/categories
 * Tüm kategorileri döndürür. Frontend navigasyon menüsü için kullanılır.
 */

import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }, // Alfabetik sırala
    });

    res.json({ success: true, data: categories });
  } catch (error) {
    next(error); // Hataları merkezi error handler'a ilet
  }
});

export default router;
