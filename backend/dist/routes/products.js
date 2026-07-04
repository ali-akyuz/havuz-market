"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = (0, express_1.Router)();
router.get("/", async (req, res, next) => {
    try {
        const { page = "1", limit = "20", q, category, brand, featured, bestseller, sort } = req.query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where = { isActive: true };
        if (q) {
            const search = q;
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { brand: { name: { contains: search, mode: "insensitive" } } },
            ];
        }
        if (category)
            where.categoryId = category;
        if (brand)
            where.brandId = brand;
        if (featured === "true")
            where.isFeatured = true;
        if (bestseller === "true")
            where.isBestseller = true;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let orderBy = { createdAt: "desc" };
        if (sort === "price_asc")
            orderBy = { priceKurus: "asc" };
        if (sort === "price_desc")
            orderBy = { priceKurus: "desc" };
        if (sort === "rating")
            orderBy = { rating: "desc" };
        if (sort === "newest")
            orderBy = { createdAt: "desc" };
        const products = await prisma_1.default.product.findMany({
            where,
            orderBy,
            skip,
            take: limitNum,
            include: {
                category: true,
                brand: true,
            },
        });
        const total = await prisma_1.default.product.count({ where });
        res.json({
            success: true,
            data: products,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum),
            },
        });
    }
    catch (error) {
        next(error);
    }
});
router.get("/:slug", async (req, res, next) => {
    try {
        const { slug } = req.params;
        const product = await prisma_1.default.product.findUnique({
            where: { slug, isActive: true },
            include: {
                category: true,
                brand: true,
            },
        });
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.json({ success: true, data: product });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
