import type { ReactNode } from "react";

type LookImageProps = {
  src?: string;
  alt: string;
  // اندازه قاب را از بیرون بده؛ مثلاً aspect-[3/4] یا h-full
  className?: string;
  children?: ReactNode;
};

// قاب مشترک همه عکس‌های فروشگاه.
// عکس از JSON سرور می‌آید.
// همه عکس‌ها حاشیه، شفافیت اولیه و هاور یکسان دارند.
export default function LookImage({
  src,
  alt,
  className = "",
  children,
}: LookImageProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[15px] border border-neutral-03 bg-neutral-01 ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 size-full object-cover object-top opacity-80 transition duration-300 ease-out group-hover:scale-[1.04] group-hover:opacity-100"
        />
      ) : (
        <div className="absolute inset-0 bg-neutral-03" />
      )}
      {children}
    </div>
  );
}
