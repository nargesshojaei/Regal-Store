"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/wishlist";

export default function WishlistButton({
  productId,
  className = "",
}: {
  productId: string;
  className?: string;
}) {
  const { has, toggle } = useWishlist();
  const active = has(productId);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(productId);
      }}
      className={`flex size-9 items-center justify-center rounded-full bg-white/95 shadow-sm transition-colors hover:bg-white ${className}`}
    >
      <Heart
        className={`size-4 transition-colors ${
          active ? "fill-red-500 text-red-500" : "text-neutral-11"
        }`}
        strokeWidth={1.6}
      />
    </button>
  );
}
