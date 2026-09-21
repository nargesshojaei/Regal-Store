"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Badge from "@/ui/Badge";
import LookImage from "@/ui/LookImage";

// گالری عکس کالا
// عکس بزرگ + لیست عکس‌ها که اسکرول می‌شوند
export default function ProductGallery({
  photos,
  name,
  discountPercent,
}: {
  photos: string[];
  name: string;
  discountPercent?: number;
}) {
  const [index, setIndex] = useState(0);
  const list = photos.length > 0 ? photos : [""];
  const current = list[index] || list[0];
  const hasMany = list.length > 1;

  function goTo(next: number) {
    if (next < 0) {
      setIndex(list.length - 1);
      return;
    }
    if (next >= list.length) {
      setIndex(0);
      return;
    }
    setIndex(next);
  }

  return (
    <div className="flex flex-col-reverse gap-3 md:h-[560px] md:flex-row">
      {hasMany ? (
        <div className="flex items-center gap-2 md:h-full md:w-[88px] md:flex-col">
          <button
            type="button"
            aria-label="عکس قبلی"
            onClick={() => goTo(index - 1)}
            className="hidden size-8 shrink-0 items-center justify-center rounded-full border border-neutral-03 text-neutral-11 md:flex"
          >
            <ChevronUp className="size-4" strokeWidth={1.5} />
          </button>

          <div className="no-scrollbar flex w-full gap-2 overflow-x-auto md:h-full md:flex-col md:overflow-y-auto">
            {list.map((src, photoIndex) => (
              <button
                key={`${src}-${photoIndex}`}
                type="button"
                onClick={() => setIndex(photoIndex)}
                className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-xl border ${
                  photoIndex === index
                    ? "border-black"
                    : "border-neutral-03"
                }`}
                aria-label={`عکس ${photoIndex + 1}`}
              >
                {src ? (
                  <img
                    src={src}
                    alt=""
                    className="size-full object-cover object-top"
                  />
                ) : (
                  <span className="block size-full bg-neutral-03" />
                )}
              </button>
            ))}
          </div>

          <button
            type="button"
            aria-label="عکس بعدی"
            onClick={() => goTo(index + 1)}
            className="hidden size-8 shrink-0 items-center justify-center rounded-full border border-neutral-03 text-neutral-11 md:flex"
          >
            <ChevronDown className="size-4" strokeWidth={1.5} />
          </button>
        </div>
      ) : null}

      <LookImage src={current} alt={name} className="min-h-[360px] w-full lg:h-full">
        {discountPercent ? (
          <span className="absolute top-4 left-4 z-10">
            <Badge>٪{discountPercent}</Badge>
          </span>
        ) : null}
      </LookImage>
    </div>
  );
}
