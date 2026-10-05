import Link from "next/link";
import { formatPrice } from "@/lib/format";

export default function CartSummary({
  totalPrice,
  totalCount,
}: {
  totalPrice: number;
  totalCount: number;
}) {
  return (
    <aside className="rounded-2xl border border-neutral-03 p-6">
      <h2 className="text-lg font-medium text-black">خلاصه سبد</h2>
      <div className="mt-4 flex items-center justify-between text-sm text-neutral-09">
        <span>{totalCount} کالا</span>
        <span>{formatPrice(totalPrice)} تومان</span>
      </div>
      <div className="mt-6 flex items-center justify-between text-base text-black">
        <span>مبلغ کل</span>
        <span>{formatPrice(totalPrice)} تومان</span>
      </div>
      {/* از اینجا می‌رویم فرم اطلاعات خریدار */}
      <Link
        href="/checkout"
        className="mt-6 flex h-12 w-full items-center justify-center rounded-lg bg-primary text-sm text-white transition-colors hover:bg-primary-shade-08"
      >
        نهایی کردن سبد خرید
      </Link>
    </aside>
  );
}
