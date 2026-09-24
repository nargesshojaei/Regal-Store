"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { getProducts } from "@/lib/api/products";
import { toCardProduct } from "@/lib/api/home";
import ProductCard from "@/features/product/ProductCard";
import type { Product } from "@/types/product";

// صفحه جستجو:
// 1) کالاها را از JSON سرور می‌گیریم
// 2) کاربر در اینپوت تایپ می‌کند
// 3) کالاهایی که اسمشان شامل متن است نشان داده می‌شوند
export default function SearchList() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    inputRef.current?.focus();

    async function loadProducts() {
      try {
        const result = await getProducts(1, undefined, undefined, 80);
        const cards = (result.data || []).map(toCardProduct);
        setProducts(cards);
      } catch {
        setProducts([]);
      }

      setLoading(false);
    }

    loadProducts();
  }, []);

  const text = query.trim();
  const found = text
    ? products.filter((item) => item.name.includes(text))
    : products;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-black">جستجو</h1>
      <p className="mt-2 text-sm text-neutral-09">
        نام لباس یا محصول را بنویسید تا از روی کالاهای سرور پیدا شود.
      </p>

      <div className="relative mt-6">
        <Search
          className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-neutral-08"
          strokeWidth={1.5}
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="مثلاً پیراهن، کیف یا شومیز"
          className="h-12 w-full rounded-full border border-neutral-03 bg-white pr-11 pl-4 text-sm text-black outline-none placeholder:text-neutral-08 focus:border-primary"
        />
      </div>

      {loading ? (
        <p className="mt-10 text-sm text-neutral-09">در حال بارگذاری...</p>
      ) : found.length === 0 ? (
        <p className="mt-10 text-sm text-neutral-09">
          {text ? `برای «${text}» کالایی پیدا نشد.` : "کالایی برای نمایش نیست."}
        </p>
      ) : (
        <>
          <p className="mt-8 text-sm text-neutral-09">
            {text ? `${found.length} نتیجه برای «${text}»` : `${found.length} کالا`}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {found.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
