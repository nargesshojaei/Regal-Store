"use client";
{/* مودال افزودن و ویرایش.

فیلدها: عکس، نام، دسته‌بندی، توضیحات HTML
اگر عکس جدید انتخاب شود اول POST /upload می‌زند، بعد id فایل را با کالا ذخیره می‌کند
کالای جدید: POST /products
ویرایش: PATCH /products/:id
قیمت و موجودی قبلی را دست نمی‌زند (آن‌ها مال صفحه موجودی‌اند)
بعد از ذخیره، لیست کالا را از سرور دوباره می‌گیرد*/
}
import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { categoryName, type Category, type Sub } from "@/lib/api/categories";
import { uploadPhoto } from "@/lib/api/files";
import { addProduct, editProduct, productPhoto, type Product } from "@/lib/api/products";
import Modal from "@/ui/Modal";
import HtmlEditor from "./HtmlEditor";

const inputClass =
  "h-11 w-full rounded-lg border border-neutral-03 bg-neutral-01 px-3 text-sm text-black outline-none focus:border-primary focus:bg-white";

export default function ProductFormModal({
  open,
  product,
  categories,
  subs,
  onClose,
}: {
  open: boolean;
  product: Product | null;
  categories: Category[];
  subs: Sub[];
  onClose: () => void;
}) {
  return (
    <Modal
      open={open}
      title={product ? "افزودن / ویرایش کالا" : "افزودن کالا"}
      onClose={onClose}
    >
      {open ? (
        <Form
          key={product?.id ?? "new"}
          product={product}
          categories={categories}
          subs={subs}
          onClose={onClose}
        />
      ) : null}
    </Modal>
  );
}

function Form({
  product,
  categories,
  subs,
  onClose,
}: {
  product: Product | null;
  categories: Category[];
  subs: Sub[];
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const fileInput = useRef<HTMLInputElement>(null);

  const options =
    subs.length > 0
      ? subs.map((sub) => ({
          value: String(sub.id),
          category: Number(sub.category),
          subcategory: Number(sub.id),
          text: categoryName(sub.category, sub.id, categories, subs),
        }))
      : categories.map((cat) => ({
          value: String(cat.id),
          category: Number(cat.id),
          subcategory: undefined as number | undefined,
          text: cat.name,
        }));

  const firstValue =
    product?.subcategory && subs.length > 0
      ? String(product.subcategory)
      : product?.category
        ? String(product.category)
        : "";

  const [name, setName] = useState(product?.name ?? "");
  const [category, setCategory] = useState(firstValue);
  const [html, setHtml] = useState(product?.description ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [photo, setPhoto] = useState(product ? productPhoto(product) : undefined);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const selected = options.find((item) => item.value === category);
    if (!name.trim()) {
      setError("نام کالا را وارد کنید.");
      return;
    }
    if (!selected) {
      setError("دسته‌بندی را انتخاب کنید.");
      return;
    }

    setSaving(true);

    try {
      let photoId = "";
      if (product) {
        photoId = product.thumbnail || "";
        if (!photoId && product.image && product.image[0]) {
          photoId = product.image[0];
        }
      }
      if (file) {
        photoId = await uploadPhoto(file);
      }

      const body = {
        name: name.trim(),
        brand: product?.brand ?? "",
        image: photoId ? [photoId] : [],
        thumbnail: photoId ?? "",
        price: product?.price ?? 0,
        quantity: product?.quantity ?? 0,
        category: selected.category,
        subcategory: selected.subcategory,
        description: html,
        createdAt: product?.createdAt ?? Date.now(),
      };

      if (product) {
        await editProduct(product.id, body);
      } else {
        await addProduct(body);
      }

      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      onClose();
    } catch {
      setError("ذخیره کالا انجام نشد.");
    }

    setSaving(false);
  }

  return (
    <form className="space-y-5" onSubmit={save}>
      <label className="flex flex-col gap-2 text-sm text-neutral-11">
        <span>تصویر کالا</span>
        <div className="flex flex-wrap items-center gap-3">
          {photo ? (
            <img
              src={photo}
              alt={name || "تصویر کالا"}
              className="size-16 rounded-lg bg-neutral-03 object-cover"
            />
          ) : (
            <div className="size-16 rounded-lg bg-neutral-03" />
          )}
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const next = e.target.files?.[0] ?? null;
              setFile(next);
              if (next) setPhoto(URL.createObjectURL(next));
            }}
          />
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="rounded-lg border border-neutral-03 px-3 py-2 text-sm text-neutral-11 hover:bg-neutral-03"
          >
            انتخاب عکس
          </button>
        </div>
      </label>

      <label className="flex flex-col gap-2 text-sm text-neutral-11">
        <span>نام کالا</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-2 text-sm text-neutral-11">
        <span>دسته‌بندی</span>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={inputClass}
        >
          <option value="">انتخاب کنید</option>
          {options.map((item, index) => (
            <option key={`option-${item.value}-${index}`} value={item.value}>
              {item.text}
            </option>
          ))}
        </select>
      </label>

      <div className="flex flex-col gap-2 text-sm text-neutral-11">
        <span>توضیحات</span>
        <HtmlEditor html={product?.description ?? ""} onChange={setHtml} disabled={saving} />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-primary px-5 py-2 text-sm text-white hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "در حال ذخیره..." : "ذخیره"}
        </button>
      </div>
    </form>
  );
}
