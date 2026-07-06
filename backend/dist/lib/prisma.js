"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const connectionString = process.env.DATABASE_URL;
const globalForPrisma = globalThis;
let clientOptions = {};
if (connectionString) {
    const adapter = new adapter_pg_1.PrismaPg({ connectionString });
    clientOptions = { adapter };
}
const prisma = globalForPrisma.prisma ?? new client_1.PrismaClient(clientOptions);
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
exports.default = prisma;
