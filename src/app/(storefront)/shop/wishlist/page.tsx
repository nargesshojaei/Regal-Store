"use client";
//کالاهایی را نشان می‌دهد که آیدی‌شان در لیست قلب است.
import { useEffect, useState } from "react";
import { getProducts } from "@/lib/api/products";
import { toCardProduct } from "@/lib/api/home";
import { useWishlist } from "@/lib/wishlist";
import ProductGrid from "@/features/product/ProductGrid";
import type { Product } from "@/types/product";

export default function WishlistPage() {
  const { ids } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const result = await getProducts(1, undefined, undefined, 80);
        const items = (result.data || [])
          .filter((item) => ids.includes(String(item.id)))
          .map(toCardProduct);
        if (!cancelled) setProducts(items);
      } catch {
        if (!cancelled) setProducts([]);
      }
      if (!cancelled) setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [ids]);

  return (
    <div dir="rtl" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:px-12 md:py-12">
      <h1 className="text-2xl font-semibold text-black">علاقه‌مندی‌ها</h1>
      {loading ? (
        <p className="mt-8 text-sm text-neutral-09">در حال بارگذاری...</p>
      ) : products.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-09">
          هنوز محصولی به علاقه‌مندی‌ها اضافه نشده است.
        </p>
      ) : (
        <div className="mt-8">
          <ProductGrid products={products} />
        </div>
      )}
    </div>
  );
}
