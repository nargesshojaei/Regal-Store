"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";
import RegalLogo from "@/components/brand/RegalLogo";
import { logoutAdmin } from "@/lib/auth/actions";

const navLinks = [
  { label: "داشبورد", href: "/admin" },
  { label: "محصولات", href: "/admin/products" },
  { label: "سفارش‌ها", href: "/admin/orders" },
  { label: "موجودی", href: "/admin/inventory" },
  { label: "وبلاگ", href: "/admin/blog" },
  { label: "نظرات", href: "/admin/testimonials" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === "/admin";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminHeader() {
  const pathname = usePathname();

  return (
    <header
      dir="rtl"
      className="sticky top-0 z-50 border-b border-neutral-03 bg-white/90 backdrop-blur-md"
    >
      <div className="flex w-full items-center gap-3 px-4 py-3 sm:gap-6 sm:px-6 sm:py-4 md:px-8">
        <Link href="/admin" className="flex min-w-0 shrink items-center gap-2 sm:gap-3">
          <RegalLogo className="h-7 w-auto sm:h-8" />
          <span className="hidden rounded-full bg-primary-tint-02 px-3 py-1 text-xs text-primary sm:inline">
            پنل مدیریت
          </span>
        </Link>

        <div className="ms-auto flex items-center gap-1">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-11 transition-colors hover:bg-neutral-03"
          >
            <ExternalLink className="size-4" strokeWidth={1.5} />
            <span className="hidden sm:inline">فروشگاه</span>
          </Link>
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-11 transition-colors hover:bg-neutral-03"
            >
              <LogOut className="size-4" strokeWidth={1.5} />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </form>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto border-t border-neutral-03 px-4 py-2 md:hidden">
        {navLinks.map(({ label, href }) => {
          const active = isActivePath(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={`shrink-0 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-neutral-03 hover:text-primary ${
                active ? "bg-neutral-03 text-black" : "text-neutral-11"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
