import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-default-key-for-dev";

// ─── REGISTER ───────────────────────────────────────────────────────────────
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Ad, e-posta ve şifre zorunludur." });
    }

    // E-posta kullaniliyor mu?
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Bu e-posta adresi zaten kullanılıyor." });
    }

    // Sifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kullaniciyi olustur
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // JWT olustur
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      message: "Kayıt başarılı.",
      data: {
        token,
        user: { id: user.id, name: user.name, email: user.email },
      },
    });
  } catch (error: any) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu.", error: error.message, stack: error.stack });
  }
});

// ─── LOGIN ──────────────────────────────────────────────────────────────────
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "E-posta ve şifre zorunludur." });
    }

    // Kullaniciyi bul
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: "E-posta veya şifre hatalı." });
    }

    // Sifreyi dogrula
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "E-posta veya şifre hatalı." });
    }

    // JWT olustur
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      message: "Giriş başarılı.",
      data: {
        token,
        user: { id: user.id, name: user.name, email: user.email, phone: user.phone, address: user.address },
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
});

// ─── ME (Oturum Bilgisi) ────────────────────────────────────────────────────
// Profil sayfasini veya odeme sayfasini actiginda guncel user verisini cekmek icin
router.get("/me", requireAuth, async (req: Request, res: Response) => {
  try {
    // req.user requireAuth middleware'inden geliyor
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, name: true, email: true, phone: true, address: true, createdAt: true }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı." });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error("Get Me Error:", error);
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
});

export default router;
