"use client";

// قبل از حذف، مشخصات کالا با رنگ قرمز نشان داده می‌شود.
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { removeProduct, type Product } from "@/lib/api/products";
import { formatPrice } from "@/lib/format";
import { nameList } from "@/lib/variants";
import Modal from "@/ui/Modal";

export default function ProductDeleteDialog({
  product,
  categoryLabel,
  onClose,
}: {
  product: Product | null;
  categoryLabel: string;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  async function remove() {
    if (!product) return;
    setSaving(true);
    setError(false);

    try {
      await removeProduct(product.id);
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-inventory"] });
      onClose();
    } catch {
      setError(true);
    }

    setSaving(false);
  }

  const colors = nameList(product?.color);
  const sizes = nameList(product?.size);

  return (
    <Modal
      open={Boolean(product)}
      title="حذف کالا"
      onClose={onClose}
      footer={
        product ? (
          <>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-neutral-03 px-4 py-2 text-sm text-neutral-11 hover:bg-neutral-03"
            >
              کنسل
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={remove}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-60"
            >
              {saving ? "در حال حذف..." : "تأیید"}
            </button>
          </>
        ) : null
      }
    >
      {product ? (
        <div className="space-y-3 text-sm leading-7">
          <p className="text-black">مطمئنی می‌خواهی این محصول را پاک کنی؟</p>
          <div className="rounded-xl bg-red-50 px-4 py-3 text-red-600">
            <p>نام: {product.name}</p>
            <p>دسته‌بندی: {categoryLabel || "بدون دسته‌بندی"}</p>
            <p>قیمت: {formatPrice(product.price)} تومان</p>
            <p>موجودی: {formatPrice(product.quantity)}</p>
            <p>رنگ: {colors.length > 0 ? colors.join("، ") : "—"}</p>
            <p>سایز: {sizes.length > 0 ? sizes.join("، ") : "—"}</p>
          </div>
          <p className="text-neutral-09">این کار از روی سرور پاک می‌شود و قابل بازگشت نیست.</p>
          {error ? <p className="text-red-600">حذف انجام نشد. دوباره تلاش کنید.</p> : null}
        </div>
      ) : null}
    </Modal>
  );
}
