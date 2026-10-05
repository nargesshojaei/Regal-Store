"use client";

// مودال افزودن و ویرایش کالا
// فیلدها: چند عکس، نام، دسته کلی، دسته جزئی، قیمت، موجودی، توضیحات
// قیمت و موجودی با خود کالا ذخیره می‌شوند تا در صفحه موجودی هم دیده شوند

import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fileUrl } from "@/lib/api/client";
import { type Category, type Sub } from "@/lib/api/categories";
import { uploadPhoto } from "@/lib/api/files";
import { addProduct, editProduct, getProducts, imageIds, type Product } from "@/lib/api/products";
import {
  COLOR_CHOICES,
  SIZE_CHOICES,
  colorHex,
  nameList,
  uniqueNames,
} from "@/lib/variants";
import Modal from "@/ui/Modal";
import SafeImage from "@/ui/SafeImage";
import HtmlEditor from "./HtmlEditor";

const inputClass =
  "h-11 w-full rounded-lg border border-neutral-03 bg-neutral-01 px-3 text-sm text-black outline-none focus:border-primary focus:bg-white";

type PhotoItem = {
  key: string;
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
  const [colors, setColors] = useState<string[]>(nameList(product?.color));
  const [sizes, setSizes] = useState<string[]>(nameList(product?.size));
  const [extraColors, setExtraColors] = useState<string[]>([]);
  const [extraSizes, setExtraSizes] = useState<string[]>([]);
  const [colorText, setColorText] = useState("");
  const [sizeText, setSizeText] = useState("");
  const [photos, setPhotos] = useState<PhotoItem[]>(existingPhotos(product));
  const [zoom, setZoom] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const catalog = useQuery({
    queryKey: ["admin-variant-options"],
    queryFn: async () => (await getProducts(1, undefined, undefined, 100)).data || [],
  });

  const colorOptions = uniqueNames([
    ...COLOR_CHOICES.map((item) => item.name),
    ...(catalog.data || []).flatMap((item) => nameList(item.color)),
    ...colors,
    ...extraColors,
  ]);
  const sizeOptions = uniqueNames([
    ...SIZE_CHOICES,
    ...(catalog.data || []).flatMap((item) => nameList(item.size)),
    ...sizes,
    ...extraSizes,
  ]);

  // فقط زیردسته‌های همان دسته کلی
  const subOptions = subs.filter((sub) => String(sub.category) === categoryId);

  function changeCategory(value: string) {
    setCategoryId(value);
    const stillThere = subs.some((sub) => {
      return String(sub.category) === value && String(sub.id) === subId;
    });
    if (!stillThere) setSubId("");
  }

  function toggleName(list: string[], value: string, setList: (next: string[]) => void) {
    if (list.includes(value)) setList(list.filter((item) => item !== value));
    else setList([...list, value]);
  }

  function addCustomColor() {
    const name = colorText.trim();
    if (!name) return;
    setExtraColors((current) => uniqueNames([...current, name]));
    setColors((current) => uniqueNames([...current, name]));
    setColorText("");
  }

  function addCustomSize() {
    const name = sizeText.trim();
    if (!name) return;
    setExtraSizes((current) => uniqueNames([...current, name]));
    setSizes((current) => uniqueNames([...current, name]));
    setSizeText("");
  }

  function addFiles(list: FileList | null) {
    if (!list) return;
    // FileList بعد از خالی شدن input از بین می‌رود؛ پس همین‌جا کپی می‌شود
    const files = Array.from(list).filter((file) => file.type.startsWith("image/"));
    if (files.length === 0) {
      setError("فقط فایل عکس قابل افزودن است.");
      return;
    }

    const stamp = Date.now();
    const next = files.map((file, index) => ({
      key: `new-${stamp}-${index}-${file.name}`,
      file,
      preview: URL.createObjectURL(file),
    }));
    setPhotos((current) => [...current, ...next]);
    setError("");
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
        try {
          if (item.file) {
            const id = await uploadPhoto(item.file);
            photoIds.push(id);
          } else if (item.id) {
            photoIds.push(item.id);
          }
        } catch {
          setError(`عکس ${i + 1} آپلود نشد. دوباره همان عکس را اضافه کنید.`);
          setSaving(false);
          return;
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
        color: colors,
        size: sizes,
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
            <div key={item.key} className="relative">
              <button
                type="button"
                onClick={() => setZoom(item.preview)}
                className="block size-16 overflow-hidden rounded-lg"
                aria-label={`باز کردن عکس ${index + 1}`}
              >
                <SafeImage
                  src={item.preview}
                  alt=""
                  className="size-16 rounded-lg bg-neutral-03 object-cover"
                />
              </button>
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

      <ChoiceField
        label="رنگ‌ها"
        options={colorOptions}
        selected={colors}
        text={colorText}
        placeholder="رنگ جدید"
        onToggle={(value) => toggleName(colors, value, setColors)}
        onText={setColorText}
        onAdd={addCustomColor}
        withSwatch
      />

      <ChoiceField
        label="سایزها"
        options={sizeOptions}
        selected={sizes}
        text={sizeText}
        placeholder="سایز جدید"
        onToggle={(value) => toggleName(sizes, value, setSizes)}
        onText={setSizeText}
        onAdd={addCustomSize}
      />

      <div className="flex flex-col gap-2 text-sm text-neutral-11">
        <span>توضیحات</span>
        <HtmlEditor html={product?.description ?? ""} onChange={setHtml} disabled={saving} />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {zoom ? (
        <button
          type="button"
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-6"
          onClick={() => setZoom("")}
          aria-label="بستن عکس"
        >
          <SafeImage
            src={zoom}
            alt=""
            className="max-h-[80vh] max-w-[90vw] rounded-xl object-contain"
          />
        </button>
      ) : null}

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
  if (!product) return [];

  return imageIds(product)
    .map((id, index) => ({
      key: `saved-${index}-${id}`,
      id,
      preview: fileUrl(id) || "",
    }))
    .filter((item) => item.preview);
}

function ChoiceField({
  label,
  options,
  selected,
  text,
  placeholder,
  onToggle,
  onText,
  onAdd,
  withSwatch = false,
}: {
  label: string;
  options: string[];
  selected: string[];
  text: string;
  placeholder: string;
  onToggle: (value: string) => void;
  onText: (value: string) => void;
  onAdd: () => void;
  withSwatch?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2 text-sm text-neutral-11">
      <span>{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(option)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${
                active
                  ? "border-black bg-neutral-01 text-black"
                  : "border-neutral-03 text-neutral-11"
              }`}
            >
              {withSwatch ? (
                <span
                  className="size-3.5 rounded-full border border-black/10"
                  style={{ backgroundColor: colorHex(option) }}
                />
              ) : null}
              {option}
            </button>
          );
        })}
      </div>
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(event) => onText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onAdd();
            }
          }}
          placeholder={placeholder}
          className={inputClass}
        />
        <button
          type="button"
          onClick={onAdd}
          className="shrink-0 rounded-lg border border-neutral-03 px-3 text-sm text-neutral-11 hover:bg-neutral-03"
        >
          افزودن
        </button>
      </div>
    </div>
  );
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
