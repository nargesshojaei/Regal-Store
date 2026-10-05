"use client";

import { fileUrl } from "@/lib/api/client";
import { imageIds, type Product } from "@/lib/api/products";
import SafeImage from "@/ui/SafeImage";

// عکس کوچک کالا در جدول‌ها. اگر لینک خراب باشد آدرس بعدی امتحان می‌شود.
export default function ProductPhoto({
  product,
  src,
  alt,
}: {
  product?: Product;
  src?: string;
  alt?: string;
}) {
  const ids = product ? imageIds(product) : [];
  const photo = src ? fileUrl(src) : fileUrl(ids[0]);

  if (!photo) {
    return <div className="size-12 rounded-lg bg-neutral-03" />;
  }

  return (
    <SafeImage
      src={photo}
      alt={alt || product?.name || ""}
      className="size-12 rounded-lg bg-neutral-03 object-cover"
    />
  );
}
