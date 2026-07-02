"use client";

import { useFavoritesStore } from "@/lib/store/useFavorites";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function FavoritesButton() {
  const [mounted, setMounted] = useState(false);
  const items = useFavoritesStore((state) => state.items);

  // Hydration sorunlarını engellemek için bileşen yüklendiğini işaretliyoruz
  // Hydration sorunlarını engellemek için bileşen yüklendiğini işaretliyoruz
  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  return (
    <Link href="/favoriler" className="relative p-2 text-navy-800 hover:text-turquoise-500 transition-colors">
      <Heart className="w-6 h-6" />
      {mounted && items.length > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-turquoise-500 rounded-full">
          {items.length}
        </span>
      )}
    </Link>
  );
}
