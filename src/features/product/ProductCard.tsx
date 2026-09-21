import Link from "next/link";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/format";
import Badge from "@/ui/Badge";
import ColorSwatch from "@/ui/ColorSwatch";
import LookImage from "@/ui/LookImage";
import WishlistButton from "@/ui/WishlistButton";

// کارت کالا برای لیست فروشگاه، جستجو و محصولات مشابه
// با کلیک روی کارت، صفحه جزئیات همان کالا باز می‌شود
export default function ProductCard({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const hasDiscount = Boolean(product.discountPercent);

  return (
    <Link
      href={`/shop/${product.id}`}
      className={`group block h-full ${className}`}
    >
      <LookImage
        src={product.image}
        alt={product.name}
        className="aspect-[3/4] w-full"
      >
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

      <div className="mt-4 flex flex-col items-start gap-2">
        <ColorSwatch colors={product.colors} />
        <h3 className="text-sm text-black group-hover:text-primary">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-neutral-11">
            {formatPrice(product.price)} تومان
          </span>
          {product.originalPrice ? (
            <span className="text-neutral-08 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
