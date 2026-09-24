"use client";
//اگر کاربر خارج باشد فرم ورود را نشان می‌دهد؛ منو و محتوای صفحه را کنار هم می‌گذارد.
// قاب مشترک صفحات حساب: منو + محتوای صفحه
// چون با localStorage کار می‌کنیم این قسمت کلاینت است

import AccountSidebar from "@/features/account/AccountSidebar";
import LoginCard from "@/features/account/LoginCard";
import { useLoggedIn } from "@/lib/account";

export default function AccountShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const loggedIn = useLoggedIn();

  if (loggedIn === null) {
    return <p className="px-6 py-16 text-center text-sm text-neutral-09">در حال بارگذاری...</p>;
  }

  if (!loggedIn) {
    return (
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <LoginCard />
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl items-start gap-5 px-4 py-8 md:grid-cols-[280px_minmax(0,1fr)] md:px-8 md:py-10">
      {/* با dir=rtl ستون اول سمت راست قرار می‌گیرد */}
      <AccountSidebar />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
