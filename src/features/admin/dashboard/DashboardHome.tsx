"use client";

// صفحهٔ اصلی پنل: نمودار فروش و سود، به‌علاوه وضعیت سفارش و انبار.

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Package, ShoppingBag, TrendingUp, Wallet } from "lucide-react";
import { orderPaid, useOrders, type AccountOrder } from "@/lib/account";
import { getProducts, type Product } from "@/lib/api/products";
import { faDigits, formatDate, formatPrice, formatToday } from "@/lib/format";
import TrendChart from "./TrendChart";
import {
  LOW_STOCK,
  buildSeries,
  discountedCount,
  latestOrders,
  lowStockProducts,
  seriesTotal,
  stockValue,
  type RangeId,
} from "./storeStats";

const ranges: { id: RangeId; label: string }[] = [
  { id: "week", label: "۷ روز" },
  { id: "month", label: "این ماه" },
];

async function loadCatalog() {
  const pageSize = 100;
  const first = await getProducts(1, undefined, undefined, pageSize);
  const products = [...(first.data ?? [])];
  let page = 2;

  while (products.length < first.total && page < 20) {
    const next = await getProducts(page, undefined, undefined, pageSize);
    if (!next.data?.length) break;
    products.push(...next.data);
    page = page + 1;
  }

  return products;
}

