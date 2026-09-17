import { Copyright } from "lucide-react";

export default function AdminFooter() {
  return (
    <footer
      dir="rtl"
      className="border-t border-neutral-03 bg-white text-neutral-09"
    >
      <div className="flex flex-col items-center justify-between gap-2 px-6 py-4 text-sm md:flex-row md:px-8">
        <div className="flex items-center gap-2">
          <span>پنل مدیریت رگال — تمامی حقوق محفوظ است.</span>
          <Copyright className="size-4" strokeWidth={1.5} />
        </div>
        <p className="text-neutral-08">فقط برای استفاده داخلی تیم</p>
      </div>
    </footer>
  );
}
