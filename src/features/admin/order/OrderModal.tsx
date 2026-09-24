"use client";
{/* جزئیات یک سفارش.


  
اگر لیست ناقص باشد، GET /orders/:id جزئیات کامل را می‌گیرد
نشان می‌دهد: نام، تلفن، آدرس، زمان ثبت، زمان تحویل درخواستی، وضعیت
سبد خرید: تصویر | نام | قیمت | تعداد | مجموع — ستون تصویر جدا از نام است
اگر هنوز تحویل نشده، دکمه «ثبت اتمام تحویل» → PATCH /orders/:id با { delivered: true }*/}
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrder, setOrderDelivered } from "@/lib/api/orders";
import { formatDate, formatPrice } from "@/lib/format";
import {
  isOrderDelivered,
  orderCustomerName,
  orderProductCount,
  orderProductPrice,
  type Order,
} from "@/types/order";
import Modal from "@/ui/Modal";
import ProductPhoto from "@/ui/ProductPhoto";
import OrderStatusBadge from "./OrderStatusBadge";

export default function OrderModal({
  order,
  onClose,
}: {
  order: Order | null;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  const details = useQuery({
    queryKey: ["admin-order", order?.id],
    queryFn: () => getOrder(order!.id),
    enabled: Boolean(order),
    placeholderData: order ?? undefined,
  });

  const data = details.data ?? order;
  const delivered = data ? isOrderDelivered(data.delivered) : false;

  async function markDone() {
    if (!data) return;
    setSaving(true);
    setError(false);

    try {
      await setOrderDelivered(data.id);
      await queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-order"] });
      onClose();
    } catch {
      setError(true);
    }

    setSaving(false);
  }

  return (
    <Modal
      open={Boolean(order)}
      title="بررسی سفارش"
      onClose={onClose}
      footer={
        data ? (
          <>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-neutral-03 px-4 py-2 text-sm text-neutral-11 hover:bg-neutral-03"
            >
              بستن
            </button>
            {!delivered ? (
              <button
                type="button"
                disabled={saving}
                onClick={markDone}
                className="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-60"
              >
                {saving ? "در حال ثبت..." : "ثبت اتمام تحویل"}
              </button>
            ) : null}
          </>
        ) : null
      }
    >
      {data ? (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-neutral-09">شماره سفارش: {data.id}</p>
            <OrderStatusBadge delivered={data.delivered} />
          </div>

          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div className="rounded-xl bg-neutral-01 px-4 py-3">
              <dt className="text-neutral-08">نام کاربر</dt>
              <dd className="mt-1 font-medium text-black">{orderCustomerName(data)}</dd>
            </div>
            <div className="rounded-xl bg-neutral-01 px-4 py-3">
              <dt className="text-neutral-08">شماره تماس</dt>
              <dd className="mt-1 font-medium text-black">{data.phone}</dd>
            </div>
            <div className="rounded-xl bg-neutral-01 px-4 py-3 sm:col-span-2">
              <dt className="text-neutral-08">آدرس</dt>
              <dd className="mt-1 font-medium leading-7 text-black">{data.address}</dd>
            </div>
            <div className="rounded-xl bg-neutral-01 px-4 py-3">
              <dt className="text-neutral-08">زمان ثبت سفارش</dt>
              <dd className="mt-1 font-medium text-black">{formatDate(data.createdAt)}</dd>
            </div>
            <div className="rounded-xl bg-neutral-01 px-4 py-3">
              <dt className="text-neutral-08">زمان تحویل درخواستی</dt>
              <dd className="mt-1 font-medium text-black">{formatDate(data.expectAt)}</dd>
            </div>
          </dl>

          <div>
            <h3 className="mb-3 text-sm font-medium text-black">سبد خرید</h3>
            <div className="overflow-x-auto rounded-xl border border-neutral-03">
              <table className="w-full min-w-[32rem] text-sm">
                <thead className="bg-neutral-01 text-neutral-09">
                  <tr>
                    <th className="px-4 py-3 text-right font-medium">تصویر</th>
                    <th className="px-4 py-3 text-right font-medium">کالا</th>
                    <th className="px-4 py-3 text-right font-medium">قیمت</th>
                    <th className="px-4 py-3 text-right font-medium">تعداد</th>
                    <th className="px-4 py-3 text-right font-medium">مجموع</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.products ?? []).map((item, index) => {
                    const count = orderProductCount(item);
                    const price = orderProductPrice(item);

                    return (
                      <tr key={`${item.id}-${index}`} className="border-t border-neutral-03">
                        <td className="px-4 py-3">
                          <ProductPhoto src={item.image} alt={item.name} />
                        </td>
                        <td className="px-4 py-3 font-medium text-black">{item.name}</td>
                        <td className="px-4 py-3 text-neutral-11">{formatPrice(price)}</td>
                        <td className="px-4 py-3 text-neutral-11">{count}</td>
                        <td className="px-4 py-3 text-black">{formatPrice(price * count)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-left text-sm font-semibold text-black">
              مجموع مبلغ: {formatPrice(data.prices)} تومان
            </p>
          </div>

          {error ? (
            <p className="text-sm text-red-600">ثبت تحویل انجام نشد. دوباره تلاش کنید.</p>
          ) : null}
        </div>
      ) : null}
    </Modal>
  );
}
