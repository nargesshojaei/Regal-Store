"use client";

import { useEffect, useState } from "react";
import { cartLineId } from "@/lib/variants";

// سبد خرید در localStorage.
// هر قلم با کالا + رنگ + سایز جدا می‌شود.
// تعداد همه رنگ‌ها و سایزهای یک کالا از موجودی همان کالا بیشتر نمی‌شود.

export type CartProduct = {
  id: string;
  lineId: string;
  name: string;
  price: number;
  image: string;
  count: number;
  color: string;
  colorHex: string;
  size: string;
  stock: number;
};

export type AddResult = {
  ok: boolean;
  message: string;
};

const KEY = "regal-cart";
const EVENT = "regal-cart-change";

function normalizeItem(raw: Partial<CartProduct>): CartProduct | null {
  if (!raw.id || !raw.name) return null;

  const color = raw.color || "";
  const size = raw.size || "";
  const count = Number(raw.count) || 1;

  return {
    id: String(raw.id),
    lineId: raw.lineId || cartLineId(String(raw.id), color, size),
    name: raw.name,
    price: Number(raw.price) || 0,
    image: raw.image || "",
    count,
    color,
    colorHex: raw.colorHex || "",
    size,
    stock: Number(raw.stock) || 0,
  };
}

// موجودی ثبت‌نشده (سبدهای قدیمی) همان تعداد فعلی حساب می‌شود
function stockOf(item: CartProduct) {
  if (item.stock > 0) return item.stock;
  return item.count;
}

function clampToStock(items: CartProduct[]) {
  const next: CartProduct[] = [];

  for (const item of items) {
    const used = next
      .filter((row) => row.id === item.id)
      .reduce((sum, row) => sum + row.count, 0);
    const room = stockOf(item) - used;
    if (room < 1) continue;
    next.push({ ...item, count: Math.min(item.count, room) });
  }

  return next;
}

function readItems(): CartProduct[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];

    const items: CartProduct[] = [];
    for (const row of parsed) {
      const item = normalizeItem(row);
      if (item) items.push(item);
    }
    return clampToStock(items);
  } catch {
    return [];
  }
}

function writeItems(items: CartProduct[]) {
  window.localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(EVENT));
}

export function readCart(): CartProduct[] {
  return readItems();
}

export function cartTotal(items: CartProduct[]) {
  return items.reduce((sum, item) => sum + item.price * item.count, 0);
}

// سقف تعداد همین قلم، با کم کردن رنگ و سایزهای دیگر همان کالا
export function lineStockLimit(items: CartProduct[], item: CartProduct) {
  const others = items
    .filter((row) => row.id === item.id && row.lineId !== item.lineId)
    .reduce((sum, row) => sum + row.count, 0);
  return Math.max(1, stockOf(item) - others);
}

export function clearCart() {
  if (typeof window === "undefined") return;
  writeItems([]);
}

export function addCartItem(product: CartProduct): AddResult {
  const stock = product.stock;
  if (!stock || stock < 1) {
    return { ok: false, message: "این کالا موجود نیست." };
  }

  const current = readItems();
  const used = current
    .filter((item) => item.id === product.id)
    .reduce((sum, item) => sum + item.count, 0);
  const room = stock - used;

  if (room < 1) {
    return {
      ok: false,
      message: `از این کالا فقط ${stock} عدد موجود است.`,
    };
  }

  const count = Math.min(product.count, room);
  const lineId = product.lineId || cartLineId(product.id, product.color, product.size);
  const found = current.find((item) => item.lineId === lineId);
  let next: CartProduct[];

  if (found) {
    next = current.map((item) =>
      item.lineId === lineId ? { ...item, count: item.count + count, stock } : item,
    );
  } else {
    next = [...current, { ...product, lineId, count, stock }];
  }

  writeItems(next);

  if (count < product.count) {
    return {
      ok: true,
      message: `فقط ${count} عدد اضافه شد. موجودی این کالا ${stock} عدد است.`,
    };
  }

  return { ok: true, message: "به سبد خرید اضافه شد." };
}

export function useCart() {
  const [items, setItems] = useState<CartProduct[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    function sync() {
      setItems(readItems());
      setReady(true);
    }

    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  function add(product: CartProduct) {
    const result = addCartItem(product);
    setItems(readItems());
    return result;
  }

  function changeCount(lineId: string, count: number) {
    const current = readItems();
    const item = current.find((row) => row.lineId === lineId);
    if (!item) return;

    if (count < 1) {
      const next = current.filter((row) => row.lineId !== lineId);
      writeItems(next);
      setItems(next);
      return;
    }

    const max = lineStockLimit(current, item);
    const nextCount = Math.min(count, max);
    const next = current.map((row) =>
      row.lineId === lineId ? { ...row, count: nextCount } : row,
    );
    writeItems(next);
    setItems(next);
  }

  function remove(lineId: string) {
    const next = items.filter((item) => item.lineId !== lineId);
    writeItems(next);
    setItems(next);
  }

  function clear() {
    clearCart();
    setItems([]);
  }

  const totalCount = items.reduce((sum, item) => sum + item.count, 0);
  const totalPrice = cartTotal(items);

  return { items, add, changeCount, remove, clear, totalCount, totalPrice, ready };
}
