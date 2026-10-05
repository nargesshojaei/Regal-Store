"use client";

// جزئیات یک سفارش فروشگاه
// دکمه «ثبت اتمام تحویل» وضعیت را در همان لیست تحویل‌شده می‌کند

import { formatDate, formatLongDate, formatPrice } from "@/lib/format";
import {
  markOrderDelivered,
  orderPaid,
  type AccountOrder,
} from "@/lib/account";
import Modal from "@/ui/Modal";
import ProductPhoto from "@/ui/ProductPhoto";
import { ColorText } from "@/ui/VariantText";
import OrderStatusBadge from "./OrderStatusBadge";

export default function OrderModal({
  order,
  onClose,
}: {
  order: AccountOrder | null;
  onClose: () => void;
}) {
  const delivered = order?.status === "delivered";

  function markDone() {
    if (!order) return;
    markOrderDelivered(order.id);
    onClose();
  }

  return (
    <Modal
      open={Boolean(order)}
      title="بررسی سفارش"
      onClose={onClose}
      footer={
        order ? (
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
                onClick={markDone}
                className="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:opacity-90"
              >
                ثبت اتمام تحویل
              </button>
            ) : null}
          </>
        ) : null
      }
    >
      {order ? (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-neutral-09">شماره سفارش: {order.id}</p>
            <OrderStatusBadge status={order.status} />
          </div>

          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <Info label="نام کاربر" value={order.buyerName || "—"} />
            <Info label="شماره تماس" value={order.phone || "ثبت نشده"} />
            <Info label="آدرس" value={order.address} wide />
            <Info
              label="زمان ثبت سفارش"
              value={order.createdAt ? formatDate(order.createdAt) : order.date}
            />
            <Info
              label="زمان تحویل درخواستی"
              value={order.deliveryDate ? formatLongDate(order.deliveryDate) : "—"}
            />
            {order.postalCode ? <Info label="کد پستی" value={order.postalCode} /> : null}
            {order.notes ? <Info label="توضیحات" value={order.notes} wide /> : null}
          </dl>

          <div>
            <h3 className="mb-3 text-sm font-medium text-black">سبد خرید</h3>
            <div className="overflow-x-auto rounded-xl border border-neutral-03">
              <table className="w-full min-w-[32rem] text-sm">
                <thead className="bg-neutral-01 text-neutral-09">
                  <tr>
                    <th className="px-4 py-3 text-right font-medium">تصویر</th>
                    <th className="px-4 py-3 text-right font-medium">کالا</th>
                    <th className="px-4 py-3 text-right font-medium">رنگ</th>
                    <th className="px-4 py-3 text-right font-medium">سایز</th>
                    <th className="px-4 py-3 text-right font-medium">قیمت</th>
                    <th className="px-4 py-3 text-right font-medium">تعداد</th>
                    <th className="px-4 py-3 text-right font-medium">مجموع</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => {
                    const line = item.price * item.count;
                    return (
                      <tr key={item.id} className="border-t border-neutral-03">
                        <td className="px-4 py-3">
                          <ProductPhoto src={item.image} alt={item.name} />
                        </td>
                        <td className="px-4 py-3 font-medium text-black">{item.name}</td>
                        <td className="px-4 py-3 text-neutral-11">
                          <ColorText name={item.color} hex={item.colorHex} />
                        </td>
                        <td className="px-4 py-3 text-neutral-11">{item.size || "—"}</td>
                        <td className="px-4 py-3 text-neutral-11">{formatPrice(item.price)}</td>
                        <td className="px-4 py-3 text-neutral-11">{item.count}</td>
                        <td className="px-4 py-3 text-black">{formatPrice(line)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-left text-sm font-semibold text-black">
              مجموع مبلغ: {formatPrice(orderPaid(order))} تومان
            </p>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}

function Info({
  label,
  value,
  wide,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div className={`rounded-xl bg-neutral-01 px-4 py-3 ${wide ? "sm:col-span-2" : ""}`}>
      <p className="text-neutral-08">{label}</p>
      <p className="mt-1 font-medium leading-7 text-black">{value}</p>
    </div>
  );
}
