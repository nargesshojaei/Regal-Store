"use client";
// نوع فیلترها و کنترل‌های رنگ، سایز، قیمت و موجودی را تعریف می‌کند.
import { Check } from "lucide-react";
import { colorHex } from "@/lib/api/home";
import { formatPrice } from "@/lib/format";
import type { Sub } from "@/lib/api/categories";

export type SortKey = "popular" | "cheap" | "expensive" | "newest" | "discount";

export type ShopFilters = {
  sort: SortKey;
  types: number[];
  inStock: boolean;
  colors: string[];
  sizes: string[];
  sleeves: string[];
  necks: string[];
  lengths: string[];
  priceMin: number;
  priceMax: number;
};

export const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: "popular", label: "پرفروش‌ترین" },
  { id: "cheap", label: "ارزان‌ترین" },
  { id: "expensive", label: "گران‌ترین" },
  { id: "newest", label: "جدیدترین" },
  { id: "discount", label: "بیشترین تخفیف" },
];

export const SLEEVE_OPTIONS = ["بدون آستین", "کوتاه", "سه‌ربع", "بلند"];
export const NECK_OPTIONS = ["گرد", "هفت", "ایستاده", "دلبری"];
export const LENGTH_OPTIONS = ["کوتاه", "میدی", "بلند", "ماکسی"];

type ProductFiltersProps = {
  filters: ShopFilters;
  onChange: (next: ShopFilters) => void;
  types: Sub[];
  colors: string[];
  sizes: string[];
  priceBounds: { min: number; max: number };
};

function toggleValue(list: string[], value: string) {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

function FilterTitle({ children }: { children: string }) {
  return (
    <p className="mb-3 text-xs text-neutral-08">{children}</p>
  );
}

export default function ProductFilters({
  filters,
  onChange,
  types,
  colors,
  sizes,
  priceBounds,
}: ProductFiltersProps) {
  function patch(partial: Partial<ShopFilters>) {
    onChange({ ...filters, ...partial });
  }

  function toggleType(id: number) {
    const typesNext = filters.types.includes(id)
      ? filters.types.filter((item) => item !== id)
      : [...filters.types, id];
    patch({ types: typesNext });
  }

  const range = Math.max(1, priceBounds.max - priceBounds.min);

  return (
    <aside className="text-sm text-neutral-11">
      <section>
        <FilterTitle>مرتب‌سازی</FilterTitle>
        <div className="flex flex-col gap-2.5">
          {SORT_OPTIONS.map((option) => (
            <label key={option.id} className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="shop-sort"
                checked={filters.sort === option.id}
                onChange={() => patch({ sort: option.id })}
                className="size-3.5 accent-black"
              />
              <span className={filters.sort === option.id ? "text-black" : "text-neutral-11"}>
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </section>

      {types.length > 0 ? (
        <section className="mt-8">
          <FilterTitle>نوع لباس</FilterTitle>
          <div className="flex flex-col gap-2.5">
            {types.map((type) => (
              <label key={type.id} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.types.includes(Number(type.id))}
                  onChange={() => toggleType(Number(type.id))}
                  className="size-3.5 accent-black"
                />
                <span>{type.name}</span>
              </label>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-8">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={() => patch({ inStock: !filters.inStock })}
            className="size-3.5 accent-black"
          />
          <span>موجود</span>
        </label>
      </section>

      {colors.length > 0 ? (
        <section className="mt-8">
          <FilterTitle>رنگبندی</FilterTitle>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const selected = filters.colors.includes(color);
              return (
                <button
                  key={color}
                  type="button"
                  title={color}
                  aria-pressed={selected}
                  onClick={() => patch({ colors: toggleValue(filters.colors, color) })}
                  className={`relative size-5 rounded-full border ${
                    selected ? "border-black" : "border-black/10"
                  }`}
                  style={{ backgroundColor: colorHex(color) }}
                >
                  {selected ? (
                    <Check
                      className="absolute inset-0 m-auto size-3 text-white mix-blend-difference"
                      strokeWidth={2.4}
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

      {sizes.length > 0 ? (
        <section className="mt-8">
          <FilterTitle>سایزبندی</FilterTitle>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const selected = filters.sizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => patch({ sizes: toggleValue(filters.sizes, size) })}
                  className={`flex size-8 items-center justify-center rounded-full border text-[11px] ${
                    selected
                      ? "border-black bg-black text-white"
                      : "border-neutral-03 text-neutral-11 hover:border-neutral-08"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="mt-8">
        <FilterTitle>مدل آستین</FilterTitle>
        <div className="flex flex-col gap-2.5">
          {SLEEVE_OPTIONS.map((item) => (
            <label key={item} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={filters.sleeves.includes(item)}
                onChange={() => patch({ sleeves: toggleValue(filters.sleeves, item) })}
                className="size-3.5 accent-black"
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <FilterTitle>یقه</FilterTitle>
        <div className="flex flex-col gap-2.5">
          {NECK_OPTIONS.map((item) => (
            <label key={item} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={filters.necks.includes(item)}
                onChange={() => patch({ necks: toggleValue(filters.necks, item) })}
                className="size-3.5 accent-black"
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <FilterTitle>قد لباس</FilterTitle>
        <div className="flex flex-col gap-2.5">
          {LENGTH_OPTIONS.map((item) => (
            <label key={item} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={filters.lengths.includes(item)}
                onChange={() => patch({ lengths: toggleValue(filters.lengths, item) })}
                className="size-3.5 accent-black"
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <FilterTitle>قیمت</FilterTitle>
        <div className="relative h-7" dir="ltr">
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-neutral-03" />
          <div
            className="absolute top-1/2 h-px -translate-y-1/2 bg-black"
            style={{
              left: `${((filters.priceMin - priceBounds.min) / range) * 100}%`,
              right: `${((priceBounds.max - filters.priceMax) / range) * 100}%`,
            }}
          />
          <input
            type="range"
            min={priceBounds.min}
            max={priceBounds.max}
            step={Math.max(1000, Math.round(range / 80))}
            value={filters.priceMin}
            onChange={(event) => {
              const value = Number(event.target.value);
              patch({ priceMin: Math.min(value, filters.priceMax) });
            }}
            className="pointer-events-none absolute inset-x-0 top-1/2 h-1 w-full -translate-y-1/2 appearance-none bg-transparent accent-black [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:pointer-events-auto"
          />
          <input
            type="range"
            min={priceBounds.min}
            max={priceBounds.max}
            step={Math.max(1000, Math.round(range / 80))}
            value={filters.priceMax}
            onChange={(event) => {
              const value = Number(event.target.value);
              patch({ priceMax: Math.max(value, filters.priceMin) });
            }}
            className="pointer-events-none absolute inset-x-0 top-1/2 h-1 w-full -translate-y-1/2 appearance-none bg-transparent accent-black [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:pointer-events-auto"
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-08">
          <span>{formatPrice(filters.priceMin)}</span>
          <span>{formatPrice(filters.priceMax)}</span>
        </div>
      </section>
    </aside>
  );
}
