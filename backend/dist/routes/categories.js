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
        const categories = await prisma_1.default.category.findMany({
            where: { isActive: true },
            orderBy: { displayOrder: 'asc' },
        });
        res.json({ success: true, data: categories });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
