/**
 * seed_runner.ts — Veritabanını pg driver ile doldurur.
 * Prisma 7 adaptör sorununu bypass etmek için doğrudan SQL kullanır.
 */
import pg from 'pg';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// .env dosyasını manuel oku (tsx'in override etmesini önle)
const envPath = resolve(__dirname, '../.env');
const envContent = readFileSync(envPath, 'utf8');
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIndex = trimmed.indexOf('=');
  if (eqIndex < 0) continue;
  const key = trimmed.slice(0, eqIndex).trim();
  const val = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, '');
  process.env[key] = val;
}

const DB_URL = process.env.DATABASE_URL!;
console.log('Bağlanılıyor:', DB_URL.substring(0, 50) + '...');

const { Client } = pg;
const client = new Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });

async function main() {
  await client.connect();
  console.log('✅ Veritabanına bağlandı.');

  // Kategorileri ekle (UPSERT)
  const categories = [
    { name: 'Havuz Robotları', slug: 'havuz-robotlari' },
    { name: 'Havuz Kimyasalları', slug: 'havuz-kimyasallari' },
    { name: 'Pompalar & Filtreler', slug: 'pompalar-filtreler' },
    { name: 'Aydınlatma', slug: 'aydinlatma' },
    { name: 'Tuz Klorinörleri', slug: 'tuz-klorinatorleri' },
  ];

  const catIds: Record<string, string> = {};
  for (const cat of categories) {
    const res = await client.query(
      `INSERT INTO "Category" (id, name, slug, "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, NOW(), NOW())
       ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
       RETURNING id, slug`,
      [cat.name, cat.slug]
    );
    catIds[cat.slug] = res.rows[0].id;
    console.log(`  Kategori: ${cat.name} (${res.rows[0].id})`);
  }

  // Ürünleri ekle
  const products = [
    {
      name: 'AquaBot Pro 3000 Havuz Robotu',
      slug: 'aquabot-pro-3000-havuz-robotu',
      description: 'Profesyonel havuz temizleme robotu. 5 saatte bir tam tarama yapar. Zemin, duvar ve su hattı temizliği.',
      priceKurus: 1249900,
      stock: 15,
      imageUrls: ['/images/products/robot.jpg'],
      isFeatured: true,
      categorySlug: 'havuz-robotlari',
    },
    {
      name: 'HydroClean Plus Havuz Robotu',
      slug: 'hydroclean-plus-havuz-robotu',
      description: 'Akıllı navigasyon ile donatılmış havuz temizleme robotu. Wi-Fi ile uygulama üzerinden kontrol.',
      priceKurus: 1849900,
      stock: 8,
      imageUrls: ['/images/products/robot.jpg'],
      isFeatured: false,
      categorySlug: 'havuz-robotlari',
    },
    {
      name: 'PoolMaster Aktif Klor 50 kg',
      slug: 'poolmaster-aktif-klor-50-kg',
      description: 'Havuz suyu dezenfeksiyonu için toz aktif klor. Yosun ve bakteri üremesini önler.',
      priceKurus: 249900,
      stock: 50,
      imageUrls: ['/images/products/chemicals.jpg'],
      isFeatured: false,
      categorySlug: 'havuz-kimyasallari',
    },
    {
      name: 'ChemBalance pH+ Arttırıcı 5 kg',
      slug: 'chembalance-ph-artirici-5-kg',
      description: 'Havuz suyunun pH değerini düzenler. Optimum pH aralığı: 7.2–7.8.',
      priceKurus: 89900,
      stock: 30,
      imageUrls: ['/images/products/chemicals.jpg'],
      isFeatured: false,
      categorySlug: 'havuz-kimyasallari',
    },
    {
      name: 'AquaPump Pro 1.5 HP Havuz Pompası',
      slug: 'aquapump-pro-1-5-hp-havuz-pompasi',
      description: '1.5 HP güçlü havuz sirkülasyon pompası. Düşük enerji tüketimi, yüksek verimlilik.',
      priceKurus: 449900,
      stock: 20,
      imageUrls: ['/images/products/pump.jpg'],
      isFeatured: true,
      categorySlug: 'pompalar-filtreler',
    },
    {
      name: 'FilterMax Kum Filtresi 24"',
      slug: 'filtermax-kum-filtresi-24',
      description: 'Yüksek kapasiteli 24 inç kum filtresi. 60 m³/saat su akış kapasitesi.',
      priceKurus: 379900,
      stock: 12,
      imageUrls: ['/images/products/filter.jpg'],
      isFeatured: false,
      categorySlug: 'pompalar-filtreler',
    },
    {
      name: 'LumiPool RGB LED Havuz Lambası',
      slug: 'lumipool-rgb-led-havuz-lambasi',
      description: 'Su altı RGB LED aydınlatma. 16 renk seçeneği. Uzaktan kumanda ile kontrol.',
      priceKurus: 199900,
      stock: 25,
      imageUrls: ['/images/products/light.jpg'],
      isFeatured: false,
      categorySlug: 'aydinlatma',
    },
    {
      name: 'SaltPro 40g/h Tuz Klorinatörü',
      slug: 'saltpro-40g-h-tuz-klorinatorleri',
      description: 'Saatte 40g klor üretir. Kimyasal klor kullanımını ortadan kaldırır.',
      priceKurus: 849900,
      stock: 18,
      imageUrls: ['/images/products/salt-gen.jpg'],
      isFeatured: true,
      categorySlug: 'tuz-klorinatorleri',
    },
  ];

  console.log('\n🌱 Ürünler ekleniyor...');
  for (const p of products) {
    const catId = catIds[p.categorySlug];
    await client.query(
      `INSERT INTO "Product" (id, name, slug, description, "priceKurus", stock, "imageUrls", "isFeatured", "isActive", "categoryId", "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, TRUE, $8, NOW(), NOW())
       ON CONFLICT (slug) DO UPDATE SET "imageUrls" = EXCLUDED."imageUrls"`,
      [p.name, p.slug, p.description, p.priceKurus, p.stock, p.imageUrls, p.isFeatured, catId]
    );
    console.log(`  ✅ ${p.name} — ${(p.priceKurus / 100).toLocaleString('tr-TR')} TL`);
  }

  console.log(`\n🎉 Seed tamamlandı! ${products.length} ürün, ${categories.length} kategori eklendi.`);
}

main()
  .catch(e => { console.error('❌ Hata:', e.message); process.exit(1); })
  .finally(() => client.end());
