"use client";
// لیست سفارش نمونه را با فیلتر وضعیت و جزئیات مبلغ نشان می‌دهد.
// تاریخچه سفارش‌ها
// فیلتر و باز شدن جزئیات فقط ظاهر صفحه رو عوض می‌کنه
// خود لیست از لوکال خونده می‌شه

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/lib/format";
import {
  orderDiscount,
  orderPaid,
  useOrders,
  type AccountOrder,
  type OrderStatus,
} from "@/lib/account";
import EmptyState from "./EmptyState";

const statusText: Record<OrderStatus, string> = {
  courier: "ارسال با پیک",
  preparing: "در حال آماده‌سازی",
  pickup: "تحویل حضوری",
  delivered: "تحویل داده شده",
};

const statusClass: Record<OrderStatus, string> = {
  courier: "bg-emerald-50 text-emerald-700",
  delivered: "bg-emerald-50 text-emerald-700",
  preparing: "bg-amber-50 text-amber-700",
  pickup: "border border-emerald-200 bg-white text-emerald-700",
};

export default function OrdersPanel() {
  const orders = useOrders();
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState("");

  if (!orders) {
    return <p className="text-sm text-neutral-09">در حال بارگذاری...</p>;
  }

  // فیلتر ساده روی وضعیت
  const list = orders.filter((order) => {
    if (filter === "all") return true;
    return order.status === filter;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-base font-medium text-black">تاریخچه سفارشات</h1>

        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-09">نوع سفارش</span>
          <Select value={filter} onValueChange={(value) => setFilter(value || "all")}>
            <SelectTrigger className="w-36 rounded-full bg-white">
              <SelectValue placeholder="همه" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه</SelectItem>
              <SelectItem value="courier">ارسال با پیک</SelectItem>
              <SelectItem value="preparing">در حال آماده‌سازی</SelectItem>
              <SelectItem value="pickup">تحویل حضوری</SelectItem>
              <SelectItem value="delivered">تحویل داده شده</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {list.length === 0 ? (
        <Card className="shadow-none ring-neutral-03">
          <EmptyState
            text="در حال حاضر هیچ سفارشی ثبت نکرده‌اید."
            action={
              <Button asChild className="h-10 rounded-lg px-5">
                <Link href="/">برو به صفحه اصلی</Link>
              </Button>
            }
          />
        </Card>
      ) : (
        list.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            open={openId === order.id}
            onToggle={() => {
              if (openId === order.id) setOpenId("");
              else setOpenId(order.id);
            }}
          />
        ))
      )}
    </div>
  );
}

function OrderCard({
  order,
  open,
  onToggle,
}: {
  order: AccountOrder;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <Card className="gap-4 p-4 shadow-none ring-neutral-03 md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs text-neutral-08">{order.date}</span>
        <Badge className={`h-6 rounded-full px-3 ${statusClass[order.status]}`}>
          {statusText[order.status]}
        </Badge>
      </div>

      <p className="text-sm leading-7 text-neutral-11">{order.address}</p>

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-neutral-09">
        <span>مبلغ پرداخت شده: {formatPrice(orderPaid(order))} تومان</span>
        <span>تخفیف کل: {formatPrice(orderDiscount(order))} تومان</span>
        <span>هزینه ارسال: {formatPrice(order.shipping)} تومان</span>
      </div>

      <div className="flex justify-end">
        <Button type="button" variant="link" className="text-primary" onClick={onToggle}>
          {open ? "بستن جزئیات" : "جزئیات سفارش"}
        </Button>
      </div>

      {open ? <OrderTable order={order} /> : null}
    </Card>
  );
}

function OrderTable({ order }: { order: AccountOrder }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-03">
      <table className="w-full min-w-[520px] text-sm">
        <thead className="bg-neutral-01 text-neutral-09">
          <tr>
            <th className="px-3 py-2 text-right font-normal">عنوان کالا</th>
            <th className="px-3 py-2 font-normal">تعداد</th>
            <th className="px-3 py-2 font-normal">قیمت</th>
            <th className="px-3 py-2 font-normal">تخفیف</th>
            <th className="px-3 py-2 font-normal">مبلغ کل</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => {
            const line = item.price * item.count - item.discount;
            return (
              <tr key={item.id} className="border-t border-neutral-03">
                <td className="px-3 py-3 text-black">{item.name}</td>
                <td className="px-3 py-3 text-center">{formatPrice(item.count)}</td>
                <td className="px-3 py-3 text-center">{formatPrice(item.price)}</td>
                <td className="px-3 py-3 text-center">
                  {item.discount ? formatPrice(item.discount) : "—"}
                </td>
                <td className="px-3 py-3 text-center">{formatPrice(line)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
