import { api } from "./client";
// آپلود عکس کالا

{/*آپلود عکس. فایل را با FormData به POST /upload می‌فرستد (اگر نبود /files). اسم فایل برگشتی را برمی‌گرداند تا در کالا ذخیره شود. */}
function fileName(result: unknown) {
  if (typeof result === "string" && result.trim()) {
    return result.replace(/^["']|["']$/g, "").trim();
  }

  if (result && typeof result === "object") {
    const row = result as Record<string, unknown>;
    const value = row.filename ?? row.name ?? row.id ?? row.thumbnail;
    if (typeof value === "string" || typeof value === "number") {
      return String(value);
    }
  }

  throw new Error("آپلود عکس ناموفق بود.");
}

export async function uploadPhoto(file: File) {
  const body = new FormData();
  body.append("image", file);

  try {
    return fileName(await api("/upload", { method: "POST", body }));
  } catch {
    const again = new FormData();
    again.append("image", file);
    return fileName(await api("/files", { method: "POST", body: again }));
  }
}
