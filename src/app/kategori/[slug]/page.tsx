import { getCategoryBySlug } from "@/services/categories";
import { getProductsByCategory } from "@/services/products";
import { notFound } from "next/navigation";
import { CategoryClient } from "@/components/product/CategoryClient";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const products = await getProductsByCategory(category.slug);

  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <CategoryClient category={category} products={products} />
    </Suspense>
  );
}
