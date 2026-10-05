// رنگ و سایز کالا.
// رنگ‌های آماده برای مودال ادمین، و شناسه هر قلم سبد (کالا + رنگ + سایز).

export type ColorChoice = {
  name: string;
  hex: string;
};

export const COLOR_CHOICES: ColorChoice[] = [
  { name: "مشکی", hex: "#111111" },
  { name: "نقره‌ای", hex: "#c0c0c0" },
  { name: "طلایی", hex: "#c9a227" },
  { name: "قهوه‌ای", hex: "#6b3e26" },
  { name: "سفید", hex: "#f4f1ec" },
  { name: "کرم", hex: "#e6d7c3" },
  { name: "بژ", hex: "#d4c4a8" },
  { name: "صورتی", hex: "#e8b4c4" },
  { name: "رزگلد", hex: "#c9a27a" },
  { name: "سرمه‌ای", hex: "#1e2a4a" },
  { name: "آبی", hex: "#6b8cae" },
  { name: "زرشکی", hex: "#7a1f2b" },
  { name: "قرمز", hex: "#b42318" },
  { name: "سبز", hex: "#6b7c4f" },
  { name: "زیتونی", hex: "#8a8f6a" },
  { name: "شتری", hex: "#b08968" },
  { name: "طوسی", hex: "#8a8a90" },
  { name: "لیمویی", hex: "#e4d48a" },
  { name: "هلویی", hex: "#e8b4a0" },
  { name: "نعنایی", hex: "#c5d5c0" },
];

export const SIZE_CHOICES = ["36", "38", "40", "42", "44", "46"];

export function colorHex(name: string) {
  const exact = COLOR_CHOICES.find((item) => item.name === name);
  if (exact) return exact.hex;

  const partial = COLOR_CHOICES.find((item) => name.includes(item.name));
  return partial ? partial.hex : "#b19276";
}

// متن سرور گاهی آرایه است، گاهی یک رشته با ویرگول
export function nameList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value !== "string") return [];

  const text = value.trim();
  if (!text) return [];

  if (text.startsWith("[")) {
    try {
      return nameList(JSON.parse(text));
    } catch {
      // اگر JSON نبود، پایین با ویرگول جدا می‌شود
    }
  }

  if (text.includes(",")) {
    return text.split(",").map((item) => item.trim()).filter(Boolean);
  }

  return [text];
}

export function uniqueNames(values: string[]) {
  const list: string[] = [];

  for (const value of values) {
    const name = value.trim();
    if (name && !list.includes(name)) list.push(name);
  }

  return list;
}

// هر ترکیب کالا/رنگ/سایز یک قلم جدا در سبد است
export function cartLineId(productId: string, color: string, size: string) {
  return `${productId}::${color}::${size}`;
}
