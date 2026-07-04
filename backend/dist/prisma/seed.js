"use strict";
/**
 * seed.ts — Veritabanını örnek verilerle doldurur.
 *
 * Bu dosya, frontendde statik olarak tanımlanmış ürün verilerini
 * gerçek veritabanına ekler. Bir kez çalıştırılır.
 *
 * Çalıştırma: npx prisma db seed
 */
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const fs_1 = require("fs");
const path_1 = require("path");
// tsx kendi env yüklemesi yapıyor, bizim .env dosyamızı manuel okuyoruz
try {
    const envPath = (0, path_1.resolve)(__dirname, '../.env');
    const envContent = (0, fs_1.readFileSync)(envPath, 'utf8');
    for (const line of envContent.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#'))
            continue;
        const eqIndex = trimmed.indexOf('=');
        if (eqIndex < 0)
            continue;
        const key = trimmed.slice(0, eqIndex).trim();
        const val = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, '');
        process.env[key] = val; // .env'den gelen değerle üzerine yaz
    }
}
catch {
    // .env bulunamazsa devam et
}
const DB_URL = process.env.DATABASE_URL;
if (!DB_URL || !DB_URL.startsWith('postgres')) {
    throw new Error(`Geçersiz DATABASE_URL: "${DB_URL}" — backend/.env dosyasını kontrol edin.`);
}
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Veritabanı seed işlemi başlatılıyor...');
    // 1. KATEGORİLERİ OLUŞTUR
    // upsert → varsa güncelle, yoksa oluştur (tekrar çalıştırılabilir)
    const robotlar = await prisma.category.upsert({
        where: { slug: 'havuz-robotlari' },
        update: {},
        create: { name: 'Havuz Robotları', slug: 'havuz-robotlari' },
    });
    const kimyasallar = await prisma.category.upsert({
        where: { slug: 'havuz-kimyasallari' },
        update: {},
        create: { name: 'Havuz Kimyasalları', slug: 'havuz-kimyasallari' },
    });
    const pompalar = await prisma.category.upsert({
        where: { slug: 'pompalar-filtreler' },
        update: {},
        create: { name: 'Pompalar & Filtreler', slug: 'pompalar-filtreler' },
    });
    const aydinlatma = await prisma.category.upsert({
        where: { slug: 'aydinlatma' },
        update: {},
        create: { name: 'Aydınlatma', slug: 'aydinlatma' },
    });
    const tuzlama = await prisma.category.upsert({
        where: { slug: 'tuz-klorinatorleri' },
        update: {},
        create: { name: 'Tuz Klorinörleri', slug: 'tuz-klorinatorleri' },
    });
    console.log('✅ Kategoriler oluşturuldu.');
    // 2. ÜRÜNLERİ OLUŞTUR
    const products = [
        {
            name: 'AquaBot Pro 3000 Havuz Robotu',
            slug: 'aquabot-pro-3000-havuz-robotu',
            description: 'Profesyonel havuz temizleme robotu. 5 saatte bir tam havuz taraması yapar. Zemin, duvar ve su hattı temizliği özelliklidir.',
            priceKurus: 1249900, // 12.499,00 TL
            stock: 15,
            imageUrls: ['/images/products/robot1.jpg'],
            isFeatured: true,
            categoryId: robotlar.id,
        },
        {
            name: 'HydroClean Plus Havuz Robotu',
            slug: 'hydroclean-plus-havuz-robotu',
            description: 'Akıllı navigasyon sistemi ile donatılmış havuz temizleme robotu. Wi-Fi bağlantısı ile uygulamadan kontrol edilebilir.',
            priceKurus: 1849900, // 18.499,00 TL
            stock: 8,
            imageUrls: ['/images/products/robot2.jpg'],
            isFeatured: false,
            categoryId: robotlar.id,
        },
        {
            name: 'PoolMaster Aktif Klor 50 kg',
            slug: 'poolmaster-aktif-klor-50-kg',
            description: 'Havuz suyu dezenfeksiyonu için kullanılan toz aktif klor. Yosun ve bakteri üremesini önler.',
            priceKurus: 249900, // 2.499,00 TL
            stock: 50,
            imageUrls: ['/images/products/chemicals1.jpg'],
            isFeatured: false,
            categoryId: kimyasallar.id,
        },
        {
            name: 'ChemBalance pH+ Arttırıcı 5 kg',
            slug: 'chembalance-ph-artirici-5-kg',
            description: 'Havuz suyunun pH değerini düzenlemek için kullanılır. Optimum pH seviyesi 7.2-7.8 arasında olmalıdır.',
            priceKurus: 89900, // 899,00 TL
            stock: 30,
            imageUrls: ['/images/products/chemicals2.jpg'],
            isFeatured: false,
            categoryId: kimyasallar.id,
        },
        {
            name: 'AquaPump Pro 1.5 HP Havuz Pompası',
            slug: 'aquapump-pro-1-5-hp-havuz-pompasi',
            description: '1.5 HP güçlü havuz sirkülasyon pompası. Düşük enerji tüketimi ile yüksek verimlilik sağlar.',
            priceKurus: 449900, // 4.499,00 TL
            stock: 20,
            imageUrls: ['/images/products/pump1.jpg'],
            isFeatured: true,
            categoryId: pompalar.id,
        },
        {
            name: 'FilterMax Kum Filtresi 24"',
            slug: 'filtermax-kum-filtresi-24',
            description: 'Yüksek kapasiteli 24 inç kum filtresi. 60 m³/saat su akış kapasitesi. Kolay bakım için çok yollu valf dahil.',
            priceKurus: 379900, // 3.799,00 TL
            stock: 12,
            imageUrls: ['/images/products/filter1.jpg'],
            isFeatured: false,
            categoryId: pompalar.id,
        },
        {
            name: 'LumiPool RGB LED Havuz Lambası',
            slug: 'lumipool-rgb-led-havuz-lambasi',
            description: 'Su altı RGB LED aydınlatma sistemi. 16 farklı renk seçeneği. Uzaktan kumanda ile kontrol.',
            priceKurus: 199900, // 1.999,00 TL
            stock: 25,
            imageUrls: ['/images/products/light1.jpg'],
            isFeatured: false,
            categoryId: aydinlatma.id,
        },
        {
            name: 'SaltPro 40g/h Tuz Klorinatörü',
            slug: 'saltpro-40g-h-tuz-klorinatorleri',
            description: 'Saatte 40g klor üretebilen tuz klorinatörü. Kimyasal klor kullanımını ortadan kaldırır.',
            priceKurus: 849900, // 8.499,00 TL
            stock: 18,
            imageUrls: ['/images/products/salt1.jpg'],
            isFeatured: true,
            categoryId: tuzlama.id,
        },
    ];
    for (const product of products) {
        await prisma.product.upsert({
            where: { slug: product.slug },
            update: {},
            create: product,
        });
    }
    console.log(`✅ ${products.length} ürün oluşturuldu.`);
    console.log('🎉 Seed işlemi tamamlandı!');
}
main()
    .catch((e) => {
    console.error('❌ Seed hatası:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
