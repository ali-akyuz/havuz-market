"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const mockData_json_1 = __importDefault(require("../../src/services/mockData.json"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log("Seeding database...");
    // 1. Map Categories
    const categoryIds = new Map();
    for (const cat of mockData_json_1.default.categories) {
        const createdCat = await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: {
                name: cat.name,
                slug: cat.slug,
                description: cat.description,
                imageUrl: cat.image,
            }
        });
        categoryIds.set(cat.name, createdCat.id);
    }
    // 2. Map Brands
    const brandIds = new Map();
    const uniqueBrands = [...new Set(mockData_json_1.default.products.map(p => p.brand))];
    for (const brandName of uniqueBrands) {
        const slug = brandName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const createdBrand = await prisma.brand.upsert({
            where: { slug },
            update: {},
            create: {
                name: brandName,
                slug,
            }
        });
        brandIds.set(brandName, createdBrand.id);
    }
    // 3. Map Products
    for (const p of mockData_json_1.default.products) {
        // Generate sku based on slug
        const sku = `SKU-${p.slug.toUpperCase().substring(0, 8)}-${Math.floor(Math.random() * 1000)}`;
        const catId = categoryIds.get(p.category) || Array.from(categoryIds.values())[0];
        const brandId = brandIds.get(p.brand) || Array.from(brandIds.values())[0];
        // Determine booleans
        const isNew = p.badges.includes("Yeni Ürün");
        const isBestseller = p.badges.includes("Çok Satan");
        const isFeatured = p.badges.includes("Kampanya");
        await prisma.product.upsert({
            where: { slug: p.slug },
            update: {},
            create: {
                name: p.title,
                slug: p.slug,
                sku,
                shortDescription: p.shortDescription,
                description: p.description,
                specifications: p.technicalSpecs,
                priceKurus: Math.round(p.price * 100),
                compareAtPriceKurus: p.oldPrice ? Math.round(p.oldPrice * 100) : null,
                stock: p.stock,
                rating: p.rating,
                reviewCount: p.reviewCount,
                imageUrls: p.images,
                isNew,
                isBestseller,
                isFeatured,
                categoryId: catId,
                brandId: brandId,
            }
        });
    }
    console.log("Seeding complete!");
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
