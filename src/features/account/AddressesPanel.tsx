"use client";
// انجام میدهد: فزودن در دو مرحله (نقطه روی نقشه، بعد فرم)، ویرایش، حذف و آدرس پیش‌فرض را
// لیست آدرس‌ها
// افزودن دو مرحله دارد: اول نقشه، بعد فرم جزئیات
// حذف و ویرایش هم داخل localStorage ذخیره می‌شود

import { useState } from "react";
import { MapPin, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  addressText,
  removeAddress,
  saveAddress,
  useAddresses,
  type Address,
} from "@/lib/account";
import EmptyState from "./EmptyState";

// چند نقطه آماده روی نقشه تهران
const places = [
  { name: "نیاوران", text: "تهران، نیاوران، خیابان باهنر", top: "34%", right: "40%" },
  { name: "پاسداران", text: "تهران، پاسداران، خیابان گلستان", top: "46%", right: "28%" },
  { name: "ونک", text: "تهران، ونک، خیابان خدامی", top: "58%", right: "46%" },
  { name: "تجریش", text: "تهران، تجریش، میدان تجریش", top: "24%", right: "36%" },
  { name: "سعادت آباد", text: "تهران، سعادت‌آباد، میدان کتاب", top: "40%", right: "62%" },
];

const emptyForm: Address = {
  id: "",
  title: "خانه",
  province: "تهران",
  city: "تهران",
  line: "",
  plaque: "",
  unit: "",
  postalCode: "",
  receiver: "",
  phone: "",
  isDefault: false,
  mapText: "",
};

