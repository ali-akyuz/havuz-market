import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, Shield, Truck, RotateCcw, Package } from "lucide-react";
import { getProductBySlug } from "@/services/products";
import { ProductActions } from "@/components/product/ProductActions";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const ratingNum = Number(product.rating);
  const isOutOfStock = product.stock === 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-navy-500 mb-8">
          <Link href="/" className="hover:text-turquoise-600 transition-colors">Ana Sayfa</Link>
          <span>/</span>
          <Link href="/kategori/havuz-robotlari" className="hover:text-turquoise-600 transition-colors">
            {product.brand}
          </Link>
          <span>/</span>
          <span className="text-navy-800 font-medium line-clamp-1">{product.title}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 bg-white rounded-3xl border border-navy-100 p-6 lg:p-10">
          {/* Left: Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-slate-50 to-navy-50 border border-navy-100">
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                priority
                className="object-contain p-8"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {product.discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-xl">
                  %{product.discount} İndirim
                </div>
              )}
              {isOutOfStock && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                  <span className="bg-navy-800 text-white font-bold px-4 py-2 rounded-xl">Stokta Yok</span>
                </div>
              )}
            </div>
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {[product.images[0], product.images[0], product.images[0], product.images[0]].map((img, i) => (
                <div key={i} className={cn(
                  "aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all",
                  i === 0 ? "border-turquoise-400" : "border-navy-100 hover:border-navy-300 opacity-60 hover:opacity-100"
                )}>
                  <div className="relative w-full h-full bg-navy-50">
                    <Image src={img} alt="" fill className="object-contain p-2" sizes="80px" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div className="flex flex-col">
            {/* Brand */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-bold bg-turquoise-50 text-turquoise-700 px-3 py-1 rounded-full uppercase tracking-wide">
                {product.brand}
              </span>
              {product.badges.map((badge) => (
                <span key={badge} className={cn(
                  "text-xs font-semibold px-3 py-1 rounded-full",
                  badge === "Çok Satan" ? "bg-orange-50 text-orange-600" :
                  badge === "Kampanya" ? "bg-red-50 text-red-600" :
                  "bg-blue-50 text-blue-600"
                )}>
                  {badge}
                </span>
              ))}
            </div>

            <h1 className="text-2xl lg:text-3xl font-black text-navy-900 mb-4 leading-snug">{product.title}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className={cn("w-4 h-4", i <= Math.round(ratingNum) ? "fill-amber-400 text-amber-400" : "fill-navy-100 text-navy-100")} />
                ))}
              </div>
              <span className="text-sm font-bold text-navy-800">{product.rating}</span>
              <span className="text-sm text-navy-500 underline cursor-pointer">{product.reviewCount} değerlendirme</span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-4 pb-6 border-b border-navy-100 mb-6">
              <div>
                {product.oldPrice && (
                  <p className="text-sm text-navy-400 line-through mb-1">{formatCurrency(product.oldPrice)}</p>
                )}
                <p className="text-4xl font-black text-navy-900">{formatCurrency(product.price)}</p>
              </div>
              {product.discount > 0 && (
                <div className="mb-1 bg-red-50 text-red-600 font-bold text-sm px-3 py-1 rounded-xl">
                  {formatCurrency((product.oldPrice || 0) - product.price)} tasarruf
                </div>
              )}
            </div>

            {/* Short Description */}
            <p className="text-navy-600 leading-relaxed mb-6">{product.shortDescription}</p>

            {/* Actions */}
            <ProductActions product={product} />

            {/* Service badges */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-navy-100">
              {[
                { icon: <Truck className="w-4 h-4" />, text: "Ücretsiz Kargo" },
                { icon: <Shield className="w-4 h-4" />, text: "2 Yıl Garanti" },
                { icon: <RotateCcw className="w-4 h-4" />, text: "14 Gün İade" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-2 p-3 bg-navy-50 rounded-xl text-center">
                  <span className="text-turquoise-600">{icon}</span>
                  <span className="text-xs font-semibold text-navy-700">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description and Specs */}
        <div className="mt-8 bg-white rounded-3xl border border-navy-100 overflow-hidden">
          <div className="flex border-b border-navy-100">
            <button className="px-8 py-4 text-sm font-bold text-navy-900 border-b-2 border-turquoise-500 bg-turquoise-50/50">
              Ürün Açıklaması
            </button>
            <button className="px-8 py-4 text-sm font-semibold text-navy-500 hover:text-navy-700 transition-colors">
              Teknik Özellikler
            </button>
          </div>
          <div className="p-8 lg:p-12">
            <p className="text-navy-700 leading-relaxed text-base mb-8">{product.description}</p>
            <h3 className="text-lg font-bold text-navy-900 mb-5 flex items-center gap-2">
              <Package className="w-5 h-5 text-turquoise-600" />
              Teknik Özellikler
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(product.technicalSpecs).map(([key, val]) => (
                <div key={key} className="flex justify-between items-center py-3 px-4 bg-navy-50 rounded-xl">
                  <span className="text-sm text-navy-600">{key}</span>
                  <span className="text-sm font-bold text-navy-900">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
