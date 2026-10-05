"use client";
//اسکرول افقی برای لیست‌های موردی.
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HScroll({
  children,
  className = "",
  showArrows = true,
  align = "start",
}: {
  children: React.ReactNode;
  className?: string;
  showArrows?: boolean;
  align?: "start" | "center" | "end";
}) {
  const ref = useRef<HTMLDivElement>(null);

  const move = (dir: "next" | "prev") => {
    const el = ref.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.75, 380);
    const rtl = getComputedStyle(el).direction === "rtl";
    const delta = dir === "next" ? amount : -amount;
    el.scrollBy({ left: rtl ? -delta : delta, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={ref}
        className={`no-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-2 md:gap-6 ${
          align === "center"
            ? "items-center"
            : align === "end"
              ? "items-end"
              : "items-start"
        } ${className}`}
      >
        {children}
      </div>

      {showArrows ? (
        <>
          <button
            type="button"
            aria-label="قبلی"
            onClick={() => move("prev")}
            className="absolute top-1/2 right-0 z-10 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-03 bg-white text-black shadow-sm md:flex"
          >
            <ChevronRight className="size-4" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label="بعدی"
            onClick={() => move("next")}
            className="absolute top-1/2 left-0 z-10 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-03 bg-white text-black shadow-sm md:flex"
          >
            <ChevronLeft className="size-4" strokeWidth={1.5} />
          </button>
        </>
      ) : null}
    </div>
  );
}
