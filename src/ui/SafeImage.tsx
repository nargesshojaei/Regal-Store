"use client";

// عکس کالا. اگر آدرس اول خراب باشد، آدرس‌های جایگزین را امتحان می‌کند.
import { useState } from "react";
import { fileCandidates } from "@/lib/api/client";

export default function SafeImage({
  src,
  alt,
  className = "",
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const urls = fileCandidates(src);
  const [index, setIndex] = useState(0);
  const current = urls[index];

  if (!current) {
    return (
      <span
        className={`flex items-center justify-center bg-neutral-03 text-[10px] text-neutral-08 ${className}`}
      >
        عکس باز نشد
      </span>
    );
  }

  return (
    <img
      src={current}
      alt={alt}
      className={className}
      onError={() => setIndex((value) => value + 1)}
    />
  );
}
