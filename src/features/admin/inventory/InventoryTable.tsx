"use client";
{/*جدول موجودی و قیمت.

داده از همان /products می‌آید با pagination ۵ تایی
ستون‌ها: تصویر | کالا | قیمت | موجودی
کلیک روی قیمت یا موجودی → آن سلول textbox می‌شود و عدد قبلی داخلش است
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
import { productPhoto, type Product } from "@/lib/api/products";
import Pagination from "@/ui/Pagination";
import EditableCell from "./EditableCell";

export default function InventoryTable() {
  const queryClient = useQueryClient();
  const [ready, setReady] = useState(false);
  const [page, setPage] = useState(1);
  const [ids, setIds] = useState<number[]>([]);
  const [values, setValues] = useState<Record<number, { price: string; quantity: string }>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [editField, setEditField] = useState<"price" | "quantity" | null>(null);
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
    setEditId(item.id);
    setEditField(field);
  }

  function typeNumber(item: Product, field: "price" | "quantity", value: string) {
    const row = rowOf(item);
    setValues({
      ...values,
      [item.id]: { ...row, [field]: value },
    });
  }

  function cancel(item: Product) {
    if (editId !== item.id || !editField) {
      setEditId(null);
      setEditField(null);
      return;
    }

    const row = { ...rowOf(item), [editField]: String(item[editField] ?? 0) };
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

    setEditId(null);
    setEditField(null);
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
    if (!editId || !failed.includes(editId)) {
      setEditId(null);
      setEditField(null);
    }
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
                const photo = productPhoto(item);

                return (
                  <tr
                    key={item.id}
                    className={index % 2 === 1 ? "bg-neutral-01" : "bg-white"}
                  >
                    <td className="px-4 py-3">
                      {photo ? (
                        <img
                          src={photo}
                          alt={item.name}
                          className="size-12 rounded-lg bg-neutral-03 object-cover"
                          onError={(e) => {
                            e.currentTarget.style.visibility = "hidden";
                          }}
                        />
                      ) : (
                        <div className="size-12 rounded-lg bg-neutral-03" />
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-black">{item.name}</td>
                    <td className="px-4 py-3">
                      <EditableCell
                        show={formatPrice(row.price)}
                        text={row.price}
                        isEdit={editId === item.id && editField === "price"}
                        onClick={() => clickNumber(item, "price")}
                        onType={(value) => typeNumber(item, "price", value)}
                        onEsc={() => cancel(item)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <EditableCell
                        show={row.quantity}
                        text={row.quantity}
                        isEdit={editId === item.id && editField === "quantity"}
                        onClick={() => clickNumber(item, "quantity")}
                        onType={(value) => typeNumber(item, "quantity", value)}
                        onEsc={() => cancel(item)}
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
        onPageChange={(next) => {
          setPage(next);
          setEditId(null);
          setEditField(null);
        }}
      />
    </div>
  );
}
