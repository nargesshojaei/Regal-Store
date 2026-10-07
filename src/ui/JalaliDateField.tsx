"use client";

// انتخاب تاریخ شمسی با یک آیکون تقویم.
// مقدار خروجی همچنان 2026-10-05 است تا اعتبارسنجی فرم ساده بماند.
import { useEffect, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { faDigits } from "@/lib/format";
import {
  isoToJalali,
  jalaliMonthLength,
  jalaliToIso,
  JALALI_MONTHS,
  shiftJalaliMonth,
  todayJalali,
  type JalaliDate,
} from "@/lib/jalali";

const WEEK_DAYS = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

function weekStart(date: JalaliDate) {
  const iso = jalaliToIso({ year: date.year, month: date.month, day: 1 });
  const parts = iso.split("-").map(Number);
  const jsDay = new Date(parts[0], parts[1] - 1, parts[2]).getDay();
  // شنبه اول هفته است. getDay یکشنبه را ۰ می‌دهد.
  return (jsDay + 1) % 7;
}

function showJalali(iso: string) {
  const date = isoToJalali(iso);
  if (!date) return "";
  const month = String(date.month).padStart(2, "0");
  const day = String(date.day).padStart(2, "0");
  return faDigits(`${date.year}/${month}/${day}`);
}

export default function JalaliDateField({
  value,
  min,
  onChange,
}: {
  value: string;
  min: string;
  onChange: (iso: string) => void;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<JalaliDate>(() => isoToJalali(value) || todayJalali());

  useEffect(() => {
    if (!open) return;

    function closeOnOutside(event: MouseEvent) {
      if (!boxRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  function openCalendar() {
    setView(isoToJalali(value) || todayJalali());
    setOpen(true);
  }

  const daysInMonth = jalaliMonthLength(view.year, view.month);
  const blanks = weekStart(view);
  const cells: Array<number | null> = [];

  for (let i = 0; i < blanks; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);

  return (
    <div ref={boxRef} className="relative">
      <button
        type="button"
        onClick={openCalendar}
        className="flex h-11 w-full items-center gap-3 rounded-lg border border-neutral-03 bg-white px-3 text-sm text-black"
      >
        <Calendar className="size-4 shrink-0 text-primary" strokeWidth={1.75} />
        <span className={value ? "text-black" : "text-neutral-08"}>
          {value ? showJalali(value) : "انتخاب تاریخ شمسی"}
        </span>
      </button>

      {open ? (
        <div className="absolute inset-x-0 z-30 mt-2 w-full max-w-72 rounded-2xl border border-neutral-03 bg-white p-3 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              aria-label="ماه قبل"
              onClick={() => setView((current) => shiftJalaliMonth(current, -1))}
              className="flex size-8 items-center justify-center rounded-full hover:bg-neutral-03"
            >
              <ChevronRight className="size-4" strokeWidth={1.5} />
            </button>
            <p className="text-sm text-black">
              {JALALI_MONTHS[view.month - 1]} {faDigits(view.year)}
            </p>
            <button
              type="button"
              aria-label="ماه بعد"
              onClick={() => setView((current) => shiftJalaliMonth(current, 1))}
              className="flex size-8 items-center justify-center rounded-full hover:bg-neutral-03"
            >
              <ChevronLeft className="size-4" strokeWidth={1.5} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs text-neutral-08">
            {WEEK_DAYS.map((day) => (
              <span key={day} className="py-1">
                {day}
              </span>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1">
            {cells.map((day, index) => {
              if (!day) return <span key={`empty-${index}`} />;

              const iso = jalaliToIso({ year: view.year, month: view.month, day });
              const disabled = Boolean(min) && iso < min;
              const selected = iso === value;

              return (
                <button
                  key={iso}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    onChange(iso);
                    setOpen(false);
                  }}
                  className={`flex h-8 items-center justify-center rounded-full text-sm ${
                    selected
                      ? "bg-black text-white"
                      : "text-black hover:bg-neutral-03 disabled:text-neutral-08 disabled:hover:bg-transparent"
                  }`}
                >
                  {faDigits(day)}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
