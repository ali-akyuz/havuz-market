/**
 * routes/orders.ts — Siparis Olusturma ve Sorgulama
 *
 * Bu dosya siparislerle ilgili tüm API endpoint'lerini içerir.
 *
 * GET  /api/orders/:orderCode  → Tek bir siparisin detaylarini getirir
 * POST /api/orders             → Yeni siparis olusturur
 *
 * NEDEN FRONTEND'DEN FIYAT KABUL ETMIYORUZ?
 * Kullanici tarayicidan istegi manipule edebilir (ornegin bir urunun fiyatini
 * 0 TL yaparak gondermek gibi). Bu yuzden fiyatlari her zaman veritabanindan
 * kendimiz hesapliyoruz. Bu web guvenligi acisindan temel bir kuraldır.
 *
 * NEDEN STOK SIPARIS OLUSTURULURKEN DUSURULMUYOR?
 * Kullanici siparisi olusturabilir ama odeme yapmayabilir.
 * Stok sadece odeme dogrulandiktan sonra dusurulmeli. Yoksa
 * hic odeme yapilmayan siparisler stogu tüketir.
 * Stok dususu: PayTR callback'i (routes/paytr.ts) veya
 *              mock basari endpoint'i (routes/payments.ts) tarafindan yapilir.
 */

import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const router = Router();

// Gelen siparis verisini dogrulayan Zod semasi.
// Zod bir validasyon kutuphanesidir: gelen veri bu tipte degilse otomatik hata verir.
// req.body'ye dogrudan guvenmek yerine bu kontrol sayesinde
// eksik veya hatali veri veritabanina ulasmadan engellenir.
const orderSchema = z.object({
  customerName:  z.string().min(2,  'Ad soyad en az 2 karakter olmali'),
  customerEmail: z.string().email('Gecerli bir e-posta adresi girin'),
  customerPhone: z.string().min(10, 'Gecerli bir telefon numarasi girin'),
  address:       z.string().min(10, 'Tam adres giriniz'),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, 'Gecersiz urun ID'),
        quantity:  z.number().int().positive('Miktar en az 1 olmali'),
      })
    )
    .min(1, 'Sepet bos olamaz'),
});

// Siparisler icin benzersiz kod uretir: HM-XXXXXXXX formatinda
// Neden rastgele? Siralı sayilar (1, 2, 3...) kullanırsak musteri
// siparis sayimizi tahmin edebilir. Rastgele kod bu bilgiyi gizler.
const generateOrderCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const randomPart = Array.from({ length: 8 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('');
  return `HM-${randomPart}`;
};

// GET /api/orders — Uyeye ait siparisleri listeler (Zorunlu Auth)
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
});

