import { searchProducts } from "@/actions/search";
import { ProductCard } from "@/components/product/ProductCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Arama Sonuçları | Havuz Market",
  description: "Aradığınız havuz ekipmanları, kimyasalları ve robotları.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const q = searchParams.q;
  const query = typeof q === "string" ? q : Array.isArray(q) ? q[0] : "";
  const products = await searchProducts(query);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-navy-900 mb-2">Arama Sonuçları</h1>
          {query ? (
            <p className="text-navy-500">
              <strong className="text-navy-900">"{query}"</strong> için {products.length} sonuç bulundu.
            </p>
          ) : (
            <p className="text-navy-500">Tüm ürünler listeleniyor.</p>
          )}
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-navy-100">
            <h3 className="text-xl font-bold text-navy-900 mb-2">Sonuç Bulunamadı</h3>
            <p className="text-navy-500">
              Aramanızla eşleşen ürün bulunamadı. Lütfen farklı kelimelerle veya daha genel terimlerle tekrar deneyin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
