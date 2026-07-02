import { ProductCard } from "@/components/product/ProductCard";
import { Product } from "@/services/types";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface ProductSliderProps {
  title: string;
  subtitle?: string;
  products: Product[];
  bgColor?: string;
  viewAllHref?: string;
}

export function ProductSlider({
  title,
  subtitle,
  products,
  bgColor = "bg-slate-50",
  viewAllHref,
}: ProductSliderProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className={`py-20 ${bgColor}`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            {subtitle && (
              <p className="text-turquoise-600 font-semibold text-sm uppercase tracking-widest mb-2">{subtitle}</p>
            )}
            <h2 className="text-3xl lg:text-4xl font-black text-navy-900">{title}</h2>
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="hidden md:flex items-center gap-2 text-sm font-semibold text-navy-600 hover:text-turquoise-600 transition-colors group"
            >
              Tümünü Gör
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {/* Horizontal scroll */}
        <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar -mx-4 px-4">
          {products.map((product) => (
            <div key={product.id} className="min-w-[260px] max-w-[280px] flex-shrink-0 snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {viewAllHref && (
          <div className="mt-8 text-center md:hidden">
            <Link
              href={viewAllHref}
              className="inline-flex items-center gap-2 text-sm font-semibold text-turquoise-600 hover:text-turquoise-700"
            >
              Tümünü Gör <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
