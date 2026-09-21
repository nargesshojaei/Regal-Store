"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import type { DetailProduct } from "@/lib/api/home";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/product";
import Button from "@/ui/Button";
import ColorSwatch from "@/ui/ColorSwatch";
import SectionHeading from "@/ui/SectionHeading";
import WishlistButton from "@/ui/WishlistButton";
import ProductCard from "./ProductCard";
import ProductGallery from "./ProductGallery";

// متن ساده از توضیح HTML ادمین
function textOnly(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function CountBox({
  count,
  max,
  onChange,
}: {
  count: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const canMinus = count > 1;
  const canPlus = count < max;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-neutral-11">تعداد</span>
      <div className="flex items-center gap-2 rounded-full border border-neutral-03 px-2 py-1">
        <button
          type="button"
          aria-label="کم کردن"
          disabled={!canMinus}
          onClick={() => onChange(count - 1)}
          className="flex size-8 items-center justify-center rounded-full hover:bg-neutral-03 disabled:opacity-30"
        >
          <Minus className="size-3.5" strokeWidth={1.75} />
        </button>
        <span className="min-w-6 text-center text-sm text-black">{count}</span>
        <button
          type="button"
          aria-label="زیاد کردن"
          disabled={!canPlus}
          onClick={() => onChange(count + 1)}
          className="flex size-8 items-center justify-center rounded-full hover:bg-neutral-03 disabled:opacity-30"
        >
          <Plus className="size-3.5" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}

export default function ProductDetail({
  product,
  similar,
}: {
  product: DetailProduct;
  similar: Product[];
}) {
  const { add } = useCart();
  const [count, setCount] = useState(1);
  const [size, setSize] = useState(product.sizes[0] || "");
  const [added, setAdded] = useState(false);

  const maxCount = product.stock > 0 ? product.stock : 1;
  const inStock = product.stock > 0;
  const totalPrice = product.price * count;
  const oldTotal = product.originalPrice
    ? product.originalPrice * count
    : undefined;
  const shortText = textOnly(product.description);
  const isHtml = product.description.includes("<");

  function addToCart() {
    if (!inStock) return;

    add({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      count,
    });
    setAdded(true);
  }

  return (
    <div dir="rtl" className="mx-auto max-w-7xl px-6 py-10 md:px-12">
      <nav className="flex flex-wrap items-center gap-1 text-sm text-neutral-08">
        <Link href="/" className="hover:text-primary">
          صفحه اصلی
        </Link>
        {product.categoryName ? (
          <>
            <span>/</span>
            <Link
              href={`/shop?category=${product.categoryId}`}
              className="hover:text-primary"
            >
              {product.categoryName}
            </Link>
          </>
        ) : null}
        {product.subcategoryName ? (
          <>
            <span>/</span>
            <Link
              href={`/shop?category=${product.categoryId}&subcategory=${product.subcategoryId}`}
              className="hover:text-primary"
            >
              {product.subcategoryName}
            </Link>
          </>
        ) : null}
      </nav>

      <div className="mt-8 grid items-start gap-10 md:grid-cols-2">
        <ProductGallery
          photos={product.photos}
          name={product.name}
          discountPercent={product.discountPercent}
        />

        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-neutral-08">
                {[product.categoryName, product.subcategoryName]
                  .filter(Boolean)
                  .join(" / ") || "بدون دسته‌بندی"}
              </p>
              <h1 className="mt-2 text-2xl font-semibold text-black md:text-[28px]">
                {product.name}
              </h1>
            </div>
            <WishlistButton productId={product.id} />
          </div>

          <div className="mt-5 flex flex-wrap items-end gap-3">
            <p className="text-xl text-black">
              {formatPrice(totalPrice)} تومان
            </p>
            {oldTotal ? (
              <p className="text-sm text-neutral-08 line-through">
                {formatPrice(oldTotal)}
              </p>
            ) : null}
            {product.discountPercent ? (
              <span className="rounded-full bg-primary-tint-02 px-2.5 py-1 text-xs text-primary">
                ٪{product.discountPercent} تخفیف
              </span>
            ) : null}
          </div>

          {count > 1 ? (
            <p className="mt-2 text-xs text-neutral-08">
              {formatPrice(product.price)} تومان × {count}
            </p>
          ) : null}

          {shortText ? (
            <p className="mt-5 text-sm leading-8 text-neutral-11">
              {shortText.length > 220
                ? `${shortText.slice(0, 220)}...`
                : shortText}
            </p>
          ) : null}

          {product.colors && product.colors.length > 0 ? (
            <div className="mt-6">
              <p className="mb-2 text-sm text-neutral-11">رنگ‌بندی</p>
              <ColorSwatch colors={product.colors} />
            </div>
          ) : null}

          {product.sizes.length > 0 ? (
            <div className="mt-6">
              <p className="mb-2 text-sm text-neutral-11">سایزبندی</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setSize(item)}
                    className={`min-w-10 rounded-lg border px-3 py-2 text-sm ${
                      size === item
                        ? "border-black text-black"
                        : "border-neutral-03 text-neutral-09"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <CountBox
              count={count}
              max={maxCount}
              onChange={(value) => {
                setCount(value);
                setAdded(false);
              }}
            />
            <p className="text-sm text-neutral-08">
              {inStock ? `${product.stock} عدد موجود` : "ناموجود"}
            </p>
          </div>

          <div className="mt-6">
            <Button
              onClick={addToCart}
              disabled={!inStock}
              className="w-full sm:w-auto"
            >
              <ShoppingBag className="size-4" strokeWidth={1.5} />
              افزودن به سبد خرید
            </Button>
            {added ? (
              <p className="mt-3 text-sm text-primary">
                به سبد اضافه شد.{" "}
                <Link href="/cart" className="underline">
                  مشاهده سبد
                </Link>
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <section className="mt-16 border-t border-neutral-03 pt-10">
        <h2 className="text-lg font-semibold text-black">توضیحات محصول</h2>
        {product.description ? (
          isHtml ? (
            <div
              className="mt-4 text-sm leading-8 text-neutral-11"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          ) : (
            <p className="mt-4 text-sm leading-8 text-neutral-11">
              {product.description}
            </p>
          )
        ) : (
          <p className="mt-4 text-sm text-neutral-09">
            توضیحی برای این کالا ثبت نشده است.
          </p>
        )}
      </section>

      {similar.length > 0 ? (
        <section className="mt-16">
          <SectionHeading title="محصولات مشابه" />
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
            {similar.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
