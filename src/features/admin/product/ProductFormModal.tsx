"use client";

// مودال افزودن و ویرایش کالا
// فیلدها: چند عکس، نام، دسته کلی، دسته جزئی، قیمت، موجودی، توضیحات
// قیمت و موجودی با خود کالا ذخیره می‌شوند تا در صفحه موجودی هم دیده شوند

import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { fileUrl } from "@/lib/api/client";
import { type Category, type Sub } from "@/lib/api/categories";
import { uploadPhoto } from "@/lib/api/files";
import { addProduct, editProduct, type Product } from "@/lib/api/products";
import Modal from "@/ui/Modal";
import HtmlEditor from "./HtmlEditor";

const inputClass =
  "h-11 w-full rounded-lg border border-neutral-03 bg-neutral-01 px-3 text-sm text-black outline-none focus:border-primary focus:bg-white";

type PhotoItem = {
  id?: string;
  file?: File;
  preview: string;
};

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

  const [name, setName] = useState(product?.name ?? "");
  const [categoryId, setCategoryId] = useState(
    product?.category ? String(product.category) : "",
  );
  const [subId, setSubId] = useState(
    product?.subcategory ? String(product.subcategory) : "",
  );
  const [price, setPrice] = useState(product ? String(product.price ?? 0) : "");
  const [quantity, setQuantity] = useState(
    product ? String(product.quantity ?? 0) : "",
  );
  const [html, setHtml] = useState(product?.description ?? "");
  const [photos, setPhotos] = useState<PhotoItem[]>(existingPhotos(product));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // فقط زیردسته‌های همان دسته کلی
  const subOptions = subs.filter((sub) => String(sub.category) === categoryId);

  function changeCategory(value: string) {
    setCategoryId(value);
    const stillThere = subs.some((sub) => {
      return String(sub.category) === value && String(sub.id) === subId;
    });
    if (!stillThere) setSubId("");
  }

  function addFiles(list: FileList | null) {
    if (!list) return;
    const next = photos.slice();

    for (let i = 0; i < list.length; i++) {
      const file = list[i];
      next.push({
        file,
        preview: URL.createObjectURL(file),
      });
    }

    setPhotos(next);
  }

  function removePhoto(index: number) {
    const item = photos[index];
    if (item?.file) URL.revokeObjectURL(item.preview);
    const next = photos.filter((_, i) => i !== index);
    setPhotos(next);
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("نام کالا را وارد کنید.");
      return;
    }
    if (!categoryId) {
      setError("دسته‌بندی کلی را انتخاب کنید.");
      return;
    }
    if (subOptions.length > 0 && !subId) {
      setError("دسته‌بندی جزئی را انتخاب کنید.");
      return;
    }
    if (price.trim() === "") {
      setError("قیمت را وارد کنید.");
      return;
    }
    if (quantity.trim() === "") {
      setError("موجودی را وارد کنید.");
      return;
    }
    if (photos.length === 0) {
      setError("حداقل یک عکس اضافه کنید.");
      return;
    }

    setSaving(true);

    try {
      const photoIds: string[] = [];

      for (let i = 0; i < photos.length; i++) {
        const item = photos[i];
        if (item.file) {
          const id = await uploadPhoto(item.file);
          photoIds.push(id);
        } else if (item.id) {
          photoIds.push(item.id);
        }
      }

      const body = {
        name: name.trim(),
        brand: product?.brand ?? "",
        image: photoIds,
        thumbnail: photoIds[0] ?? "",
        price: Number(price) || 0,
        quantity: Number(quantity) || 0,
        category: Number(categoryId),
        subcategory: subId ? Number(subId) : undefined,
        description: html,
        createdAt: product?.createdAt ?? Date.now(),
      };

      if (product) {
        await editProduct(product.id, body);
      } else {
        await addProduct(body);
      }

      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-inventory"] });
      onClose();
    } catch {
      setError("ذخیره کالا انجام نشد.");
    }

    setSaving(false);
  }

  return (
    <form className="space-y-5" onSubmit={save}>
      <div className="flex flex-col gap-2 text-sm text-neutral-11">
        <span>تصاویر کالا</span>
        <div className="flex flex-wrap items-center gap-3">
          {photos.map((item, index) => (
            <div key={item.preview} className="relative">
              <img
                src={item.preview}
                alt=""
                className="size-16 rounded-lg bg-neutral-03 object-cover"
              />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute -top-2 -left-2 flex size-5 items-center justify-center rounded-full bg-black text-xs text-white"
                aria-label="حذف عکس"
              >
                ×
              </button>
            </div>
          ))}
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(event) => {
              addFiles(event.target.files);
              event.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="rounded-lg border border-neutral-03 px-3 py-2 text-sm text-neutral-11 hover:bg-neutral-03"
          >
            افزودن عکس
          </button>
        </div>
      </div>

      <label className="flex flex-col gap-2 text-sm text-neutral-11">
        <span>نام کالا</span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className={inputClass}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-neutral-11">
          <span>دسته‌بندی کلی</span>
          <select
            value={categoryId}
            onChange={(event) => changeCategory(event.target.value)}
            className={inputClass}
          >
            <option value="">انتخاب کنید</option>
            {categories.map((item) => (
              <option key={item.id} value={String(item.id)}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm text-neutral-11">
          <span>دسته‌بندی جزئی</span>
          <select
            value={subId}
            onChange={(event) => setSubId(event.target.value)}
            className={inputClass}
            disabled={!categoryId || subOptions.length === 0}
          >
            <option value="">
              {categoryId && subOptions.length === 0
                ? "زیردسته ندارد"
                : "انتخاب کنید"}
            </option>
            {subOptions.map((item) => (
              <option key={item.id} value={String(item.id)}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-neutral-11">
          <span>قیمت (تومان)</span>
          <input
            value={price}
            inputMode="numeric"
            onChange={(event) => setPrice(onlyDigits(event.target.value))}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-neutral-11">
          <span>موجودی</span>
          <input
            value={quantity}
            inputMode="numeric"
            onChange={(event) => setQuantity(onlyDigits(event.target.value))}
            className={inputClass}
          />
        </label>
      </div>

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

function existingPhotos(product: Product | null) {
  const photos: PhotoItem[] = [];
  if (!product) return photos;

  const ids =
    product.image && product.image.length > 0
      ? product.image
      : product.thumbnail
        ? [product.thumbnail]
        : [];

  for (let i = 0; i < ids.length; i++) {
    const preview = fileUrl(ids[i]);
    if (!preview) continue;
    photos.push({ id: ids[i], preview });
  }

  return photos;
}

function onlyDigits(value: string) {
  const persian = "۰۱۲۳۴۵۶۷۸۹";
  let result = "";

  for (let i = 0; i < value.length; i++) {
    const char = value[i];
    const persianIndex = persian.indexOf(char);
    if (persianIndex !== -1) result = result + String(persianIndex);
    else if (char >= "0" && char <= "9") result = result + char;
  }

  return result;
}
