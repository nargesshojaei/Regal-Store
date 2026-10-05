import Link from "next/link";
import { User, Search, LayoutDashboard } from "lucide-react";
import RegalLogo from "@/components/brand/RegalLogo";
import CategorySidebar from "@/components/layout/CategorySidebar";
import HeaderCartLink from "@/components/layout/HeaderCartLink";
import HeaderWishlistLink from "@/components/layout/HeaderWishlistLink";

const iconClass =
  "flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-neutral-03 md:size-10";

export default function Header() {
  return (
    <header
      dir="rtl"
      className="sticky top-0 z-50 bg-white/90 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-5 md:px-12">
        <Link href="/" className="flex flex-1 justify-start" aria-label="رگال">
          <RegalLogo className="h-8 w-auto md:h-9" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <Link
            href="/"
            className="flex h-10 items-center rounded-lg px-4 text-sm text-black transition-colors hover:text-primary"
          >
            صفحه اصلی
          </Link>
          <CategorySidebar />
          <Link
            href="/shop/discount"
            className="flex h-10 items-center rounded-lg px-4 text-sm text-neutral-11 transition-colors hover:text-primary"
          >
            تخفیف‌دار‌ها
          </Link>
          <Link
            href="/about"
            className="flex h-10 items-center rounded-lg px-4 text-sm text-neutral-11 transition-colors hover:text-primary"
          >
            درباره ما
          </Link>
        </nav>

        <div className="flex flex-1 items-center justify-end gap-1">
          <Link href="/search" aria-label="جستجو" className={iconClass}>
            <Search className="size-4" strokeWidth={1.5} />
          </Link>
          <HeaderWishlistLink />
          <HeaderCartLink />
          <Link href="/account" aria-label="حساب کاربری" className={iconClass}>
            <User className="size-4" strokeWidth={1.5} />
          </Link>
          <Link href="/admin/login" aria-label="پنل مدیریت" className={iconClass}>
            <LayoutDashboard className="size-4" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </header>
  );
}
