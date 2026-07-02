import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/lib/siteConfig";

import { ScrollToTop } from "@/components/layout/ScrollToTop";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0891b2",
};

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: "Türkiye'nin en kapsamlı havuz ekipmanları platformu. Havuz robotları, kimyasallar, pompalar ve daha fazlası. Ücretsiz kargo, 2 yıl garanti.",
  keywords: ["havuz robotu", "havuz kimyasalı", "havuz pompası", "tuz klor jeneratörü", "havuz ekipmanları"],
  openGraph: {
    siteName: siteConfig.name,
    locale: "tr_TR",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-slate-50 antialiased">
        <ScrollToTop />
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
