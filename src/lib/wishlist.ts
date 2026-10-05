"use client";

import { useEffect, useState } from "react";

const KEY = "regal-wishlist";
const EVENT = "regal-wishlist-change";

function readIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function writeIds(ids: string[]) {
  window.localStorage.setItem(KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event(EVENT));
}

export function useWishlist() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setIds(readIds());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const has = (id: string) => ids.includes(String(id));

  const toggle = (id: string) => {
    const key = String(id);
    const next = has(key) ? ids.filter((item) => item !== key) : [...ids, key];
    writeIds(next);
    setIds(next);
  };

  return { ids, has, toggle };
}
