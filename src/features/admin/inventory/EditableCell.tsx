"use client";
//یک سلول جدول است که با کلیک به فیلد متن تبدیل می‌شود.
import { useEffect, useRef } from "react";

export default function EditableCell({
  show,
  text,
  isEdit,
  onClick,
  onType,
  onEsc,
}: {
  show: string;
  text: string;
  isEdit: boolean;
  onClick: () => void;
  onType: (value: string) => void;
  onEsc: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEdit) return;
    inputRef.current?.focus({ preventScroll: true });
  }, [isEdit]);

  if (!isEdit) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="rounded px-2 py-1 text-right hover:bg-neutral-03"
      >
        {show}
      </button>
    );
  }

  return (
    <input
      ref={inputRef}
      value={text}
      inputMode="numeric"
      onChange={(e) => onType(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Escape") onEsc();
      }}
      className="h-9 w-28 rounded-lg border border-primary bg-white px-2 text-sm outline-none"
    />
  );
}
