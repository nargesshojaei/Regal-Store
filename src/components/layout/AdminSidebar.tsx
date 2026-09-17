"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Warehouse,
  Newspaper,
  MessageSquareQuote,
} from "lucide-react";

const navLinks = [
  { label: "داشبورد", href: "/admin", icon: LayoutDashboard },
  { label: "محصولات", href: "/admin/products", icon: Package },
  { label: "سفارش‌ها", href: "/admin/orders", icon: ShoppingBag },
  { label: "موجودی", href: "/admin/inventory", icon: Warehouse },
  { label: "وبلاگ", href: "/admin/blog", icon: Newspaper },
  { label: "نظرات", href: "/admin/testimonials", icon: MessageSquareQuote },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === "/admin";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      dir="rtl"
      className="hidden w-56 shrink-0 border-l border-neutral-03 bg-white md:block"
    >
      <nav className="flex flex-col gap-1 p-4">
        {navLinks.map(({ label, href, icon: Icon }) => {
          const active = isActivePath(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-neutral-03 hover:text-primary ${
                active ? "bg-primary-tint-02 text-primary" : "text-neutral-11"
              }`}
            >
              <Icon className="size-4 shrink-0" strokeWidth={1.5} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
