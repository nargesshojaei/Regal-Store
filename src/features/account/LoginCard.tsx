"use client";
// ورود با شماره موبایل.
// شماره در json-server ذخیره می‌شود و همان کاربر در پروفایل می‌نشیند.

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveProfile, setLoggedIn } from "@/lib/account";
import { loginUser } from "@/lib/api/users";

export default function LoginCard() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit() {
    const cleanPhone = phone.trim();

    if (cleanPhone.length < 10) {
      setError("شماره موبایل را درست وارد کنید");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const user = await loginUser(cleanPhone);

      saveProfile({
        id: user.id || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || cleanPhone,
        email: user.email || "",
      });
      setLoggedIn(true);
    } catch {
      setError("json-server روشن نیست. در ترمینال npm run server را اجرا کنید.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="mx-auto mt-16 w-full max-w-md gap-4 p-6 shadow-none ring-neutral-03">
      <h1 className="text-lg font-medium text-black">ورود به حساب کاربری</h1>
      <p className="text-sm text-neutral-09">
        با شماره موبایل وارد شوید. اطلاعات در json-server ذخیره می‌شود.
      </p>

      <div className="space-y-2">
        <Label htmlFor="login-phone">شماره موبایل</Label>
        <Input
          id="login-phone"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="09120000000"
          className="h-10"
        />
        {error ? <p className="text-xs text-red-500">{error}</p> : null}
      </div>

      <Button
        type="button"
        className="h-10 rounded-lg"
        onClick={submit}
        disabled={saving}
      >
        {saving ? "در حال ذخیره..." : "ورود"}
      </Button>
    </Card>
  );
}
