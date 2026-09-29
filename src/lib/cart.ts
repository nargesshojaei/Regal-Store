"use client";

import { useEffect, useState } from "react";

// سبد خرید ساده در localStorage
// هر قلم: آیدی، نام، قیمت واحد، عکس، تعداد

export type CartProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
  count: number;
};

const KEY = "regal-cart";
const EVENT = "regal-cart-change";

function readItems(): CartProduct[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeItems(items: CartProduct[]) {
  window.localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(EVENT));
}

// درگاه و ثبت سفارش بدون هوک هم بتوانند سبد را بخوانند
export function readCart(): CartProduct[] {
  return readItems();
}

// جمع سبد = قیمت هر کالا ضربدر تعدادش
export function cartTotal(items: CartProduct[]) {
  return items.reduce((sum, item) => sum + item.price * item.count, 0);
}

// فقط بعد از پرداخت موفق صدا زده می‌شود
export function clearCart() {
  if (typeof window === "undefined") return;
  writeItems([]);
}

export function useCart() {
  const [items, setItems] = useState<CartProduct[]>([]);
  // تا ready نشود، خالی بودن سبد را جدی نگیر
  // چون localStorage فقط داخل مرورگر قابل خواندن است
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

  // اگر کالا از قبل در سبد باشد، تعدادش زیاد می‌شود
  function add(product: CartProduct) {
    const current = readItems();
    const found = current.find((item) => item.id === product.id);
    let next: CartProduct[];

    if (found) {
      next = current.map((item) =>
        item.id === product.id
          ? { ...item, count: item.count + product.count }
          : item,
      );
    } else {
      next = [...current, product];
    }

    writeItems(next);
    setItems(next);
  }

  function changeCount(id: string, count: number) {
    const next =
      count < 1
        ? items.filter((item) => item.id !== id)
        : items.map((item) => (item.id === id ? { ...item, count } : item));

    writeItems(next);
    setItems(next);
  }

  function remove(id: string) {
    const next = items.filter((item) => item.id !== id);
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
