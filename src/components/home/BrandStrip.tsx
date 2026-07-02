export function BrandStrip() {
  const brands = ["Dolphin", "Zodiac", "Hayward", "AstralPool", "Gemaş", "BWT", "Pina"];

  return (
    <div className="py-12 bg-navy-950 border-y border-navy-800">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-xs text-navy-500 uppercase tracking-widest font-semibold mb-8">
          Türkiye'de Yetkili Distribütörü Olduğumuz Markalar
        </p>
        <div className="flex items-center justify-center flex-wrap gap-8 lg:gap-16">
          {brands.map((brand) => (
            <span
              key={brand}
              className="text-xl lg:text-2xl font-black text-navy-600 hover:text-navy-400 transition-colors cursor-default tracking-tight"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
