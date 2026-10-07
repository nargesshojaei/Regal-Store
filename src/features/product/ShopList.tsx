"use client";
//جستجو، فیلتر، مرتب‌سازی و صفحه‌بندی ۹تایی فروشگاه را انجام می‌دهد.
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { Sub } from "@/lib/api/categories";
import type { ShopItem } from "@/lib/api/home";
import ProductCard from "@/features/product/ProductCard";
import ProductFilters, {
  type ShopFilters,
  type SortKey,
} from "@/features/product/ProductFilters";

const SHOP_PAGE_SIZE = 9;
const DEFAULT_SIZES = ["36", "38", "40", "42", "44", "46"];

function defaultFilters(
  subNum?: number,
  bounds = { min: 0, max: 0 },
): ShopFilters {
  return {
    sort: "newest",
    types: subNum ? [subNum] : [],
    inStock: false,
    colors: [],
    sizes: [],
    sleeves: [],
    necks: [],
    lengths: [],
    priceMin: bounds.min,
    priceMax: bounds.max,
  };
}

function textOf(product: ShopItem) {
  return `${product.name} ${product.description}`;
}

function hasAny(selected: string[], haystack: string) {
  if (selected.length === 0) return true;
  return selected.some((item) => haystack.includes(item));
}

function sortProducts(items: ShopItem[], sort: SortKey) {
  const next = [...items];

  if (sort === "cheap") next.sort((a, b) => a.price - b.price);
  if (sort === "expensive") next.sort((a, b) => b.price - a.price);
  if (sort === "newest") next.sort((a, b) => b.createdAt - a.createdAt);
  if (sort === "discount") {
    next.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
  }

  return next;
}

function uniqueSorted(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, "fa"),
  );
}

function SearchField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-neutral-08"
        strokeWidth={1.5}
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="جستجوی کالا"
        className="h-11 w-full rounded-full border border-neutral-03 bg-white pr-11 pl-4 text-sm text-black outline-none placeholder:text-neutral-08 focus:border-neutral-08"
      />
    </div>
  );
}

function ShopPagination({
  page,
  pageCount,
  onPageChange,
}: {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}) {
  if (pageCount <= 1) return null;

  const items = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <nav aria-label="صفحه‌بندی" className="mt-12 flex items-center justify-center gap-2">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="flex size-8 items-center justify-center text-neutral-08 disabled:opacity-30"
        aria-label="صفحه قبل"
      >
        ›
      </button>
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onPageChange(item)}
          aria-current={item === page ? "page" : undefined}
          className={`flex size-8 items-center justify-center rounded-full text-sm ${
            item === page
              ? "bg-black text-white"
              : "text-neutral-08 hover:text-black"
          }`}
        >
          {item}
        </button>
      ))}
      <button
        type="button"
        disabled={page >= pageCount}
        onClick={() => onPageChange(page + 1)}
        className="flex size-8 items-center justify-center text-neutral-08 disabled:opacity-30"
        aria-label="صفحه بعد"
      >
        ‹
      </button>
    </nav>
  );
}

export default function ShopList({
  items,
  title,
  types,
  selectedSubId,
}: {
  items: ShopItem[];
  title: string;
  types: Sub[];
  selectedSubId?: number;
}) {
  const priceBounds = useMemo(() => {
    if (items.length === 0) return { min: 0, max: 0 };
    const prices = items.map((item) => item.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [items]);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<ShopFilters>(() =>
    defaultFilters(selectedSubId, priceBounds),
  );

  const colors = useMemo(
    () => uniqueSorted(items.flatMap((item) => item.colorNames)),
    [items],
  );

  const sizes = useMemo(() => {
    const fromProducts = uniqueSorted(items.flatMap((item) => item.sizes));
    return fromProducts.length > 0 ? fromProducts : DEFAULT_SIZES;
  }, [items]);

  const visible = useMemo(() => {
    const nameText = query.trim();

    const filtered = items.filter((item) => {
      if (nameText && !textOf(item).includes(nameText)) return false;
      if (filters.inStock && item.quantity <= 0) return false;
      if (filters.types.length > 0 && !filters.types.includes(Number(item.subcategoryId))) {
        return false;
      }
      if (
        filters.colors.length > 0 &&
        !item.colorNames.some((color) => filters.colors.includes(color))
      ) {
        return false;
      }
      if (
        filters.sizes.length > 0 &&
        !item.sizes.some((size) => filters.sizes.includes(size))
      ) {
        return false;
      }
      if (
        priceBounds.max > priceBounds.min &&
        (item.price < filters.priceMin || item.price > filters.priceMax)
      ) {
        return false;
      }

      const haystack = textOf(item);
      if (!hasAny(filters.sleeves, haystack)) return false;
      if (!hasAny(filters.necks, haystack)) return false;
      if (!hasAny(filters.lengths, haystack)) return false;

      return true;
    });

    return sortProducts(filtered, filters.sort);
  }, [items, query, filters, priceBounds]);

  const pageCount = Math.max(1, Math.ceil(visible.length / SHOP_PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paged = visible.slice(
    (currentPage - 1) * SHOP_PAGE_SIZE,
    currentPage * SHOP_PAGE_SIZE,
  );

  function updateFilters(next: ShopFilters) {
    setFilters(next);
    setPage(1);
  }

  const filterPanel = (
    <ProductFilters
      filters={filters}
      onChange={updateFilters}
      types={types}
      colors={colors}
      sizes={sizes}
      priceBounds={priceBounds}
    />
  );

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-medium text-black md:text-2xl">{title}</h1>
        <span className="text-sm text-neutral-08">({visible.length})</span>
      </div>

      <div className="mt-8 grid items-center gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-neutral-11">فیلترها</p>
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="inline-flex items-center gap-1.5 text-sm text-neutral-11 lg:hidden"
          >
            <SlidersHorizontal className="size-4" strokeWidth={1.5} />
            نمایش
          </button>
        </div>
        <SearchField
          value={query}
          onChange={(value) => {
            setQuery(value);
            setPage(1);
          }}
        />
      </div>

      <div className="mt-8 grid items-start gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
        <div className="hidden lg:block">{filterPanel}</div>
        <div>
          {paged.length === 0 ? (
            <p className="mt-10 text-sm text-neutral-09">کالایی پیدا نشد.</p>
          ) : (
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 sm:gap-y-10 md:grid-cols-3 md:gap-x-6">
              {paged.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <ShopPagination
            page={currentPage}
            pageCount={pageCount}
            onPageChange={setPage}
          />
        </div>
      </div>

      {filtersOpen ? (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            type="button"
            aria-label="بستن فیلترها"
            className="absolute inset-0 bg-black/35"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(20rem,88vw)] flex-col bg-white px-5 py-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm font-medium text-black">فیلترها</p>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="flex size-8 items-center justify-center rounded-full hover:bg-neutral-03"
                aria-label="بستن"
              >
                <X className="size-4" strokeWidth={1.5} />
              </button>
            </div>
            <div className="overflow-y-auto">{filterPanel}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
