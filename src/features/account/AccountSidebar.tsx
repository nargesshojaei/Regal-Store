"use client";
//آواتار، نام، شماره و لینک پروفایل، سفارش، علاقه‌مندی و آدرس است. خروج، فلگ ورود را خاموش می‌کند.
// منوی سمت راست حساب کاربری
// لینک‌ها به صفحات خود حساب وصل هستن

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Heart, LogOut, MapPin, Package, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  profileName,
  setLoggedIn,
  showPhone,
  useProfile,
} from "@/lib/account";

const links = [
  { href: "/account", label: "حساب کاربری", icon: User, exact: true },
  { href: "/account/orders", label: "پیگیری سفارشات", icon: Package, exact: false },
  { href: "/account/favorites", label: "علاقه‌مندی‌ها", icon: Heart, exact: false },
  { href: "/account/addresses", label: "آدرس‌های من", icon: MapPin, exact: false },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const profile = useProfile();

  const name = profile ? profileName(profile) : "کاربر رگال";
  const phone = profile ? showPhone(profile.phone) : "";

  // خروج فقط فلگ لوکال رو خاموش می‌کنه، بعد می‌ره صفحه اصلی
  function logout() {
    setLoggedIn(false);
    router.push("/");
  }

  return (
    <aside className="flex flex-col gap-4">
      <Card className="gap-3 p-4 shadow-none ring-neutral-03">
        <div className="flex items-center gap-3">
          <Avatar className="size-12">
            <AvatarFallback className="bg-primary-tint-02 text-primary">
              <User className="size-5" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-black">{name}</p>
            <p className="mt-1 text-xs text-neutral-08" dir="ltr">
              {phone}
            </p>
          </div>
        </div>
      </Card>

      <Card className="gap-1 p-2 shadow-none ring-neutral-03">
        <nav className="flex gap-1 overflow-x-auto md:flex-col">
        {links.map((item) => {
          const Icon = item.icon;
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-sm whitespace-nowrap transition-colors md:whitespace-normal ${
                active
                  ? "bg-neutral-03 text-black"
                  : "text-neutral-11 hover:bg-neutral-01"
              }`}
            >
              <Icon className="size-4" strokeWidth={1.6} />
              {item.label}
          </Link>
        );
        })}
        </nav>

        <Separator className="my-1" />

        <Button
          type="button"
          variant="ghost"
          onClick={logout}
          className="h-10 w-full justify-start px-3 text-red-500 hover:bg-red-50 hover:text-red-500"
        >
          <LogOut className="size-4" />
          خروج
        </Button>
      </Card>
    </aside>
  );
}
