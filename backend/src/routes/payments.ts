/**
 * routes/payments.ts — Odeme Modu Yapilandirmasi ve Demo (Mock) Endpoint'leri
 *
 * Bu dosya iki amaca hizmet eder:
 *
 *   1. GET /api/payment/config
 *      Frontend'e hangi odeme modunda oldugunu soyleyen endpoint.
 *      Boylece frontend PayTR iFrame mi, yoksa demo ekrani mi gostermeli bilir.
 *      ONEMLI: Bu endpoint sadece "mock" ya da "paytr" yazar — hicbir gizli bilgi ifsa edilmez.
 *
 *   2. POST /api/payments/mock/success
 *      POST /api/payments/mock/fail
 *      Staj / demo ortaminda gercek PayTR credentials olmadan odeme akisini test etmek icin.
 *      Sadece PAYMENT_MODE=mock iken calisir. Gercek odeme modunda 403 doner.
 *
 * STAJ NOTU:
 * Mock endpoint'ler gercek PayTR callback ile birebir ayni veritabani islemlerini yapar.
 * Yani "demo modunda calisiyor" desek de, veritabanindaki siparis durumu gercekten degisir,
 * stok gercekten dusuler ve idempotency kurallari aynen uygulanir.
 * Bu sayede gercek moda gectigimizde hicbir kod degisikligi gerekmez.
 */

import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

// PAYMENT_MODE cevres degiskenini oku; eger tanimlanmamissa "mock" kabul et.
// Boylece .env'e hic dokunmadan da proje mock modda calismaya devam eder.
const getPaymentMode = () =>
  (process.env.PAYMENT_MODE ?? 'mock').toLowerCase() as 'mock' | 'paytr';

// ─── GET /api/payment/config ─────────────────────────────────────────────────
// Frontend bu endpoint'i sayfa yuklenince cagirir.
// Donen "mode" degerine gore PayTR iFrame mi yoksa demo ekrani mi gosterilecegini belirler.
// Buradan sadece "mock" veya "paytr" kelimesi gider — API anahtari veya salt gitmez!
router.get('/config', (_req: Request, res: Response) => {
  res.json({ mode: getPaymentMode() });
});

// ─── Middleware: Mock modu zorunlulugu ───────────────────────────────────────
// Express'te middleware, bir route handler'dan once calistirilan fonksiyondur.
// Bu middleware, mock endpoint'lerin yalnizca PAYMENT_MODE=mock iken calismasini saglar.
// next() cagrilirsa istek devam eder; cagrilmazsa buraya takilir.
const requireMockMode = (req: Request, res: Response, next: NextFunction) => {
  if (getPaymentMode() !== 'mock') {
    return res.status(403).json({
      success: false,
      message: 'Bu endpoint sadece demo/gelistirme modunda (PAYMENT_MODE=mock) kullanilabilir. Gercek odeme icin PayTR callback beklenmeli.',
    });
  }
  next();
};

// ─── Yardimci fonksiyon: Siparisi odendi olarak isaretle ────────────────────
// Bu fonksiyon hem mock/success endpoint'i hem de ileride gerekirse baska
// yerler tarafindan kullanilabilir — kod tekrari onlemek icin ayirdik.
//
// Prisma transaction kullaniyoruz: ya her sey calisiyor (stok + siparis guncelleme),
// ya da hicbiri uygulanmiyor. Bu, veri tutarliligi acisindan cok onemlidir.
async function markOrderPaid(orderCode: string): Promise<{ alreadyPaid: boolean }> {
  const order = await prisma.order.findUnique({
    where: { orderCode },
    include: { items: true },
  });

  if (!order) throw new Error('Siparis bulunamadi.');

  // IDEMPOTENCY: Eger siparis zaten odendiyse ikinci cagri sessizce basari doner.
  // Bu sayede kullanici butona iki kez bassinda iki kez stok dusurulmez.
  if (order.paymentStatus === 'PAID') return { alreadyPaid: true };

  await prisma.$transaction(async (tx) => {
    // Her siparis kalemi icin stoku azaltiyoruz
    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // Siparisi "odendi + hazirlanıyor" durumuna alıyoruz
    await tx.order.update({
      where: { orderCode },
      data: {
        paymentProvider: 'MOCK',        // Odeme saglayici: demo mod
        paymentStatus:   'PAID',
        status:          'PROCESSING',  // Siparis artik hazirlanmaya baslayabilir
        paidAt:          new Date(),    // Odeme tarihini kaydet
      },
    });
  });

  return { alreadyPaid: false };
}

// ─── POST /api/payments/mock/success ─────────────────────────────────────────
// Demo modda "basarili odeme" simule eder.
// Gercek PayTR'nin basarili callback'iyle birebir ayni sonucu uretir.
router.post('/mock/success', requireMockMode, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderCode } = req.body as { orderCode?: string };

    if (!orderCode || typeof orderCode !== 'string') {
      return res.status(400).json({ success: false, message: 'orderCode gonderilmemis.' });
    }

    const { alreadyPaid } = await markOrderPaid(orderCode);

    // Terminalde hangi siparisin simule edildigini logluyor
    console.log(`[MOCK] Basarili odeme simule edildi. orderCode=${orderCode}, onceden_odemis=${alreadyPaid}`);

    return res.json({
      success: true,
      data: { orderCode, alreadyPaid },
      message: alreadyPaid
        ? 'Bu siparis zaten odenmis durumda, tekrar islenmedi.'
        : 'Demo basarili odeme islendi. Siparis PAID + PROCESSING durumuna guncellendi.',
    });
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/payments/mock/fail ────────────────────────────────────────────
// Demo modda "basarisiz odeme" simule eder.
// Stok dusurulmez; siparis FAILED + CANCELLED durumuna alinir.
router.post('/mock/fail', requireMockMode, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderCode } = req.body as { orderCode?: string };

    if (!orderCode || typeof orderCode !== 'string') {
      return res.status(400).json({ success: false, message: 'orderCode gonderilmemis.' });
    }

    const order = await prisma.order.findUnique({ where: { orderCode } });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Siparis bulunamadi.' });
    }

    // Zaten sonuclanan bir siparis icin idempotent don
    if (order.paymentStatus === 'PAID' || order.paymentStatus === 'FAILED') {
      return res.json({
        success: true,
        data: { orderCode },
        message: 'Siparis zaten bir sonuca ulasmis, tekrar islenmedi.',
      });
    }

    // Stok DUSURULMEZ — sadece siparis durumu guncellenir
    await prisma.order.update({
      where: { orderCode },
      data: {
        paymentProvider: 'MOCK',
        paymentStatus:   'FAILED',
        status:          'CANCELLED',
      },
    });

    console.log(`[MOCK] Basarisiz odeme simule edildi. orderCode=${orderCode}`);

    return res.json({
      success: true,
      data: { orderCode },
      message: 'Demo basarisiz odeme islendi. Siparis FAILED + CANCELLED durumuna guncellendi. Stok dusurulmedi.',
    });
  } catch (error) {
    next(error);
  }
});

export default router;