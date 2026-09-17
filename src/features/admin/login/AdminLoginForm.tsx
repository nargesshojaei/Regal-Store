"use client";
//فرم لاگین ادمین
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { loginAdmin } from "@/lib/auth/actions";
import { adminLoginSchema } from "@/lib/auth/admin-login-schema";

type FieldErrors = {
  username?: string;
  password?: string;
};

const fieldClass =
  "h-12 w-full rounded-lg border border-neutral-03 bg-neutral-01 px-4 text-sm text-black outline-none transition-all placeholder:text-neutral-08 focus:border-primary focus:bg-white focus:shadow-[0_0_0_4px_rgba(177,146,118,0.16)]";

export default function AdminLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const parsed = adminLoginSchema.safeParse({ username, password });

    if (!parsed.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (field === "username" || field === "password") {
          nextErrors[field] ??= issue.message;
        }
      }
      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});
    setPending(true);

    try {
      // Server Action لاگین را صدا می‌زند (fetch روی سرور)
      const result = await loginAdmin(parsed.data);
      if (result?.error) {
        setFormError(result.error);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <div
      dir="rtl"
      className="flex flex-col justify-center bg-gradient-to-b from-white to-neutral-01 px-8 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20"
    >
      <div className="mb-10 flex items-center gap-3 lg:hidden">
        <span className="text-2xl font-semibold tracking-tight text-black">رگال</span>
        <span className="rounded-full bg-primary-tint-02 px-3 py-1 text-xs text-primary">
          پنل مدیریت
        </span>
      </div>

      <div className="mb-8 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-tint-02 to-primary/30 text-primary">
        <LockKeyhole className="size-5" strokeWidth={1.5} />
      </div>

      <h1 className="text-2xl font-semibold leading-relaxed text-black">
        ورود به پنل مدیریت
      </h1>
      <p className="mt-3 text-sm leading-8 text-neutral-09">
        با حساب تیم وارد شوید تا به داشبورد، سفارش‌ها و محصولات دسترسی داشته باشید.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-6">
        <div className="flex flex-col gap-2.5">
          <label htmlFor="username" className="text-sm text-neutral-11">
            نام کاربری
          </label>
          <input
            id="username"
            name="username"
            autoComplete="username"
            placeholder="نام کاربری خود را وارد کنید"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className={fieldClass}
          />
          {fieldErrors.username ? (
            <p className="text-xs text-red-600">{fieldErrors.username}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2.5">
          <label htmlFor="password" className="text-sm text-neutral-11">
            رمز عبور
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="رمز عبور خود را وارد کنید"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={fieldClass}
          />
          {fieldErrors.password ? (
            <p className="text-xs text-red-600">{fieldErrors.password}</p>
          ) : null}
        </div>

        {formError ? (
          <p className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-center text-sm text-red-600">
            {formError}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 h-12 w-full rounded-lg bg-gradient-to-l from-primary-shade-08 via-primary to-primary-tint-09 text-sm text-white shadow-[0_10px_24px_rgba(177,146,118,0.35)] transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "در حال ورود..." : "ورود به پنل"}
        </button>
      </form>

      <Link
        href="/"
        className="mt-10 inline-flex items-center gap-2 text-sm text-neutral-09 transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-4" strokeWidth={1.5} />
        بازگشت به سایت
      </Link>
    </div>
  );
}