// POST /api/orders/guest-lookup — Misafir siparis takibi (orderCode + email gerekir)
router.post('/guest-lookup', async (req, res, next) => {
  try {
    const { orderCode, email } = req.body;
    if (!orderCode || !email) {
      return res.status(400).json({ success: false, message: 'Sipariş kodu ve e-posta zorunludur.' });
    }

    const order = await prisma.order.findFirst({
      where: { orderCode, customerEmail: email },
      include: { items: true },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Sipariş bulunamadı veya e-posta eşleşmiyor.' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/:orderCode — Siparis detaylarini getirir
// Hem odeme basari/basarisiz sayfalari hem de admin paneli bu endpoint'i kullanir.
router.get('/:orderCode', async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { orderCode: req.params.orderCode },
      include: { items: true }, // Siparis kalemleri de birlikte gelsin
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Siparis bulunamadi.',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        orderCode:     order.orderCode,
        status:        order.status,        // Siparis durumu: PENDING, PROCESSING, DELIVERED
        paymentStatus: order.paymentStatus, // Odeme durumu: WAITING_PAYMENT, PAID, FAILED
        paidAt:        order.paidAt,        // Ne zaman odendi (null ise henuz odenmedi)
        totalKurus:    order.totalKurus,
        subtotalKurus: order.subtotalKurus,
        shippingKurus: order.shippingKurus,
        customerName:  order.customerName,
        items: order.items.map((item) => ({
          productName:    item.productName,
          quantity:       item.quantity,
          lineTotalKurus: item.lineTotalKurus,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/orders — Yeni siparis olusturur
// Frontend'den sadece musteri bilgisi ve urun ID'leri + adetleri gelir.
// Fiyatlar, toplam ve kargo ucreti sunucu tarafinda hesaplanir.
router.post('/', optionalAuth, async (req, res, next) => {
  try {
    // 1. ADIM: Gelen veriyi Zod ile dogrula
    // Eger eksik alan varsa veya tip yanliş ise Zod hata firlatir,
    // errorHandler.ts bunu yakalar ve anlasilir bir mesaj doner.
    const data = orderSchema.parse(req.body);

    // 2. ADIM: Urun ID'leriyle veritabanindan gercek fiyatlari getir
    // Frontend'den gelen fiyatlara hic bakilmaz!
    const productIds = data.items.map((item) => item.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true }, // Sadece aktif urunler
    });

    // Gonderilen urun ID'lerinin hepsi veritabaninda bulunmali.
    // Biri bile eksikse (silinmis veya pasif urun) siparisi reddediyoruz.
    if (dbProducts.length !== productIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Sepetinizdeki bazi urunler artik mevcut degil.',
      });
    }

    // 3. ADIM: Stok kontrolu
    // Siparis olusturulmadan once her urun icin yeterli stok var mi kontrol et.
    for (const item of data.items) {
      const product = dbProducts.find((p) => p.id === item.productId)!;
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `"${product.name}" urunu icin yeterli stok yok. Mevcut stok: ${product.stock}`,
        });
      }
    }

    // 4. ADIM: Toplami sunucu tarafinda hesapla
    // Her siparis kalemi icin: birim fiyat × adet = satir toplami
    // Sonra tum satirlari toplayarak ara toplami buluyoruz.
    let subtotalKurus = 0;
    const orderItemsData = data.items.map((item) => {
      const product        = dbProducts.find((p) => p.id === item.productId)!;
      const lineTotalKurus = product.priceKurus * item.quantity;
      subtotalKurus       += lineTotalKurus;
      return {
        productId:      product.id,
        productName:    product.name,         // Urun adi degisirse bile o anki hali saklanir
        quantity:       item.quantity,
        unitPriceKurus: product.priceKurus,   // O anki birim fiyat
        lineTotalKurus,
      };
    });

    // Kargo ucreti hesaplama:
    // Belirli bir esigi gecen siparisler ucretsiz kargo kazanir.
    // Bu degerler .env'den okunur — koda sabit yazmak yerine cevres degiskeni
    // kullanmak, degerleri deploy yapmadan degistirmemizi saglar.
    const freeThreshold = parseInt(process.env.FREE_SHIPPING_THRESHOLD_KURUS || '100000', 10);
    const shippingFee   = parseInt(process.env.SHIPPING_FEE_KURUS || '14990', 10);
    const shippingKurus = subtotalKurus >= freeThreshold ? 0 : shippingFee;
    const totalKurus    = subtotalKurus + shippingKurus;

    // 5. ADIM: Benzersiz siparis kodu uret (HM-XXXXXXXX)
    const orderCode = generateOrderCode();

    // 6. ADIM: Siparisi veritabanina kaydet
    // ONEMLI: Stok burada DUSURULMEZ.
    // Stok dususu odeme onaylandiginda yapilir (callback veya mock endpoint).
    // Sebep: Siparis olusturup odeme yapmayanlar stogu tüketmemeli.
    const order = await prisma.order.create({
      data: {
        orderCode,
        userId:          req.user?.id || null, // Uye ise bagla, degilse misafir
        customerName:    data.customerName,
        customerEmail:   data.customerEmail,
        customerPhone:   data.customerPhone,
        address:         data.address,
        subtotalKurus,
        shippingKurus,
        totalKurus,
        status:          'PENDING',           // Odeme bekleniyor
        paymentProvider: 'PAYTR',             // Odeme saglayici (mock modda sonra MOCK olur)
        paymentStatus:   'WAITING_PAYMENT',   // Henuz odeme yapilmadi
        items: {
          create: orderItemsData,             // Siparis kalemleri de ayni anda olusturuluyor
        },
      },
    });

    // Basarili yanit: sadece frontend'in ihtiyac duydugu alanlar gonderiliyor
    res.status(201).json({
      success: true,
      data: {
        orderCode:   order.orderCode,  // Frontend bunu /payment/{orderCode} rotasina yonlendirmek icin kullanir
        status:      order.status,
        totalKurus:  order.totalKurus,
      },
    });
  } catch (error) {
    // Zod dogrulama hatalari veya veritabani hatalari buraya dusuyor.
    // errorHandler.ts bunlari isleyerek anlasilir mesaj doner.
    next(error);
  }
});

export default router;
