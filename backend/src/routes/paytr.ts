/**
 * routes/paytr.ts — PayTR iFrame Odeme Endpoint'leri
 *
 * Bu dosya iki endpoint icerir:
 *
 *   POST /api/paytr/token
 *     Frontend bu endpoint'i cagirarak PayTR'den bir "token" alir.
 *     Token ile birlikte kullanicinin tarayicisinda gosterilecek iFrame URL'si doner.
 *     Sadece PAYMENT_MODE=paytr oldugunda aktiftir.
 *
 *   POST /api/paytr/callback
 *     Kullanici odeme yaptiktan sonra PayTR bu endpoint'i otomatik cagirır.
 *     Bu istek PayTR'nin sunuculasindan gelir (tarayiciden degil!).
 *     Odemenin gercekten basarili olup olmadigini buradan ogreniriz.
 *
 * GUVENLIK NOTLARI (bunlari ogrenip anlatabildiyseniz mulakatda ise yarar!):
 *
 * - Callback'te gelen hash'i dogruluyoruz. Eger hash yanliiysa siparis guncellenmez.
 *   Bu, birinin sahte bir "odeme basarili" istegi gonderememesini saglar.
 *
 * - Ayni callback iki kez gelebilir (PayTR bunu belirtmistir). Bunu onlemek icin
 *   siparisIN durumunu kontrol edip zaten islendiyse tekrar stok dusturmuyoruz.
 *   Bu ozellge "idempotency" denir — ayni islemin tekrari ayni sonucu verir.
 *
 * - merchant_key ve merchant_salt console'a yazilmaz. Bunlari loglardan goren
 *   biri sistemi taklit edebilir.
 */

import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import prisma from '../lib/prisma.js';
import { createPayTRToken } from '../services/paytr.js';

const router = Router();

