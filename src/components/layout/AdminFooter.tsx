import { Copyright } from "lucide-react";

export default function AdminFooter() {
  return (
    <footer
      dir="rtl"
      className="border-t border-neutral-03 bg-white text-neutral-09"
    >
      <div className="flex flex-col items-center justify-between gap-2 px-4 py-4 text-center text-xs leading-6 sm:px-6 sm:text-sm md:flex-row md:px-8 md:text-right">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span>پنل مدیریت رگال — تمامی حقوق محفوظ است.</span>
          <Copyright className="size-4" strokeWidth={1.5} />
        </div>
        <p className="text-neutral-08">فقط برای استفاده داخلی تیم</p>
      </div>
    </footer>
  );
}
