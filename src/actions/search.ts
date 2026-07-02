"use server";

import { getProducts } from "@/services/products";

export async function searchProducts(query: string) {
  if (!query || query.trim().length === 0) return [];
  
  const normalize = (str: string) => {
    return str
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/i̇/g, "i");
  };

  const normalizedQuery = normalize(query.trim());
  const allProducts = await getProducts();

  return allProducts.filter((p) => {
    const searchableText = normalize(
      `${p.title} ${p.brand} ${p.category} ${p.subcategory || ""}`
    );
    return searchableText.includes(normalizedQuery);
  });
}