// ─── POST /api/paytr/token ───────────────────────────────────────────────────
// Frontend bu endpoint'i cagirarak PayTR iFrame'ini baslatir.
// Basarili olursa { token, iframeUrl } doner.
router.post('/token', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Once hangi odeme modunda oldugumuzU kontrol ediyoruz.
    // Eger PAYMENT_MODE=mock ise bu endpoint calismamalidır —
    // mock modda /api/payments/mock/success|fail kullanilir.
    const paymentMode = (process.env.PAYMENT_MODE ?? 'mock').toLowerCase();
    if (paymentMode !== 'paytr') {
      return res.status(403).json({
        success: false,
        message: 'PayTR token endpoint\'i sadece PAYMENT_MODE=paytr modunda kullanilabilir. Demo icin PAYMENT_MODE=mock ayarlayın.',
      });
    }

    // PayTR credentials .env dosyasinda yoksa anlasılır hata ver.
    // Credentials olmadan PayTR API'sine istek atilsa zaten hata alınır,
    // ama bu kontrol sayesinde neyin eksik oldugunu acikca gorebiliriz.
    if (!process.env.PAYTR_MERCHANT_ID || !process.env.PAYTR_MERCHANT_KEY || !process.env.PAYTR_MERCHANT_SALT) {
      return res.status(500).json({
        success: false,
        message: 'PayTR merchant bilgileri eksik. backend/.env dosyasina PAYTR_MERCHANT_ID, PAYTR_MERCHANT_KEY ve PAYTR_MERCHANT_SALT degerlerini eklemeniz gerekiyor.',
      });
    }

    const { orderCode } = req.body as { orderCode?: string };

    if (!orderCode || typeof orderCode !== 'string') {
      return res.status(400).json({ success: false, message: 'orderCode gonderilmemis.' });
    }

    // Siparisi veritabanından getiriyoruz.
    // include: { items: true } ile siparis kalemleri de birlikte gelir.
    const order = await prisma.order.findUnique({
      where: { orderCode },
      include: { items: true },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Siparis bulunamadi.' });
    }

    // Zaten odenmis bir siparis icin tekrar token olusturmak mantıksiz.
    if (order.paymentStatus === 'PAID') {
      return res.status(409).json({
        success: false,
        message: 'Bu siparis zaten odendi. Tekrar odeme yapılamaz.',
      });
    }

    // Iptal edilmis siparisler icin de token olusturmayalim.
    if (order.paymentStatus === 'FAILED' || order.status === 'CANCELLED') {
      return res.status(409).json({
        success: false,
        message: 'Bu siparisın odemesi basarisiz oldu veya iptal edildi.',
      });
    }

    // Kullanicinin IP adresini aliyoruz. PayTR bunu dolandiricilik onlemek icin kullanir.
    // x-forwarded-for: Proxy arkasinda da gercek IP'yi almak icin kontrol ediyoruz.
    const customerIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      '127.0.0.1';

    // Siparis kalemlerini PayTR'nin bekledigI formata donustUrUyoruz.
    // Veritabanındaki fiyatlar KURUS cinsinden; PayTR sepette TL istiyor.
    // Bu yuzden / 100 ile TL'ye cevirip "1500.00" formatina getiriyoruz.
    const basketItems = order.items.map((item) => ({
      name:     item.productName.slice(0, 64), // PayTR urun adinda max 64 karakter kabul eder
      price:    (item.unitPriceKurus / 100).toFixed(2), // Kurus → TL (orn: 150000 → "1500.00")
      quantity: item.quantity,
    }));

    // PayTR token servisini cagiriyoruz (services/paytr.ts)
    const result = await createPayTRToken({
      orderCode:     order.orderCode,
      totalKurus:    order.totalKurus, // Kurus cinsinden gonderiyoruz, servis icinde de * 100 YAPILMIYOR
      customerName:  order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      address:       order.address,
      customerIp,
      basketItems,
    });

    // Siparise "PAYTR ile odeme baslatildi" bilgisini kaydediyoruz.
    // Bu sayede hangi siparisin hangi odeme sistemiyle baslangildigi takip edilebilir.
    if (!order.paymentProvider) {
      await prisma.order.update({
        where: { orderCode },
        data: { paymentProvider: 'PAYTR' },
      });
    }

    return res.json({
      success: true,
      data: {
        token:     result.token,
        iframeUrl: result.iframeUrl, // Frontend bu URL'yi iFrame src'ye koyacak
      },
    });
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/paytr/callback ─────────────────────────────────────────────────
// PayTR, kullanici odeme yaptiktan sonra bu endpoint'i otomatik olarak cagirır.
// Bu istek KULLANICININ tarayicindan degil, PAYTR'NIN SUNUCULARINDAN gelir.
// Bu yuzden session veya authentication gerektirmiyor.
// PayTR plain text "OK" yaniti bekliyor — JSON gonderirsek hata olabilir!
router.post('/callback', async (req: Request, res: Response) => {
  try {
    // PayTR callback'i "application/x-www-form-urlencoded" olarak gonderir.
    // express.urlencoded() middleware'i sayesinde req.body'de erisebiliyoruz.
    const {
      merchant_oid,       // Bizim siparis kodum (HM-XXXXXXXX)
      status,             // "success" ya da "failed"
      total_amount,       // PayTR'nin onayladigi tutar (kurus cinsinden)
      hash,               // PayTR'nin gonderdigi guvenlik hash'i
      failed_reason_code, // Basarisizsa hata kodu
      failed_reason_msg,  // Basarisizsa hata aciklamasi
      payment_type,       // Odeme yontemi (kredi karti, vb.)
      currency,
    } = req.body as Record<string, string>;

    const merchantKey  = process.env.PAYTR_MERCHANT_KEY!;
    const merchantSalt = process.env.PAYTR_MERCHANT_SALT!;

    // ── HASH DOGRULAMA ──────────────────────────────────────────────────────
    // PayTR guvenligi icin callback'e bir hash ekler. Bu hash'i biz de
    // kendi tarafimizda hesaplayip karsilastiriyoruz.
    // Eger eslesirse istek gercekten PayTR'den gelmistir.
    // Eslesmiyor ise biri bize sahte bir "odeme basarili" istegi gondermeye calisiyor olabilir!
    //
    // Hash hesaplama: merchant_oid + merchant_salt + status + total_amount
    // → HMAC-SHA256(merchant_key) → Base64
    const hashStr      = merchant_oid + merchantSalt + status + total_amount;
    const expectedHash = crypto
      .createHmac('sha256', merchantKey)
      .update(hashStr)
      .digest('base64');

    if (expectedHash !== hash) {
      // Hash eslesmiyor → guvenlik ihlali girisimi olabilir.
      // Siparisi guncellemiyor, yine de "OK" donuyoruz (PayTR protokolu).
      // "OK" donmezser PayTR ayni callback'i tekrar tekrar gonderir.
      console.warn(`[PayTR] Gecersiz hash. Bu istek PayTR'den gelmemis olabilir. merchant_oid=${merchant_oid}`);
      return res.send('OK');
    }

    // Siparisi veritabanindan buluyoruz
    const order = await prisma.order.findUnique({
      where: { orderCode: merchant_oid },
      include: { items: true },
    });

    if (!order) {
      console.warn(`[PayTR] Callback geldi ama siparis bulunamadi. merchant_oid=${merchant_oid}`);
      return res.send('OK');
    }

    // ── IDEMPOTENCY KONTROLU ────────────────────────────────────────────────
    // PayTR ayni callback'i birden fazla gonderebilir (bunu PayTR dokumantasyonunda belirtiyor).
    // Eger siparis zaten islendiyse tekrar islemiyoruz.
    // Bu sayede stok iki kez dusmuyor, siparis durumu bozulmuyor.
    if (order.paymentStatus === 'PAID' || order.paymentStatus === 'FAILED') {
      return res.send('OK');
    }

    if (status === 'success') {
      // ── BASARILI ODEME ───────────────────────────────────────────────────
      // Hem stok dusumu hem de siparis guncelleme ayni "transaction" icerisinde yapiliyor.
      // Transaction: ya her ikisi de basarili olur, ya da hicbiri uygulanmaz.
      // Bu sayede "stok dusustu ama siparis guncellenmedi" gibi tutarsizliklar onlenir.
      await prisma.$transaction(async (tx) => {
        // Siparişteki her urunun stogunu azaltiyoruz.
        // Bu islem sadece basarili odeme sonrasi yapılıyor — siparis olusturulurken degil!
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }

        // Siparisi "odendi" olarak isaret ediyoruz
        await tx.order.update({
          where: { orderCode: merchant_oid },
          data: {
            paymentStatus:    'PAID',
            status:           'PROCESSING', // Artik hazirlanmaya baslayabilir
            paidAt:           new Date(),   // Odeme zamanini kaydediyoruz
            paytrTotalAmount: parseInt(total_amount, 10),
            paytrPaymentType: payment_type ?? null,
            paytrCurrency:    currency ?? null,
            paytrRaw:         req.body as object, // Debug icin tum callback verisini saklıyoruz
          },
        });
      });

      console.log(`[PayTR] Odeme basarili. Siparis guncellendi. orderCode=${merchant_oid}`);
    } else {
      // ── BASARISIZ ODEME ──────────────────────────────────────────────────
      // Stok dusulmez. Sadece siparis durumu guncellenir.
      await prisma.order.update({
        where: { orderCode: merchant_oid },
        data: {
          paymentStatus:         'FAILED',
          status:                'CANCELLED',
          paytrFailedReasonCode: failed_reason_code ?? null,
          paytrFailedReasonMsg:  failed_reason_msg  ?? null,
          paytrRaw:              req.body as object,
        },
      });

      console.log(
        `[PayTR] Odeme basarisiz. orderCode=${merchant_oid}, hata=${failed_reason_code}: ${failed_reason_msg}`
      );
    }

    // PayTR plain text "OK" bekliyor. Baska bir sey gondermeyin!
    return res.send('OK');
  } catch (error) {
    console.error('[PayTR] Callback islenirken bir hata olustu:', error);
    // Hata olsa bile PayTR'ye "OK" donuyoruz.
    // Donmezsek PayTR ayni callback'i tekrar tekrar gonderecektir.
    return res.send('OK');
  }
});

export default router;