import { redirect } from "next/navigation";
import AdminLoginForm from "@/features/admin/login/AdminLoginForm";
import { hasAdminSession } from "@/lib/auth/admin-session";

export const dynamic = "force-dynamic";
//صفحه ورود ادمین است. اگر سشن باشد می‌رود داشبورد.
// صفحه ورود ادمین
export default async function AdminLoginPage() {
  if (await hasAdminSession()) {
    redirect("/admin");
  }

  return (
    <main
      dir="rtl"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-01 px-6 py-16 md:px-12 md:py-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-tint-02 via-neutral-01 to-primary/30"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 end-[-6%] size-[32rem] rounded-full bg-gradient-to-bl from-primary via-primary-tint-09 to-transparent opacity-50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 start-[-10%] size-[28rem] rounded-full bg-gradient-to-tr from-primary-shade-08/40 via-primary/20 to-transparent blur-3xl"
      />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-neutral-03 bg-white shadow-[0_30px_90px_rgba(35,29,24,0.12)] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <aside className="relative hidden overflow-hidden bg-gradient-to-br from-black via-primary-shade-08 to-primary px-12 py-16 text-white lg:flex lg:flex-col lg:justify-between lg:px-14 lg:py-20">
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/5"
          />
          <div
            aria-hidden
            className="absolute -bottom-20 -start-16 size-72 rounded-full bg-gradient-to-tr from-primary-tint-09/40 to-transparent blur-2xl"
          />

          <div className="relative flex items-center gap-3">
            <span className="text-[28px] font-semibold tracking-tight">رگال</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-primary-tint-02">
              پنل مدیریت
            </span>
          </div>

          <div className="relative">
            <div className="mb-5 flex items-center gap-2.5">
              <p className="text-sm text-primary-tint-02">دسترسی داخلی</p>
              <span className="size-1.5 rounded-full bg-primary-tint-09" />
            </div>
            <h2 className="text-3xl font-semibold leading-snug">
              مدیریت فروشگاه رگال در یک نگاه
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-8 text-white/80">
              محصولات، سفارش‌ها، موجودی و محتوا را از همین پنل کنترل کنید؛ با همان
              تم روشن و رنگ طلایی مجموعه.
            </p>
          </div>

          <p className="relative text-sm text-primary-tint-02/80">
            فقط برای استفاده داخلی تیم
          </p>
        </aside>

        <AdminLoginForm />
      </div>
    </main>
  );
}
