"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/wishlist";

export default function HeaderWishlistLink() {
  const { ids } = useWishlist();
  const active = ids.length > 0;

  return (
    <Link
      href="/shop/wishlist"
      aria-label="علاقه‌مندی‌ها"
      className="relative flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-neutral-03 md:size-10"
    >
      <Heart
        className={`size-4 ${active ? "fill-red-500 text-red-500" : ""}`}
        strokeWidth={1.5}
      />
    </Link>
  );
}
