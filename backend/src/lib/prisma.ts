import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { readFileSync } from 'fs';
import { resolve } from 'path';

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
  console.warn('env yüklenemedi:', e.message);
}

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL || !DB_URL.startsWith('postgres')) {
  throw new Error(`Geçersiz DATABASE_URL: "${DB_URL}"`);
}

/**
 * lib/prisma.ts — Singleton Prisma istemcisi (Prisma 7 + pg adapter)
 */
const pool = new pg.Pool({ connectionString: DB_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;
