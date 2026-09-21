"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import CartItem from "@/features/cart/CartItem";
import CartSummary from "@/features/cart/CartSummary";

export default function CartPage() {
  const { items, changeCount, remove, totalCount, totalPrice } = useCart();

  return (
    <div dir="rtl" className="mx-auto max-w-7xl px-6 py-12 md:px-12">
      <h1 className="text-2xl font-semibold text-black">سبد خرید</h1>

      {items.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-09">
          سبد خالی است.{" "}
          <Link href="/shop" className="text-primary underline">
            رفتن به فروشگاه
          </Link>
        </p>
      ) : (
        <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div>
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onChangeCount={changeCount}
                onRemove={remove}
              />
            ))}
          </div>
          <CartSummary totalPrice={totalPrice} totalCount={totalCount} />
        </div>
      )}
    </div>
  );
}
