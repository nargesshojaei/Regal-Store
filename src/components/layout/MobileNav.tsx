"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { getCategories, getSubs, type Category, type Sub } from "@/lib/api/categories";

const links = [
  { href: "/", label: "صفحه اصلی" },
  { href: "/shop", label: "فروشگاه" },
  { href: "/shop/discount", label: "تخفیف‌دارها" },
  { href: "/about", label: "درباره ما" },
  { href: "/account", label: "حساب کاربری" },
  { href: "/admin/login", label: "پنل مدیریت" },
];

export default function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subs, setSubs] = useState<Sub[]>([]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!open || categories.length > 0) return;

    async function load() {
      try {
        const [catResult, subResult] = await Promise.all([getCategories(), getSubs()]);
        setCategories(catResult.data || []);
        setSubs(subResult.data || []);
      } catch {
        setCategories([]);
        setSubs([]);
      }
    }

    load();
  }, [open, categories.length]);

  return (
    <>
      <button
        type="button"
        aria-label="منو"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="flex size-9 shrink-0 items-center justify-center rounded-lg text-black hover:bg-neutral-03 lg:hidden"
      >
        <Menu className="size-5" strokeWidth={1.5} />
      </button>

      {open ? (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <button
            type="button"
            aria-label="بستن منو"
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-[min(20rem,88vw)] flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-03 px-4 py-4">
              <p className="text-sm font-medium text-black">منو</p>
              <button
                type="button"
                aria-label="بستن"
                onClick={() => setOpen(false)}
                className="flex size-9 items-center justify-center rounded-lg hover:bg-neutral-03"
              >
                <X className="size-4" strokeWidth={1.5} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-3">
              {links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-lg px-3 py-3 text-sm ${
                    pathname === item.href
                      ? "bg-neutral-03 text-black"
                      : "text-neutral-11 hover:bg-neutral-01"
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              <button
                type="button"
                onClick={() => setCatsOpen((value) => !value)}
                className="mt-1 flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm text-neutral-11 hover:bg-neutral-01"
              >
                دسته‌بندی‌ها
                <ChevronDown
                  className={`size-4 transition-transform ${catsOpen ? "rotate-180" : ""}`}
                  strokeWidth={1.5}
                />
              </button>

              {catsOpen ? (
                <div className="space-y-4 px-3 pb-4">
                  {categories.length === 0 ? (
                    <p className="text-sm text-neutral-08">دسته‌بندی‌ای پیدا نشد.</p>
                  ) : (
                    categories.map((cat) => {
                      const children = subs.filter(
                        (item) => Number(item.category) === Number(cat.id),
                      );
                      return (
                        <div key={cat.id}>
                          <Link
                            href={`/shop?category=${cat.id}`}
                            className="text-sm font-medium text-black hover:text-primary"
                          >
                            {cat.name}
                          </Link>
                          {children.length > 0 ? (
                            <ul className="mt-1">
                              {children.map((sub) => (
                                <li key={sub.id}>
                                  <Link
                                    href={`/shop?category=${cat.id}&subcategory=${sub.id}`}
                                    className="block py-1 text-sm text-neutral-09 hover:text-primary"
                                  >
                                    {sub.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      );
                    })
                  )}
                </div>
              ) : null}
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}
