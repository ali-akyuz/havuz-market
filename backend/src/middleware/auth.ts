import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

// Express Request nesnesine "user" tipini eklemek icin global genisletme
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
      };
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-default-key-for-dev";

// ─── Zorunlu Auth (Uye sayfasi, siparis gecmisi icin) ─────────────────────────
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Giriş yapmanız gerekiyor." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: "Kullanıcı bulunamadı." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Geçersiz veya süresi dolmuş oturum." });
  }
};

// ─── Opsiyonel Auth (Checkout icin: uye ise al, degilse gec) ──────────────────
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, name: true }
      });

      if (user) {
        req.user = user;
      }
    }
  } catch (error) {
    // Opsiyonel oldugu icin hata durumunda bir sey yapma, sessizce devam et
  }
  next();
};
