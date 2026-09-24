"use client";

import { useState } from "react";
import { fileUrl } from "@/lib/api/client";
import { productPhoto, type Product } from "@/lib/api/products";

// عکس کالا. اگر لینک خراب باشد، عکس بعدی را امتحان می‌کند.
export default function ProductPhoto({
  product,
  src,
  alt,
}: {
  product?: Product;
  src?: string;
  alt?: string;
}) {
  const photos: string[] = [];

  if (src) {
    const url = fileUrl(src);
    if (url) photos.push(url);
  }
//عکس کالا را نشان می‌دهد و اگر لینک خراب باشد عکس بعدی را امتحان می‌کند.
  if (product) {
    const main = productPhoto(product);
    if (main && !photos.includes(main)) photos.push(main);

    const extra = product.image || [];
    for (let i = 0; i < extra.length; i++) {
      const url = fileUrl(extra[i]);
      if (url && !photos.includes(url)) photos.push(url);
    }
  }

  const [index, setIndex] = useState(0);
  const photo = photos[index];

  if (!photo) {
    return <div className="size-12 rounded-lg bg-neutral-03" />;
  }

  return (
    <img
      src={photo}
      alt={alt || product?.name || ""}
      className="size-12 rounded-lg bg-neutral-03 object-cover"
      onError={() => setIndex(index + 1)}
    />
  );
}