export default function AddressesPanel() {
  const addresses = useAddresses();
  const [mapOpen, setMapOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<Address>(emptyForm);
  const [query, setQuery] = useState("");
  const [pin, setPin] = useState(places[0]);
  const [error, setError] = useState("");

  if (!addresses) {
    return <p className="text-sm text-neutral-09">در حال بارگذاری...</p>;
  }

  const found = places.filter((place) => {
    if (!query.trim()) return true;
    return place.name.includes(query.trim()) || place.text.includes(query.trim());
  });

  function openAdd() {
    setQuery("");
    setPin(places[0]);
    setError("");
    setMapOpen(true);
  }

  // از روی نقشه می‌ره به فرم
  function goToForm() {
    setForm({
      ...emptyForm,
      id: String(Date.now()),
      line: pin.text,
      mapText: pin.text,
      isDefault: addresses!.length === 0,
    });
    setMapOpen(false);
    setFormOpen(true);
  }

  function openEdit(address: Address) {
    setForm(address);
    setError("");
    setFormOpen(true);
  }

  function change(key: keyof Address, value: string | boolean) {
    // مقدار قبلی فرم را نگه می‌داریم
    setForm((current) => {
      return { ...current, [key]: value };
    });
  }

  function save() {
    if (!form.line.trim() || !form.phone.trim() || !form.receiver.trim()) {
      setError("آدرس، نام گیرنده و شماره را پر کنید");
      return;
    }

    saveAddress({
      ...form,
      title: form.title.trim() || "خانه",
      province: form.province.trim() || "تهران",
      city: form.city.trim() || "تهران",
    });
    setFormOpen(false);
  }

  function remove(id: string) {
    const ok = window.confirm("این آدرس حذف شود؟");
    if (!ok) return;
    removeAddress(id);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-base font-medium text-black">لیست آدرس‌ها</h1>
        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-lg border-primary/40"
          onClick={openAdd}
        >
          افزودن آدرس جدید
        </Button>
      </div>

      {addresses.length === 0 ? (
        <Card className="shadow-none ring-neutral-03">
          <EmptyState
            text="شما در حال حاضر هیچ آدرسی ثبت نکرده‌اید!"
            action={
              <Button type="button" className="h-10 rounded-lg px-5" onClick={openAdd}>
                افزودن آدرس
              </Button>
            }
          />
        </Card>
      ) : (
        addresses.map((address) => (
          <Card key={address.id} className="gap-3 p-4 shadow-none ring-neutral-03">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-black">{address.title}</p>
                  {address.isDefault ? (
                    <Badge variant="secondary" className="rounded-full">
                      پیش‌فرض
                    </Badge>
                  ) : null}
                </div>
                <p className="text-sm leading-7 text-neutral-11">{addressText(address)}</p>
                <p className="text-xs text-neutral-08">
                  {address.receiver} | {address.phone} | کد پستی {address.postalCode || "—"}
                </p>
              </div>

              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="ویرایش آدرس"
                  onClick={() => openEdit(address)}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="حذف آدرس"
                  onClick={() => remove(address.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))
      )}

      {/* مرحله ۱: انتخاب روی نقشه */}
      <Dialog open={mapOpen} onOpenChange={setMapOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <DialogTitle>افزودن آدرس</DialogTitle>
            <DialogDescription>موقعیت را روی نقشه انتخاب کنید.</DialogDescription>
          </DialogHeader>

          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="جستجوی محله"
            className="h-10"
          />

          {query.trim() ? (
            <div className="max-h-28 space-y-1 overflow-auto">
              {found.map((place) => (
                <button
                  key={place.name}
                  type="button"
                  className="block w-full rounded-lg px-2 py-1.5 text-right text-sm hover:bg-neutral-03"
                  onClick={() => {
                    setPin(place);
                    setQuery("");
                  }}
                >
                  {place.text}
                </button>
              ))}
            </div>
          ) : null}

          <div className="relative h-56 overflow-hidden rounded-xl bg-[#efe8df]">
            <div className="absolute top-10 right-6 left-10 h-3 rounded-full bg-white/80" />
            <div className="absolute top-6 bottom-8 right-16 w-3 rounded-full bg-white/80" />
            <div className="absolute right-8 bottom-10 left-8 h-2 rounded-full bg-white/70" />
            <span
              className="absolute text-primary"
              style={{ top: pin.top, right: pin.right }}
            >
              <MapPin className="size-7 fill-primary text-white" />
            </span>
          </div>

          <p className="text-center text-xs text-neutral-09">{pin.text}</p>

          <Button type="button" className="h-11 rounded-lg" onClick={goToForm}>
            تایید و ادامه
          </Button>
        </DialogContent>
      </Dialog>

      {/* مرحله ۲: جزئیات آدرس */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>جزئیات آدرس</DialogTitle>
            {form.mapText ? (
              <DialogDescription>{form.mapText}</DialogDescription>
            ) : null}
          </DialogHeader>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="استان" value={form.province} onChange={(value) => change("province", value)} />
            <Field label="شهر" value={form.city} onChange={(value) => change("city", value)} />
          </div>
          <Field label="آدرس" value={form.line} onChange={(value) => change("line", value)} />
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="پلاک" value={form.plaque} onChange={(value) => change("plaque", value)} />
            <Field label="واحد" value={form.unit} onChange={(value) => change("unit", value)} />
          </div>
          <Field
            label="کد پستی"
            value={form.postalCode}
            onChange={(value) => change("postalCode", value)}
          />
          <div className="grid gap-3 md:grid-cols-2">
            <Field
              label="نام گیرنده"
              value={form.receiver}
              onChange={(value) => change("receiver", value)}
            />
            <Field label="شماره موبایل" value={form.phone} onChange={(value) => change("phone", value)} />
          </div>
          <Field label="عنوان آدرس" value={form.title} onChange={(value) => change("title", value)} />

          <label className="flex items-center gap-2 text-sm text-neutral-11">
            <Checkbox
              checked={form.isDefault}
              onCheckedChange={(value) => change("isDefault", value === true)}
            />
            این آدرس پیش‌فرض باشد
          </label>

          {error ? <p className="text-xs text-red-500">{error}</p> : null}

          <Button type="button" className="h-11 rounded-lg" onClick={save}>
            ثبت آدرس
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

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
