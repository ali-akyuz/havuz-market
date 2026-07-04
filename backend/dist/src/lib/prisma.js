"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = __importDefault(require("pg"));
const fs_1 = require("fs");
const path_1 = require("path");
try {
    const envPath = (0, path_1.resolve)(__dirname, '../../.env');
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
        if (!process.env[key]) {
            process.env[key] = val;
        }
    }
}
catch (e) {
    console.warn('env yüklenemedi:', e.message);
}
const DB_URL = process.env.DATABASE_URL;
if (!DB_URL || !DB_URL.startsWith('postgres')) {
    throw new Error(`Geçersiz DATABASE_URL: "${DB_URL}"`);
}
/**
 * lib/prisma.ts — Singleton Prisma istemcisi (Prisma 7 + pg adapter)
 */
const pool = new pg_1.default.Pool({ connectionString: DB_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
exports.default = prisma;
