"use client";


{/*مودال «این کالا حذف شود؟»



انصراف → بسته می‌شود
حذف → DELETE /products/:id
اگر سرور OK بدهد، کالا از جدول هم پاک می‌شود */}
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { removeProduct, type Product } from "@/lib/api/products";
import Modal from "@/ui/Modal";

export default function ProductDeleteDialog({
  product,
  onClose,
}: {
  product: Product | null;
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
      onClose();
    } catch {
      setError(true);
    }

    setSaving(false);
  }

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
              انصراف
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={remove}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-60"
            >
              {saving ? "در حال حذف..." : "حذف کالا"}
            </button>
          </>
        ) : null
      }
    >
      {product ? (
        <div className="space-y-3 text-sm leading-7 text-neutral-11">
          <p>
            کالای «{product.name}» حذف شود؟ این کار از روی سرور پاک می‌شود و قابل
            بازگشت نیست.
          </p>
          {error ? <p className="text-red-600">حذف انجام نشد. دوباره تلاش کنید.</p> : null}
        </div>
      ) : null}
    </Modal>
  );
}
