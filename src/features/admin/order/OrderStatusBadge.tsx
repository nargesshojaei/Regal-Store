import type { OrderStatus } from "@/lib/account";

// همان دو وضعیتی که در فروشگاه هم دیده می‌شود
export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const done = status === "delivered";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs ${
        done ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"
      }`}
    >
      {done ? "تحویل شده" : "در انتظار ارسال"}
    </span>
  );
}
