"use client";
//نمایش و ویرایش نام، نام‌خانوادگی، تلفن و ایمیل است.
// صفحه اطلاعات حساب
// حالت دیدن و حالت ویرایش توی همین کامپوننت هست
// ذخیره = localStorage

//	فقط سفارش ثبت‌شده را نشان می‌دهد. وضعیت «در انتظار ارسال» یا «تحویل داده شده» است و با ادمین یکی است.
import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  saveProfile,
  showPhone,
  useProfile,
  type Profile,
} from "@/lib/account";

const viewRows = [
  { key: "firstName", label: "نام" },
  { key: "lastName", label: "نام‌خانوادگی" },
  { key: "phone", label: "شماره تلفن همراه" },
  { key: "email", label: "آدرس ایمیل" },
] as const;

function showValue(profile: Profile, key: (typeof viewRows)[number]["key"]) {
  if (key === "phone") return showPhone(profile.phone);
  const value = profile[key].trim();
  if (!value) return "وارد نشده است";
  return value;
}

export default function ProfilePanel() {
  const profile = useProfile();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Profile | null>(null);

  if (!profile) {
    return <p className="text-sm text-neutral-09">در حال بارگذاری...</p>;
  }

  function startEdit() {
    setForm({ ...profile! });
    setEditing(true);
  }

  function cancel() {
    setEditing(false);
    setForm(null);
  }

  function save() {
    if (!form) return;
    saveProfile({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
    });
    setEditing(false);
  }

  function change(key: keyof Profile, value: string) {
    // از مقدار قبلی استفاده می‌کنیم که فیلدهای دیگر پاک نشوند
    setForm((current) => {
      if (!current) return current;
      return { ...current, [key]: value };
    });
  }

  return (
    <Card className="gap-5 p-5 shadow-none ring-neutral-03 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-base font-medium text-black">اطلاعات حساب کاربری</h1>
        {editing ? null : (
          <Button
            type="button"
            variant="ghost"
            className="text-primary hover:text-primary"
            onClick={startEdit}
          >
            <Pencil className="size-4" />
            ویرایش اطلاعات
          </Button>
        )}
      </div>

      {editing && form ? (
        <div className="space-y-4">
          {/* توی راست‌به‌چپ، ستون اول سمت راست می‌افته */}
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="نام"
              value={form.firstName}
              onChange={(value) => change("firstName", value)}
            />
            <Field
              label="نام‌خانوادگی"
              value={form.lastName}
              onChange={(value) => change("lastName", value)}
            />
            <Field
              label="شماره موبایل"
              value={form.phone}
              onChange={(value) => change("phone", value)}
            />
            <Field
              label="آدرس ایمیل اختیاری"
              value={form.email}
              onChange={(value) => change("email", value)}
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="button" className="h-11 rounded-lg px-6" onClick={save}>
              ذخیره تغییرات
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-lg border-primary/40 px-6 text-neutral-11"
              onClick={cancel}
            >
              انصراف
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {viewRows.map((row) => (
            <div
              key={row.key}
              className="grid grid-cols-[9rem_1fr] items-center gap-3 rounded-xl border border-neutral-03 px-4 py-3"
            >
              <span className="text-sm text-black">{row.label}</span>
              {/* مقدار سمت چپ ردیف، مثل طرح */}
              <span
                dir={row.key === "phone" ? "ltr" : undefined}
                className="text-left text-sm text-neutral-08"
              >
                {showValue(profile, row.key)}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

// اینپوت طرح: برچسب ریز بالای مقدار
function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="rounded-xl border border-neutral-03 px-3 py-2">
      <Label className="text-xs font-normal text-neutral-08">{label}</Label>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 border-0 px-0 shadow-none focus-visible:ring-0"
      />
    </div>
  );
}
