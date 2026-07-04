/**
 * routes/orders.ts — Sipariş oluşturma.
 *
 * POST /api/orders
 *
 * GÜVENLİK KURALLARI:
 * - Frontend'den fiyat veya toplam tutarı ASLA kabul etmiyoruz.
 * - Fiyatları doğrudan veritabanından hesaplıyoruz.
 * - Kart bilgisi (numara, CVV, son kullanma) kesinlikle işlenmiyor.
 * - Sipariş kodu sunucuda üretilir (HM-XXXXXXXX).
 */

import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';

const router = Router();

// Gelen sipariş verisini doğrulayan Zod şeması
const orderSchema = z.object({
  customerName: z.string().min(2, 'Ad soyad en az 2 karakter olmalı'),
  customerEmail: z.string().email('Geçerli bir e-posta adresi girin'),
  customerPhone: z.string().min(10, 'Geçerli bir telefon numarası girin'),
  address: z.string().min(10, 'Tam adres giriniz'),
  items: z
    .array(
      z.object({
        productId: z.string().uuid('Geçersiz ürün ID'),
        quantity: z.number().int().positive('Miktar en az 1 olmalı'),
      })
    )
    .min(1, 'Sepet boş olamaz'),
});

// Benzersiz sipariş kodu üretir: HM-XXXXXXXX
const generateOrderCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const randomPart = Array.from({ length: 8 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('');
  return `HM-${randomPart}`;
};

// GET /api/orders/:orderCode
router.get('/:orderCode', async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { orderCode: req.params.orderCode },
      include: { items: true },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Sipariş bulunamadı.',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        orderCode: order.orderCode,
        status: order.status,
        totalKurus: order.totalKurus,
        subtotalKurus: order.subtotalKurus,
        shippingKurus: order.shippingKurus,
        customerName: order.customerName,
        items: order.items.map((item) => ({
          productName: item.productName,
          quantity: item.quantity,
          lineTotalKurus: item.lineTotalKurus,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/orders
router.post('/', async (req, res, next) => {
  try {
    // 1. Adım: Zod ile gelen veriyi doğrula
    const data = orderSchema.parse(req.body);

    // 2. Adım: Ürün ID'lerini topla ve veritabanından fiyatları getir
    const productIds = data.items.map((item) => item.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    // Tüm ürünler veritabanında mevcut mu?
    if (dbProducts.length !== productIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Sepetinizdeki bazı ürünler artık mevcut değil.',
      });
    }

    // 3. Adım: Stok kontrolü yap
    for (const item of data.items) {
      const product = dbProducts.find((p) => p.id === item.productId)!;
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `"${product.name}" ürünü için yeterli stok yok. Mevcut: ${product.stock}`,
        });
      }
    }

    // 4. Adım: Toplamları hesapla (SUNUCU TARAFI — frontend'e güvenme!)
    let subtotalKurus = 0;
    const orderItemsData = data.items.map((item) => {
      const product = dbProducts.find((p) => p.id === item.productId)!;
      const lineTotalKurus = product.priceKurus * item.quantity;
      subtotalKurus += lineTotalKurus;
      return {
        productId: product.id,
        productName: product.name, // Fiyat değişse bile sipariş anındaki adı sakla
        quantity: item.quantity,
        unitPriceKurus: product.priceKurus,
        lineTotalKurus,
      };
    });

    // Kargo hesaplama: Eşik değeri aşıldıysa ücretsiz
    const freeThreshold = parseInt(process.env.FREE_SHIPPING_THRESHOLD_KURUS || '100000', 10);
    const shippingFee = parseInt(process.env.SHIPPING_FEE_KURUS || '14990', 10);
    const shippingKurus = subtotalKurus >= freeThreshold ? 0 : shippingFee;
    const totalKurus = subtotalKurus + shippingKurus;

    // 5. Adım: Sipariş kodunu üret
    const orderCode = generateOrderCode();

    // 6. Adım: Prisma transaction ile sipariş oluştur + stokları düşür
    // Transaction: ya hepsi başarılı olur, ya da hiçbiri uygulanmaz.
    const order = await prisma.$transaction(async (tx) => {
      // Siparişi ve sipariş kalemlerini oluştur
      const newOrder = await tx.order.create({
        data: {
          orderCode,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          address: data.address,
          subtotalKurus,
          shippingKurus,
          totalKurus,
          status: 'PENDING',
          items: {
            create: orderItemsData,
          },
        },
      });

      // Her ürünün stok miktarını azalt
      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return newOrder;
    });

    // Başarılı yanıt — kart bilgisi içermez
    res.status(201).json({
      success: true,
      data: {
        orderCode: order.orderCode,
        status: order.status,
        totalKurus: order.totalKurus,
      },
    });
  } catch (error) {
    next(error); // Zod hataları ve DB hataları buradan yakalanır
  }
});

export default router;
