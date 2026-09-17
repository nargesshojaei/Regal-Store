"use client";
//دکمه‌های صفحه

{/*دکمه‌های قبلی / شماره صفحه / بعدی. اگر فقط یک صفحه باشد نشان داده نمی‌شود. */}
type PaginationProps = {
  page: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  page,
  total,
  limit,
  onPageChange,
}: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / limit));
  if (pageCount <= 1) return null;

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <nav
      aria-label="صفحه‌بندی سفارش‌ها"
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
      {pages.map((item) => (
        <button
          key={item}
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
      ))}
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
