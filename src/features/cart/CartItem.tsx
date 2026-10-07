import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartProduct } from "@/lib/cart";
import { faDigits, formatPrice } from "@/lib/format";

export default function CartItem({
  item,
  maxCount,
  onChangeCount,
  onRemove,
}: {
  item: CartProduct;
  maxCount: number;
  onChangeCount: (lineId: string, count: number) => void;
  onRemove: (lineId: string) => void;
}) {
  const linePrice = item.price * item.count;
  const atMax = item.count >= maxCount;

  return (
    <div className="flex flex-col gap-3 border-b border-neutral-03 py-5 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
      {item.image ? (
        <img
          src={item.image}
          alt={item.name}
          className="size-16 shrink-0 rounded-xl object-cover object-top sm:size-20"
        />
      ) : (
        <div className="size-16 shrink-0 rounded-xl bg-neutral-03 sm:size-20" />
      )}

      <div className="min-w-0 flex-1">
        <p className="text-sm text-black">{item.name}</p>
        {item.color || item.size ? (
          <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-neutral-08">
            {item.color ? (
              <span className="inline-flex items-center gap-1">
                <span
                  className="size-2.5 rounded-full border border-black/10"
                  style={{ backgroundColor: item.colorHex || "#ccc" }}
                />
                رنگ: {item.color}
              </span>
            ) : null}
            {item.size ? <span>سایز: {item.size}</span> : null}
          </p>
        ) : null}
        <p className="mt-1 text-sm text-neutral-09">{formatPrice(item.price)} تومان</p>
        {item.stock > 0 && atMax ? (
          <p className="mt-1 text-xs text-red-600">
            سقف موجودی این کالا {faDigits(item.stock)} عدد است.
          </p>
        ) : null}
      </div>
      </div>

      <div className="flex items-center justify-between gap-3 sm:contents">
      <div className="flex items-center gap-2 rounded-full border border-neutral-03 px-2 py-1">
        <button
          type="button"
          aria-label="کم کردن"
          onClick={() => onChangeCount(item.lineId, item.count - 1)}
          className="flex size-7 items-center justify-center"
        >
          <Minus className="size-3.5" strokeWidth={1.75} />
        </button>
        <span className="min-w-5 text-center text-sm">{item.count}</span>
        <button
          type="button"
          aria-label="زیاد کردن"
          disabled={atMax}
          onClick={() => onChangeCount(item.lineId, item.count + 1)}
          className="flex size-7 items-center justify-center disabled:opacity-30"
        >
          <Plus className="size-3.5" strokeWidth={1.75} />
        </button>
      </div>

      <p className="min-w-0 flex-1 text-left text-sm text-black sm:w-28 sm:flex-none">{formatPrice(linePrice)} تومان</p>

      <button
        type="button"
        aria-label="حذف از سبد"
        onClick={() => onRemove(item.lineId)}
        className="flex size-8 items-center justify-center rounded-full hover:bg-neutral-03"
      >
        <Trash2 className="size-4 text-neutral-09" strokeWidth={1.5} />
      </button>
      </div>
    </div>
  );
}
