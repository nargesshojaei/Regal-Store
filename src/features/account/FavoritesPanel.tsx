"use client";
//همان لیست قلب فروشگاه را نشان می‌دهد و از آنجا به سبد اضافه
// علاقه‌مندی‌های حساب = همون لیست قلب فروشگاه
// از useWishlist خونده می‌شه و افزودن به سبد همون cart لوکال است

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { products as localProducts } from "@/data/Products";
import { getProducts } from "@/lib/api/products";
import { toCardProduct } from "@/lib/api/home";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/product";
import ColorSwatch from "@/ui/ColorSwatch";
import WishlistButton from "@/ui/WishlistButton";
import EmptyState from "./EmptyState";

export default function FavoritesPanel() {
  const { ids } = useWishlist();
  const { add } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      let list: Product[] = [];

      try {
        // اول کالای واقعی فروشگاه
        const result = await getProducts(1, undefined, undefined, 80);
        list = (result.data || []).map(toCardProduct);
      } catch {
        list = [];
      }

      // کالاهای داخل پروژه هم می‌مونن تا قلب صفحه اصلی گم نشه
      for (let i = 0; i < localProducts.length; i++) {
        const item = localProducts[i];
        const already = list.some((product) => product.id === item.id);
        if (!already) list.push(item);
      }

      const liked = list.filter((item) => ids.includes(String(item.id)));
      if (!cancelled) {
        setProducts(liked);
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [ids]);

  function addToCart(product: Product) {
    add({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      count: 1,
    });
    setAddedId(product.id);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-base font-medium text-black">لیست علاقه‌مندی‌ها</h1>

      {loading ? (
        <p className="text-sm text-neutral-09">در حال بارگذاری...</p>
      ) : products.length === 0 ? (
        <Card className="shadow-none ring-neutral-03">
          <EmptyState
            text="هنوز محصولی به علاقه‌مندی‌ها اضافه نکرده‌اید."
            action={
              <Button asChild className="h-10 rounded-lg px-5">
                <Link href="/shop">برو به فروشگاه</Link>
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="gap-3 p-3 shadow-none ring-neutral-03">
              <Link href={`/shop/${product.id}`} className="relative block">
                <img
                  src={product.image}
                  alt={product.name}
                  className="aspect-[3/4] w-full rounded-xl object-cover object-top"
                />
                <WishlistButton
                  productId={product.id}
                  className="absolute top-3 right-3"
                />
              </Link>

              <div className="space-y-2 px-1">
                <ColorSwatch colors={product.colors} />
                <p className="text-sm text-black">{product.name}</p>
                <p className="text-sm text-neutral-11">
                  {formatPrice(product.price)} تومان
                </p>
              </div>

              <Button
                type="button"
                className="h-10 rounded-lg"
                onClick={() => addToCart(product)}
              >
                {addedId === product.id ? "به سبد اضافه شد" : "افزودن به سبد خرید"}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
