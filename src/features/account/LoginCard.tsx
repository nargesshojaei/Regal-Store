"use client";
//ورود با شماره موبایل است و همان شماره را در پروفایل ذخیره می‌کند.
// اگه کاربر خارج شده باشه، با شماره دوباره وارد حساب می‌شه
// شماره داخل همون پروفایل لوکال ذخیره می‌شه

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { readProfile, saveProfile, setLoggedIn } from "@/lib/account";

export default function LoginCard() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  function submit() {
    // شماره خیلی کوتاه رو قبول نمی‌کنیم
    if (phone.trim().length < 10) {
      setError("شماره موبایل را درست وارد کنید");
      return;
    }

    const profile = readProfile();
    profile.phone = phone.trim();
    saveProfile(profile);
    setLoggedIn(true);
  }

  return (
    <Card className="mx-auto mt-16 w-full max-w-md gap-4 p-6 shadow-none ring-neutral-03">
      <h1 className="text-lg font-medium text-black">ورود به حساب کاربری</h1>
      <p className="text-sm text-neutral-09">
        با شماره موبایل وارد شوید. اطلاعات روی همین مرورگر ذخیره می‌شود.
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

      <Button type="button" className="h-10 rounded-lg" onClick={submit}>
        ورود
      </Button>
    </Card>
  );
}
