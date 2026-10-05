import { api, cleanFileId } from "./client";
// آپلود عکس کالا. هر فایل جدا فرستاده می‌شود تا عکس دوم هم ذخیره شود.

function fileName(result: unknown): string {
  if (Array.isArray(result)) {
    for (const item of result) {
      const id = cleanFileId(item);
      if (id) return id;
    }
  }

  const id = cleanFileId(result);
  if (id) return id;
  throw new Error("آپلود عکس ناموفق بود.");
}

export async function uploadPhoto(file: File) {
  // اسم یکتا جلوی جایگزینی عکس دوم با عکس اول را می‌گیرد
  const uniqueName = `${Date.now()}-${file.name}`;
  const body = new FormData();
  body.append("image", file, uniqueName);

  try {
    return fileName(await api("/upload", { method: "POST", body }));
  } catch {
    const again = new FormData();
    again.append("image", file, uniqueName);
    return fileName(await api("/files", { method: "POST", body: again }));
  }
}
