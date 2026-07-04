import pg from 'pg';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

// .env dosyasını oku
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
const { Client } = pg;
const client = new Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });

async function main() {
  await client.connect();
  console.log('✅ Veritabanına bağlandı.');

  // mockData.json'ı oku
  const mockPath = resolve(__dirname, '../../src/services/mockData.json');
  const mockDataStr = readFileSync(mockPath, 'utf8');
  const mockData = JSON.parse(mockDataStr);

  const categories = mockData.categories;
  const products = mockData.products;

  console.log(`\n🌱 ${categories.length} kategori ekleniyor...`);
  
  const catIdMap: Record<string, string> = {}; // mock id -> uuid
  
  for (const cat of categories) {
    const res = await client.query(
      `INSERT INTO "Category" (id, name, slug, "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, NOW(), NOW())
       ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [cat.name, cat.slug]
    );
    catIdMap[cat.id] = res.rows[0].id;
    console.log(`  Kategori: ${cat.name}`);
  }

  console.log(`\n🌱 ${products.length} ürün ekleniyor...`);
  for (const p of products) {
    const catUuid = catIdMap[p.category];
    if (!catUuid) {
      console.log(`  ❌ Kategori bulunamadı: ${p.title}`);
      continue;
    }
    
    // Map badges to isFeatured
    // "Çok Satan", "Kampanya", "Yeni Ürün" from badges
    const isFeatured = Array.isArray(p.badges) && p.badges.length > 0;
    const priceKurus = Math.round(p.price * 100);

    // jsonb string mapping using JSON.stringify for postgres array/jsonb field?
    // In prisma, string[] is stored as jsonb array usually, but wait, `imageUrls` is `String[]`? 
    // In standard postgres `String[]` is just a text array! 
    // But since Prisma uses standard PG array `TEXT[]`, we must pass it as a postgres array.
    // However, node-pg automatically maps JS arrays to postgres arrays. So `p.images` will work!

    await client.query(
      `INSERT INTO "Product" (id, name, slug, description, "priceKurus", stock, "imageUrls", "isFeatured", "isActive", "categoryId", "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, TRUE, $8, NOW(), NOW())
       ON CONFLICT (slug) DO UPDATE SET 
         name = EXCLUDED.name,
         description = EXCLUDED.description,
         "priceKurus" = EXCLUDED."priceKurus",
         stock = EXCLUDED.stock,
         "imageUrls" = EXCLUDED."imageUrls",
         "isFeatured" = EXCLUDED."isFeatured",
         "categoryId" = EXCLUDED."categoryId"`,
      [
        p.title,
        p.slug,
        p.description || p.shortDescription || '',
        priceKurus,
        p.stock || 10,
        p.images || [], // JS Array is automatically converted to PG array by node-pg
        isFeatured,
        catUuid
      ]
    );
    console.log(`  ✅ ${p.title}`);
  }

  console.log(`\n🎉 Bitti! Orijinal ${products.length} adet "mock" ürün veritabanına aktarıldı.`);
}

main()
  .catch(e => { console.error('❌ Hata:', e.message); process.exit(1); })
  .finally(() => client.end());