export default function DashboardHome() {
  const orders = useOrders();
  const [ready, setReady] = useState(false);
  const [range, setRange] = useState<RangeId>("week");

  useEffect(() => {
    setReady(true);
  }, []);

  const catalog = useQuery({
    queryKey: ["admin-dashboard-products"],
    queryFn: loadCatalog,
    enabled: ready,
  });

  if (!ready || !orders) {
    return <p className="text-sm text-neutral-09">در حال بارگذاری داشبورد...</p>;
  }

  const series = buildSeries(orders, range);
  const sales = seriesTotal(series.points, "sales");
  const profit = seriesTotal(series.points, "profit");
  const soldOrders = seriesTotal(series.points, "orders");
  const pending = orders.filter((order) => order.status === "pending").length;
  const delivered = orders.filter((order) => order.status === "delivered").length;
  const products = catalog.data ?? [];
  const scarce = lowStockProducts(products);
  const recent = latestOrders(orders);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-black">داشبورد فروشگاه</h1>
          <p className="mt-2 text-sm text-neutral-09">{formatToday()}</p>
        </div>
        <div className="flex rounded-lg bg-white p-1 ring-1 ring-neutral-03">
          {ranges.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setRange(item.id)}
              className={`rounded-md px-4 py-2 text-sm ${
                range === item.id
                  ? "bg-primary text-white"
                  : "text-neutral-11 hover:bg-neutral-03"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Wallet}
          label="فروش"
          value={`${formatPrice(sales)} تومان`}
          note={series.title}
        />
        <StatCard
          icon={TrendingUp}
          label="سود تخمینی"
          value={`${formatPrice(profit)} تومان`}
          note="۴۰٪ مبلغ کالا، بدون هزینه ارسال"
        />
        <StatCard
          icon={ShoppingBag}
          label="سفارش این بازه"
          value={faDigits(soldOrders)}
          note={`${faDigits(pending)} سفارش در انتظار ارسال`}
        />
        <StatCard
          icon={Package}
          label="ارزش موجودی"
          value={
            catalog.isPending
              ? "..."
              : `${formatPrice(stockValue(products))} تومان`
          }
          note={
            catalog.isPending
              ? "در حال خواندن کالاها"
              : `${faDigits(products.length)} کالا در کاتالوگ`
          }
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <TrendChart
          title="نمودار فروش"
          hint={series.title}
          points={series.points}
          field="sales"
          kind="bar"
          color="#b19276"
        />
        <TrendChart
          title="نمودار سود"
          hint="سود تخمینی هر روز، جدا از نمودار فروش"
          points={series.points}
          field="profit"
          kind="line"
          color="#231d18"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <StatusCard pending={pending} delivered={delivered} />
        <RecentOrders orders={recent} />
        <LowStock
          products={scarce}
          loading={catalog.isPending}
          failed={catalog.isError}
          discounted={discountedCount(products)}
        />
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon: typeof Wallet;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <article className="rounded-xl border border-neutral-03 bg-white p-5">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-lg bg-primary-tint-02 text-primary">
          <Icon className="size-4" strokeWidth={1.5} />
        </span>
        <p className="text-sm text-neutral-09">{label}</p>
      </div>
      <p className="mt-4 text-lg font-semibold text-black">{value}</p>
      <p className="mt-1 text-xs leading-6 text-neutral-08">{note}</p>
    </article>
  );
}

function StatusCard({ pending, delivered }: { pending: number; delivered: number }) {
  const total = pending + delivered;
  const radius = 36;
  const length = 2 * Math.PI * radius;
  const pendingLength = total === 0 ? 0 : (pending / total) * length;

  return (
    <section className="rounded-xl border border-neutral-03 bg-white p-5">
      <h2 className="text-base font-semibold text-black">وضعیت سفارش‌ها</h2>
      <div className="mt-5 flex items-center gap-5">
        <svg viewBox="0 0 100 100" className="size-24 shrink-0" aria-hidden="true">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#f2f2f3" strokeWidth="12" />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#b19276"
            strokeWidth="12"
            strokeDasharray={`${pendingLength} ${length - pendingLength}`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
          <text x="50" y="54" textAnchor="middle" fontSize="16" fill="#23242e">
            {faDigits(total)}
          </text>
        </svg>
        <div className="space-y-3 text-sm">
          <p className="flex items-center gap-2 text-neutral-11">
            <span className="size-2.5 rounded-full bg-primary" />
            در انتظار ارسال
            <span className="font-semibold text-black">{faDigits(pending)}</span>
          </p>
          <p className="flex items-center gap-2 text-neutral-11">
            <span className="size-2.5 rounded-full bg-neutral-03" />
            تحویل شده
            <span className="font-semibold text-black">{faDigits(delivered)}</span>
          </p>
          <Link href="/admin/orders" className="inline-block text-primary hover:underline">
            رفتن به سفارش‌ها
          </Link>
        </div>
      </div>
    </section>
  );
}

function RecentOrders({ orders }: { orders: AccountOrder[] }) {
  return (
    <section className="rounded-xl border border-neutral-03 bg-white p-5">
      <h2 className="text-base font-semibold text-black">آخرین سفارش‌ها</h2>
      {orders.length === 0 ? (
        <p className="mt-5 text-sm leading-7 text-neutral-09">
          هنوز سفارشی ثبت نشده است. با اولین خرید، این‌جا دیده می‌شود.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-neutral-03">
          {orders.map((order) => (
            <li key={order.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-black">
                  {order.buyerName || "خریدار"}
                </p>
                <p className="mt-1 text-xs text-neutral-08">
                  {order.createdAt ? formatDate(order.createdAt) : order.date}
                  {" · "}
                  {order.status === "delivered" ? "تحویل شده" : "در انتظار ارسال"}
                </p>
              </div>
              <p className="shrink-0 text-sm text-neutral-11">
                {formatPrice(orderPaid(order))}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function LowStock({
  products,
  loading,
  failed,
  discounted,
}: {
  products: Product[];
  loading: boolean;
  failed: boolean;
  discounted: number;
}) {
  return (
    <section className="rounded-xl border border-neutral-03 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-black">موجودی کم</h2>
        <Link href="/admin/inventory" className="text-sm text-primary hover:underline">
          موجودی
        </Link>
      </div>
      <p className="mt-1 text-xs text-neutral-08">
        کالاهایی که {faDigits(LOW_STOCK)} عدد یا کمتر مانده‌اند
        {loading ? "" : ` · ${faDigits(discounted)} کالای تخفیف‌دار`}
      </p>

      {loading ? (
        <p className="mt-5 text-sm text-neutral-09">در حال خواندن موجودی...</p>
      ) : failed ? (
        <p className="mt-5 text-sm text-neutral-09">خواندن کالاها انجام نشد.</p>
      ) : products.length === 0 ? (
        <p className="mt-5 text-sm leading-7 text-neutral-09">
          موجودی کالاها بالاتر از حد هشدار است.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {products.map((product) => {
            const left = Number(product.quantity) || 0;
            return (
              <li key={product.id} className="flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-2 text-sm text-neutral-11">
                  <AlertTriangle className="size-4 shrink-0 text-red-600" strokeWidth={1.5} />
                  <span className="truncate">{product.name}</span>
                </span>
                <span className={`shrink-0 text-sm ${left === 0 ? "text-red-600" : "text-neutral-11"}`}>
                  {faDigits(left)} عدد
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
