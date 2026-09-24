"use client";
//دکمه‌های صفحه
//دکمه‌های صفحه قبل، شماره و بعد را نشان می‌دهد.
{/*دکمه‌های قبلی / شماره صفحه / بعدی. اگر فقط یک صفحه باشد نشان داده نمی‌شود.
از صفحه سوم به بعد بین شماره‌ها «...» می‌آید. */}
type PaginationProps = {
  page: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
};

function pageItems(page: number, pageCount: number): Array<number | "ellipsis"> {
  if (pageCount <= 3) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  let start = Math.max(1, page - 1);
  let end = Math.min(pageCount, start + 2);
  start = Math.max(1, end - 2);

  const items: Array<number | "ellipsis"> = [];

  if (start > 1) {
    items.push(1);
    if (start > 2) items.push("ellipsis");
  }

  for (let number = start; number <= end; number += 1) {
    items.push(number);
  }

  if (end < pageCount) {
    if (end < pageCount - 1) items.push("ellipsis");
    items.push(pageCount);
  }

  return items;
}

export default function Pagination({
  page,
  total,
  limit,
  onPageChange,
}: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / limit));
  if (pageCount <= 1) return null;

  const items = pageItems(page, pageCount);

  return (
    <nav
      aria-label="صفحه‌بندی"
      className="mt-6 flex items-center justify-center gap-1"
    >
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded-lg px-3 py-2 text-sm text-neutral-11 transition-colors hover:bg-neutral-03 disabled:cursor-not-allowed disabled:opacity-40"
      >
        قبلی
      </button>
      {items.map((item, index) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="min-w-9 px-2 py-2 text-center text-sm text-neutral-08"
            aria-hidden="true"
          >
            ...
          </span>
        ) : (
          <button
            key={`page-${item}-${index}`}
            type="button"
            onClick={() => onPageChange(item)}
            aria-current={item === page ? "page" : undefined}
            className={`min-w-9 rounded-lg px-3 py-2 text-sm transition-colors ${
              item === page
                ? "bg-primary text-white"
                : "text-neutral-11 hover:bg-neutral-03"
            }`}
          >
            {item}
          </button>
        ),
      )}
      <button
        type="button"
        disabled={page >= pageCount}
        onClick={() => onPageChange(page + 1)}
        className="rounded-lg px-3 py-2 text-sm text-neutral-11 transition-colors hover:bg-neutral-03 disabled:cursor-not-allowed disabled:opacity-40"
      >
        بعدی
      </button>
    </nav>
  );
}
