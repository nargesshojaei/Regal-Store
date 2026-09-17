import { isOrderDelivered, type Order } from "@/types/order";
//نشان وضعیت (در انتظار / تحویل‌شده)
export default function OrderStatusBadge({
  delivered,
}: {
  delivered: Order["delivered"];
}) {
  const done = isOrderDelivered(delivered);

  
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs ${
        done
          ? "bg-emerald-50 text-emerald-700"
          : "bg-amber-50 text-amber-800"
      }`}
    >
      {done ? "تحویل شده" : "در انتظار ارسال"}
    </span>
  );
}
