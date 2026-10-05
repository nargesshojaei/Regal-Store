"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/format";
import Badge from "@/ui/Badge";
import ColorSwatch from "@/ui/ColorSwatch";
import LookImage from "@/ui/LookImage";
import WishlistButton from "@/ui/WishlistButton";

// کارت کالا. رنگ‌ها انتخابی هستند و همان رنگ به صفحه کالا می‌رود.
export default function ProductCard({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const colors = product.colors || [];
  const [color, setColor] = useState(colors[0]?.name || "");
  const hasDiscount = Boolean(product.discountPercent);
  const href = color
    ? `/shop/${product.id}?color=${encodeURIComponent(color)}`
    : `/shop/${product.id}`;

  return (
    <article className={`group h-full ${className}`}>
      <Link href={href} className="block">
        <LookImage src={product.image} alt={product.name} className="aspect-[3/4] w-full">
          {hasDiscount ? (
            <span className="absolute top-3 left-3 z-10">
              <Badge>٪{product.discountPercent}</Badge>
            </span>
          ) : null}

          <WishlistButton
            productId={product.id}
            className="absolute top-3 right-3 z-10"
          />
        </LookImage>
      </Link>

      <div className="mt-4 flex flex-col items-start gap-2">
        <ColorSwatch colors={colors} selected={color} onSelect={setColor} />
        <Link href={href}>
          <h3 className="text-sm text-black group-hover:text-primary">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-neutral-11">{formatPrice(product.price)} تومان</span>
          {product.originalPrice ? (
            <span className="text-neutral-08 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
