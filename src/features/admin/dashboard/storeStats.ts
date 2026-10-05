// آمار داشبورد از سفارش‌های فروشگاه و کاتالوگ کالا.
// فروش = مبلغی که مشتری پرداخته است.
// سود = ۴۰٪ مبلغ کالا بعد از تخفیف. قیمت خرید در کاتالوگ نیست،
// برای همین این حاشیهٔ معمول پوشاک را یک‌جا این‌جا نگه داشته‌ایم.

import { orderPaid, type AccountOrder } from "@/lib/account";
import type { Product } from "@/lib/api/products";
import { faDigits } from "@/lib/format";
import { gregorianToJalali, JALALI_MONTHS, type JalaliDate } from "@/lib/jalali";

export const PROFIT_RATE = 0.4;
export const LOW_STOCK = 5;

export type RangeId = "week" | "month";

export type DayPoint = {
  key: string;
  label: string;
  sales: number;
  profit: number;
  orders: number;
};

export type SalesSeries = {
  points: DayPoint[];
  title: string;
};

function goodsTotal(order: AccountOrder) {
  let sum = 0;

  for (let i = 0; i < order.items.length; i++) {
    const item = order.items[i];
    sum = sum + item.price * item.count - item.discount;
  }

  return Math.max(0, sum);
}

export function orderProfit(order: AccountOrder) {
  return Math.round(goodsTotal(order) * PROFIT_RATE);
}

function orderMoment(order: AccountOrder) {
  if (!order.createdAt) return null;
  const date = new Date(order.createdAt);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function jalaliOf(date: Date): JalaliDate {
  return gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

function dayKey(date: JalaliDate) {
  return `${date.year}-${date.month}-${date.day}`;
}

function shiftDay(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function daysOfRange(range: RangeId, today: Date) {
  const days: Date[] = [];

  if (range === "week") {
    for (let ago = 6; ago >= 0; ago--) {
      days.push(shiftDay(today, -ago));
    }
    return days;
  }

  const current = jalaliOf(today);
  const monthDays: Date[] = [];
  let cursor = new Date(today);

  while (monthDays.length < 31) {
    const seen = jalaliOf(cursor);
    if (seen.year !== current.year || seen.month !== current.month) break;
    monthDays.push(new Date(cursor));
    cursor = shiftDay(cursor, -1);
  }

  monthDays.reverse();
  return monthDays;
}

function rangeTitle(range: RangeId, today: Date) {
  const current = jalaliOf(today);
  const month = JALALI_MONTHS[current.month - 1];

  if (range === "month") {
    return `${month} ${faDigits(current.year)}`;
  }

  return `۷ روز اخیر · ${month} ${faDigits(current.year)}`;
}

export function buildSeries(
  orders: AccountOrder[],
  range: RangeId,
  today = new Date(),
): SalesSeries {
  const days = daysOfRange(range, today);

  const points = days.map((date) => {
    const jalali = jalaliOf(date);
    const key = dayKey(jalali);
    let sales = 0;
    let profit = 0;
    let count = 0;

    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      const moment = orderMoment(order);
      if (!moment) continue;
      if (dayKey(jalaliOf(moment)) !== key) continue;

      sales = sales + orderPaid(order);
      profit = profit + orderProfit(order);
      count = count + 1;
    }

    return {
      key,
      label: faDigits(jalali.day),
      sales,
      profit,
      orders: count,
    };
  });

  return { points, title: rangeTitle(range, today) };
}

export function seriesTotal(points: DayPoint[], field: "sales" | "profit" | "orders") {
  let sum = 0;
  for (let i = 0; i < points.length; i++) {
    sum = sum + points[i][field];
  }
  return sum;
}

export function latestOrders(orders: AccountOrder[], count = 4) {
  return orders
    .slice()
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    .slice(0, count);
}

export function lowStockProducts(products: Product[], count = 5) {
  return products
    .filter((item) => (Number(item.quantity) || 0) <= LOW_STOCK)
    .sort((a, b) => (Number(a.quantity) || 0) - (Number(b.quantity) || 0))
    .slice(0, count);
}

export function stockValue(products: Product[]) {
  let sum = 0;
  for (let i = 0; i < products.length; i++) {
    const item = products[i];
    sum = sum + (Number(item.price) || 0) * (Number(item.quantity) || 0);
  }
  return sum;
}

export function discountedCount(products: Product[]) {
  let count = 0;
  for (let i = 0; i < products.length; i++) {
    if ((products[i].discount || 0) > 0) count = count + 1;
  }
  return count;
}
