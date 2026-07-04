"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = (0, express_1.Router)();
// Custom random order code generator
const generateOrderCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "HM-";
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};
// Zod Schema for Order validation
const orderSchema = zod_1.z.object({
    customerName: zod_1.z.string().min(2, "Ad Soyad en az 2 karakter olmalıdır"),
    customerEmail: zod_1.z.string().email("Geçerli bir e-posta adresi giriniz"),
    customerPhone: zod_1.z.string().min(10, "Geçerli bir telefon numarası giriniz"),
    addressTitle: zod_1.z.string().optional().default("Ev"),
    addressLine1: zod_1.z.string().min(5, "Adres gerekli"),
    addressLine2: zod_1.z.string().optional(),
    district: zod_1.z.string().min(2, "İlçe gerekli"),
    city: zod_1.z.string().min(2, "Şehir gerekli"),
    postalCode: zod_1.z.string().min(5, "Posta kodu gerekli"),
    note: zod_1.z.string().optional(),
    paymentMethod: zod_1.z.enum(["CREDIT_CARD", "BANK_TRANSFER"]),
    items: zod_1.z.array(zod_1.z.object({
        productId: zod_1.z.string().uuid("Geçerli ürün ID'si gerekli"),
        quantity: zod_1.z.number().int().positive("Miktar 1 veya daha fazla olmalıdır"),
    })).min(1, "Sepetiniz boş olamaz"),
});
router.post("/", async (req, res, next) => {
    try {
        // 1. Validate request
        const validatedData = orderSchema.parse(req.body);
        // 2. Fetch products and check stock
        const productIds = validatedData.items.map((i) => i.productId);
        const dbProducts = await prisma_1.default.product.findMany({
            where: { id: { in: productIds }, isActive: true },
        });
        if (dbProducts.length !== productIds.length) {
            return res.status(400).json({ success: false, message: "Bazı ürünler bulunamadı veya pasif." });
        }
        // 3. Prepare order items and calculate totals
        let subtotalKurus = 0;
        const orderItemsToCreate = [];
        for (const item of validatedData.items) {
            const dbProduct = dbProducts.find((p) => p.id === item.productId);
            if (dbProduct.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Stok yetersiz: ${dbProduct.name}. Mevcut stok: ${dbProduct.stock}`
                });
            }
            const lineTotalKurus = dbProduct.priceKurus * item.quantity;
            subtotalKurus += lineTotalKurus;
            orderItemsToCreate.push({
                productId: dbProduct.id,
                productName: dbProduct.name,
                productSku: dbProduct.sku,
                imageUrl: dbProduct.imageUrls[0] || null,
                unitPriceKurus: dbProduct.priceKurus,
                quantity: item.quantity,
                lineTotalKurus,
            });
        }
        const freeShippingThreshold = parseInt(process.env.FREE_SHIPPING_THRESHOLD_KURUS || "100000", 10);
        const defaultShippingFee = parseInt(process.env.SHIPPING_FEE_KURUS || "14990", 10);
        const shippingKurus = subtotalKurus >= freeShippingThreshold ? 0 : defaultShippingFee;
        const totalKurus = subtotalKurus + shippingKurus;
        let orderCode = "";
        let isCodeUnique = false;
        // Generate unique order code
        while (!isCodeUnique) {
            orderCode = generateOrderCode();
            const existing = await prisma_1.default.order.findUnique({ where: { orderCode } });
            if (!existing)
                isCodeUnique = true;
        }
        // 4. Create Order and decrease stock in Transaction
        const order = await prisma_1.default.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    orderCode,
                    customerName: validatedData.customerName,
                    customerEmail: validatedData.customerEmail,
                    customerPhone: validatedData.customerPhone,
                    addressTitle: validatedData.addressTitle,
                    addressLine1: validatedData.addressLine1,
                    addressLine2: validatedData.addressLine2,
                    district: validatedData.district,
                    city: validatedData.city,
                    postalCode: validatedData.postalCode,
                    note: validatedData.note,
                    paymentMethod: validatedData.paymentMethod,
                    paymentStatus: "PAID", // Dummy flow auto-approves
                    status: "PROCESSING",
                    subtotalKurus,
                    shippingKurus,
                    totalKurus,
                    items: {
                        create: orderItemsToCreate,
                    },
                },
            });
            // Decrease stock
            for (const item of validatedData.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } },
                });
            }
            return newOrder;
        });
        res.json({
            success: true,
            data: {
                orderCode: order.orderCode,
                status: order.status,
                paymentStatus: order.paymentStatus,
                totalKurus: order.totalKurus,
            }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
