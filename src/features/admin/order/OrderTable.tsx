"use client";
 {/*جدول سفارش‌ها.


  
دو فیلتر رادیویی که سمت سرور فیلتر می‌شوند: delivered=false / delivered=true
کنار هر فیلتر تعداد سفارش همان وضعیت را نشان می‌دهد
مرتب‌سازی زمان ثبت سفارش (asc / desc) هم سمت سرور است
ستون‌ها: نام کاربر | تصویر کالا | نام کالا | مبلغ | تاریخ | بررسی سفارش
صفحه‌بندی ۵ تایی
کلیک «بررسی سفارش» مودال را باز می‌کن */}
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { getOrderCount, getOrders, PAGE_SIZE } from "@/lib/api/orders";
import { fileUrl } from "@/lib/api/client";
import { formatDate, formatPrice } from "@/lib/format";
import { orderCustomerName, type Order } from "@/types/order";
import Pagination from "@/ui/Pagination";
import OrderModal from "./OrderModal";

export default function OrderTable() {
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<"pending" | "delivered">("pending");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [order, setOrder] = useState<Order | null>(null);

  const delivered = status === "delivered";

  useEffect(() => {
    setReady(true);
  }, []);

  const list = useQuery({
    queryKey: ["admin-orders", delivered, page, sort],
    queryFn: () => getOrders(page, delivered, sort),
    enabled: ready,
  });

  const counts = useQuery({
    queryKey: ["admin-orders", "counts"],
    queryFn: async () => ({
      pending: await getOrderCount(false),
      delivered: await getOrderCount(true),
    }),
    enabled: ready,
  });

  const waiting = counts.data?.pending ?? 0;
  const done = counts.data?.delivered ?? 0;
  const orders = list.data?.data ?? [];
  const total = list.data?.total ?? 0;
  const loading = !ready || list.isPending;

  useEffect(() => {
    if (!loading && orders.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [loading, orders.length, page]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-black">مدیریت سفارش‌ها</h1>
        <fieldset className="flex flex-wrap items-center gap-5 text-sm text-neutral-11">
          <legend className="sr-only">فیلتر وضعیت سفارش</legend>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="order-status"
              checked={status === "pending"}
              onChange={() => {
                setStatus("pending");
                setPage(1);
                setOrder(null);
              }}
              className="accent-primary"
            />
            سفارش‌های در انتظار ارسال ({waiting})
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="order-status"
              checked={status === "delivered"}
              onChange={() => {
                setStatus("delivered");
                setPage(1);
                setOrder(null);
              }}
              className="accent-primary"
            />
            سفارش‌های تحویل شده ({done})
          </label>
        </fieldset>
      </div>

      <div className="overflow-x-auto rounded-xl border border-neutral-13 bg-white">
        <table className="w-full min-w-[40rem] text-sm">
          <thead className="bg-neutral-03 text-neutral-11">
            <tr>
              <th className="px-4 py-3 text-right font-medium">نام کاربر</th>
              <th className="px-4 py-3 text-right font-medium">تصویر</th>
              <th className="px-4 py-3 text-right font-medium">کالا</th>
              <th className="px-4 py-3 text-right font-medium">مجموع مبلغ</th>
              <th className="px-4 py-3 text-right font-medium">
                <button
                  type="button"
                  onClick={() => {
                    setSort(sort === "desc" ? "asc" : "desc");
                    setPage(1);
                  }}
                  className="inline-flex items-center gap-1"
                >
                  زمان ثبت سفارش
                  <ChevronDown
                    className={`size-4 transition-transform ${sort === "asc" ? "rotate-180" : ""}`}
                    strokeWidth={1.5}
                  />
                </button>
              </th>
              <th className="px-4 py-3 text-right font-medium">
                <span className="sr-only">عملیات</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-neutral-09">
                  در حال بارگذاری سفارش‌ها...
                </td>
              </tr>
            ) : list.isError ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <p className="text-neutral-09">دریافت سفارش‌ها با خطا مواجه شد.</p>
                  <button
                    type="button"
                    onClick={() => list.refetch()}
                    className="mt-3 text-sm text-primary underline"
                  >
                    تلاش دوباره
                  </button>
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-neutral-09">
                  {status === "pending"
                    ? "سفارشی در انتظار ارسال نیست. اگر سفارش را تحویل زده‌اید، فیلتر «تحویل شده» را بزنید."
                    : "سفارش تحویل‌شده‌ای وجود ندارد."}
                </td>
              </tr>
            ) : (
              orders.map((item, index) => (
                <tr
                  key={item.id}
                  className={index % 2 === 1 ? "bg-neutral-01" : "bg-white"}
                >
                  <td className="px-4 py-3 text-black">{orderCustomerName(item)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {(item.products ?? []).map((p, i) => {
                        const photo = fileUrl(p.image);
                        return photo ? (
                          <img
                            key={`${p.id}-${i}`}
                            src={photo}
                            alt={p.name}
                            className="size-12 rounded-lg bg-neutral-03 object-cover"
                            onError={(e) => {
                              e.currentTarget.style.visibility = "hidden";
                            }}
                          />
                        ) : (
                          <div
                            key={`${p.id}-${i}`}
                            className="size-12 rounded-lg bg-neutral-03"
                          />
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-11">
                    {(item.products ?? [])
                      .map((p) => p.name)
                      .filter(Boolean)
                      .join("، ")}
                  </td>
                  <td className="px-4 py-3 text-neutral-11">{formatPrice(item.prices)}</td>
                  <td className="px-4 py-3 text-neutral-11">{formatDate(item.createdAt)}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setOrder(item)}
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      بررسی سفارش
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-neutral-08">
        <span>{total} سفارش</span>
        <span>{list.isFetching && !loading ? "در حال به‌روزرسانی..." : null}</span>
      </div>

      <Pagination page={page} total={total} limit={PAGE_SIZE} onPageChange={setPage} />

      <OrderModal order={order} onClose={() => setOrder(null)} />
    </div>
  );
}
