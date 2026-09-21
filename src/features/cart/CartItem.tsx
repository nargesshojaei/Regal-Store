import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartProduct } from "@/lib/cart";
import { formatPrice } from "@/lib/format";

export default function CartItem({
  item,
  onChangeCount,
  onRemove,
}: {
  item: CartProduct;
  onChangeCount: (id: string, count: number) => void;
  onRemove: (id: string) => void;
}) {
  const linePrice = item.price * item.count;

  return (
    <div className="flex items-center gap-4 border-b border-neutral-03 py-5">
      {item.image ? (
        <img
          src={item.image}
          alt={item.name}
          className="size-20 rounded-xl object-cover object-top"
        />
      ) : (
        <div className="size-20 rounded-xl bg-neutral-03" />
      )}

      <div className="min-w-0 flex-1">
        <p className="text-sm text-black">{item.name}</p>
        <p className="mt-1 text-sm text-neutral-09">
          {formatPrice(item.price)} تومان
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-full border border-neutral-03 px-2 py-1">
        <button
          type="button"
          aria-label="کم کردن"
          onClick={() => onChangeCount(item.id, item.count - 1)}
          className="flex size-7 items-center justify-center"
        >
          <Minus className="size-3.5" strokeWidth={1.75} />
        </button>
        <span className="min-w-5 text-center text-sm">{item.count}</span>
        <button
          type="button"
          aria-label="زیاد کردن"
          onClick={() => onChangeCount(item.id, item.count + 1)}
          className="flex size-7 items-center justify-center"
        >
          <Plus className="size-3.5" strokeWidth={1.75} />
        </button>
      </div>

      <p className="w-28 text-left text-sm text-black">
        {formatPrice(linePrice)} تومان
      </p>

      <button
        type="button"
        aria-label="حذف از سبد"
        onClick={() => onRemove(item.id)}
        className="flex size-8 items-center justify-center rounded-full hover:bg-neutral-03"
      >
        <Trash2 className="size-4 text-neutral-09" strokeWidth={1.5} />
      </button>
    </div>
  );
}
