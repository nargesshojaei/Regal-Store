"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart";

export default function HeaderCartLink() {
  const { totalCount } = useCart();

  return (
    <Link
      href="/cart"
      aria-label="سبد خرید"
      className="relative flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-neutral-03 md:size-10"
    >
      <ShoppingCart className="size-4" strokeWidth={1.5} />
      {totalCount > 0 ? (
        <span className="absolute top-1 left-1 flex min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] text-white">
          {totalCount}
        </span>
      ) : null}
    </Link>
  );
}
