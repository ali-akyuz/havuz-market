import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Lokal testler için .env okuma (Render'da bu otomatik ortam değişkenlerinden gelir)
try {
  const envPath = resolve(__dirname, '../../.env');
  const envContent = readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex < 0) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const val = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) {
      process.env[key] = val;
    }
  }
} catch (e: any) {
  console.warn('Lokal env dosyası bulunamadı, sistem değişkenleri kullanılacak.');
}

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL || !DB_URL.startsWith('postgres')) {
  console.error(`Geçersiz veya eksik DATABASE_URL: "${DB_URL}"`);
}

/**
 * lib/prisma.ts — Singleton Prisma istemcisi
 */
const prisma = new PrismaClient();

export default prisma;
