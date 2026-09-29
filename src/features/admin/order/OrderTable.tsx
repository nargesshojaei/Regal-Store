"use client";

// جدول سفارش‌های ادمین
// لیست همان سفارش‌هایی است که در فروشگاه ثبت شده‌اند
// فیلتر: در انتظار ارسال / تحویل شده

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  orderPaid,
  useOrders,
  type AccountOrder,
  type OrderStatus,
} from "@/lib/account";
import { formatDate, formatPrice } from "@/lib/format";
import Pagination from "@/ui/Pagination";
import ProductPhoto from "@/ui/ProductPhoto";
import OrderModal from "./OrderModal";

const PAGE_SIZE = 5;

function orderTime(order: AccountOrder) {
  return order.createdAt || 0;
}

export default function OrderTable() {
  const orders = useOrders();
  const [status, setStatus] = useState<OrderStatus>("pending");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [openId, setOpenId] = useState("");

  const list = orders ?? [];
  const waiting = list.filter((order) => order.status === "pending").length;
  const done = list.filter((order) => order.status === "delivered").length;

  const filtered = list.filter((order) => order.status === status);
  const sorted = filtered.slice().sort((a, b) => {
    if (sort === "asc") return orderTime(a) - orderTime(b);
    return orderTime(b) - orderTime(a);
  });

  const start = (page - 1) * PAGE_SIZE;
  const visible = sorted.slice(start, start + PAGE_SIZE);
  const openOrder = list.find((order) => order.id === openId) ?? null;

  useEffect(() => {
    if (orders && visible.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [orders, page, visible.length]);

  function pickStatus(next: OrderStatus) {
    setStatus(next);
    setPage(1);
    setOpenId("");
  }

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
              onChange={() => pickStatus("pending")}
              className="accent-primary"
            />
            سفارش‌های در انتظار ارسال ({waiting})
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="order-status"
              checked={status === "delivered"}
              onChange={() => pickStatus("delivered")}
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
              <th className="whitespace-nowrap px-4 py-3 text-right font-medium">
                وضعیت سفارش
              </th>
            </tr>
          </thead>
          <tbody>
            {!orders ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-neutral-09">
                  در حال بارگذاری سفارش‌ها...
                </td>
              </tr>
            ) : visible.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-neutral-09">
                  {status === "pending"
                    ? "سفارشی در انتظار ارسال نیست."
                    : "سفارش تحویل‌شده‌ای وجود ندارد."}
                </td>
              </tr>
            ) : (
              visible.map((item, index) => (
                <tr
                  key={item.id}
                  className={index % 2 === 1 ? "bg-neutral-01" : "bg-white"}
                >
                  <td className="px-4 py-3 text-black">{item.buyerName || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {item.items.map((product) => (
                        <ProductPhoto
                          key={product.id}
                          src={product.image}
                          alt={product.name}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-11">
                    {item.items.map((product) => product.name).join("، ")}
                  </td>
                  <td className="px-4 py-3 text-neutral-11">
                    {formatPrice(orderPaid(item))}
                  </td>
                  <td className="px-4 py-3 text-neutral-11">
                    {item.createdAt ? formatDate(item.createdAt) : item.date}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setOpenId(item.id)}
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

      <div className="mt-3 text-xs text-neutral-08">
        <span>{filtered.length} سفارش</span>
      </div>

      <Pagination
        page={page}
        total={filtered.length}
        limit={PAGE_SIZE}
        onPageChange={setPage}
      />

      <OrderModal order={openOrder} onClose={() => setOpenId("")} />
    </div>
  );
}
