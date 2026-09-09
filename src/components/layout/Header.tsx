import Link from "next/link";
import { User, Heart, ShoppingCart, Search, ChevronDown } from "lucide-react";

const navLinks = [
  { label: "درباره ما", href: "/about" },
  { label: "تخفیف‌دار‌ها", href: "/shop/discount" },
  { label: "دسته‌بندی‌ها", href: "/shop", hasArrow: true },
  { label: "صفحه اصلی", href: "/", active: true },
];

const iconButtons = [
  { icon: User, label: "حساب کاربری", href: "/account" },
  { icon: Heart, label: "علاقه‌مندی‌ها", href: "/shop/wishlist" },
  { icon: ShoppingCart, label: "سبد خرید", href: "/cart" },
  { icon: Search, label: "جستجو", href: "/search" },
];

export default function Header() {
  return (
    <header
      dir="rtl"
      className="sticky top-0 z-50 flex w-full items-center gap-16 bg-white/90 px-6 py-6 backdrop-blur-md md:px-12"
    >
      {/* Icon actions */}
      <div className="flex flex-1 items-center gap-1">
        {iconButtons.map(({ icon: Icon, label, href }) => (
          <Link
            key={label}
            href={href}
            aria-label={label}
            className="flex items-center justify-center rounded-lg p-3 transition-colors hover:bg-neutral-03"
          >
            <Icon className="size-4" strokeWidth={1.5} />
          </Link>
        ))}
      </div>

      {/* Nav pill */}
      <nav className="hidden shrink-0 items-center gap-4 rounded-full border border-neutral-03 bg-neutral-01 px-6 lg:flex">
        {navLinks.map(({ label, href, hasArrow, active }) => (
          <Link
            key={label}
            href={href}
            className={`flex h-10 items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors hover:text-primary ${
              active ? "text-black" : "text-neutral-11"
            }`}
          >
            {hasArrow && <ChevronDown className="size-4" strokeWidth={1.5} />}
            {label}
          </Link>
        ))}
      </nav>

      {/* Logo */}
      <Link href="/" className="flex flex-1 justify-end" aria-label="رگال">
        <span className="text-2xl font-semibold tracking-tight text-black">
          رگال
        </span>
      </Link>
    </header>
  );
}
