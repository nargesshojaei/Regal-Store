"use client";
{/*جدول موجودی و قیمت.

داده از همان /products می‌آید با pagination ۵ تایی
ستون‌ها: تصویر | کالا | قیمت | موجودی
کلیک روی قیمت یا موجودی → آن سلول textbox می‌شود و عدد قبلی داخلش است
چند سلول می‌توانند همزمان باز بمانند؛ کلیک روی سلول دیگر قبلی را نمی‌بندد
id آن کالا در آرایه changedIds می‌ماند
مقدار جدید در drafts نگه داشته می‌شود تا ذخیره زده شود
دکمه ذخیره: اگر changedIds خالی باشد غیرفعال است
با ذخیره، برای هر id یک PATCH /products/:id جدا با { price, quantity } زده می‌شود
اگر PATCH موفق باشد، textbox آن ردیف بسته می‌شود و id از آرایه در می‌آید
اگر یکی fail شود، بقیه که موفق بودند پاک می‌شوند و ناموفق‌ها در آرایه می‌مانند */}

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getInventory, PAGE_SIZE, saveInventory } from "@/lib/api/inventory";
import { formatPrice } from "@/lib/format";
import { type Product } from "@/lib/api/products";
import Pagination from "@/ui/Pagination";
import ProductPhoto from "@/ui/ProductPhoto";
import EditableCell from "./EditableCell";

export default function InventoryTable() {
  const queryClient = useQueryClient();
  const [ready, setReady] = useState(false);
  const [page, setPage] = useState(1);
  const [ids, setIds] = useState<number[]>([]);
  const [values, setValues] = useState<Record<number, { price: string; quantity: string }>>({});
  const [editing, setEditing] = useState<Record<string, true>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setReady(true);
  }, []);

  const list = useQuery({
    queryKey: ["admin-inventory", page],
    queryFn: () => getInventory(page),
    enabled: ready,
  });

  const products = list.data?.data ?? [];
  const total = list.data?.total ?? 0;
  const loading = !ready || list.isPending;

  function rowOf(item: Product) {
    return (
      values[item.id] ?? {
        price: String(item.price ?? 0),
        quantity: String(item.quantity ?? 0),
      }
    );
  }

  function cellKey(id: number, field: "price" | "quantity") {
    return `${id}:${field}`;
  }

  function clickNumber(item: Product, field: "price" | "quantity") {
    if (!values[item.id]) {
      setValues({
        ...values,
        [item.id]: {
          price: String(item.price ?? 0),
          quantity: String(item.quantity ?? 0),
        },
      });
    }
    if (!ids.includes(item.id)) {
      setIds([...ids, item.id]);
    }
    setEditing({ ...editing, [cellKey(item.id, field)]: true });
  }

  function typeNumber(item: Product, field: "price" | "quantity", value: string) {
    const row = rowOf(item);
    setValues({
      ...values,
      [item.id]: { ...row, [field]: value },
    });
  }

  function cancel(item: Product, field: "price" | "quantity") {
    const row = { ...rowOf(item), [field]: String(item[field] ?? 0) };
    const same =
      Number(row.price) === Number(item.price) &&
      Number(row.quantity) === Number(item.quantity);

    if (same) {
      const nextValues = { ...values };
      delete nextValues[item.id];
      setValues(nextValues);
      setIds(ids.filter((id) => id !== item.id));
    } else {
      setValues({ ...values, [item.id]: row });
    }

    const nextEditing = { ...editing };
    delete nextEditing[cellKey(item.id, field)];
    setEditing(nextEditing);
  }

  async function save() {
    setSaving(true);
    setError("");
    const failed: number[] = [];

    for (const id of ids) {
      const row = values[id];
      if (!row) continue;
      try {
        await saveInventory(id, Number(row.price) || 0, Number(row.quantity) || 0);
      } catch {
        failed.push(id);
      }
    }

    setIds(failed);
    const nextValues: Record<number, { price: string; quantity: string }> = {};
    for (const id of failed) {
      if (values[id]) nextValues[id] = values[id];
    }
    setValues(nextValues);
    const nextEditing: Record<string, true> = {};
    for (const id of failed) {
      if (editing[cellKey(id, "price")]) nextEditing[cellKey(id, "price")] = true;
      if (editing[cellKey(id, "quantity")]) nextEditing[cellKey(id, "quantity")] = true;
    }
    setEditing(nextEditing);
    await queryClient.invalidateQueries({ queryKey: ["admin-inventory"] });
    if (failed.length > 0) setError("بعضی کالاها ذخیره نشد. دوباره تلاش کنید.");
    setSaving(false);
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-black">مدیریت موجودی و قیمت‌ها</h1>
        <button
          type="button"
          disabled={ids.length === 0 || saving}
          onClick={save}
          className="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? "در حال ذخیره..." : "ذخیره"}
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-neutral-13 bg-white">
        <table className="w-full min-w-[36rem] text-sm">
          <thead className="bg-neutral-03 text-neutral-11">
            <tr>
              <th className="px-4 py-3 text-right font-medium">تصویر</th>
              <th className="px-4 py-3 text-right font-medium">کالا</th>
              <th className="px-4 py-3 text-right font-medium">قیمت</th>
              <th className="px-4 py-3 text-right font-medium">موجودی</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-neutral-09">
                  در حال بارگذاری موجودی...
                </td>
              </tr>
            ) : list.isError ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center">
                  <p className="text-neutral-09">دریافت موجودی با خطا مواجه شد.</p>
                  <button
                    type="button"
                    onClick={() => list.refetch()}
                    className="mt-3 text-sm text-primary underline"
                  >
                    تلاش دوباره
                  </button>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-neutral-09">
                  کالایی برای نمایش موجودی نیست.
                </td>
              </tr>
            ) : (
              products.map((item, index) => {
                const row = rowOf(item);

                return (
                  <tr
                    key={`inventory-${page}-${index}-${item.id}`}
                    className={index % 2 === 1 ? "bg-neutral-01" : "bg-white"}
                  >
                    <td className="px-4 py-3">
                      <ProductPhoto product={item} alt={item.name} />
                    </td>
                    <td className="px-4 py-3 font-medium text-black">{item.name}</td>
                    <td className="px-4 py-3">
                      <EditableCell
                        show={formatPrice(row.price)}
                        text={row.price}
                        isEdit={Boolean(editing[cellKey(item.id, "price")])}
                        onClick={() => clickNumber(item, "price")}
                        onType={(value) => typeNumber(item, "price", value)}
                        onEsc={() => cancel(item, "price")}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <EditableCell
                        show={row.quantity}
                        text={row.quantity}
                        isEdit={Boolean(editing[cellKey(item.id, "quantity")])}
                        onClick={() => clickNumber(item, "quantity")}
                        onType={(value) => typeNumber(item, "quantity", value)}
                        onEsc={() => cancel(item, "quantity")}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-neutral-08">
        <span>{total} کالا</span>
        <span>{list.isFetching && !loading ? "در حال به‌روزرسانی..." : null}</span>
      </div>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      <Pagination
        page={page}
        total={total}
        limit={PAGE_SIZE}
        onPageChange={setPage}
      />
    </div>
  );
}
