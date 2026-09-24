//حالت خالی آدرس، سفارش و علاقه‌مندی است: تصویر، متن و دکمه.
// حالت خالی صفحات حساب: عکس کوچک + متن + دکمه
export default function EmptyState({
  text,
  action,
}: {
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      {/* نقاشی ساده شبیه طرح خالی آدرس و سفارش */}
      <svg
        width="120"
        height="90"
        viewBox="0 0 120 90"
        fill="none"
        aria-hidden="true"
      >
        <ellipse cx="60" cy="78" rx="36" ry="6" fill="#efe9e4" />
        <path
          d="M38 70V42h44v28"
          stroke="#d9cfc4"
          strokeWidth="2"
        />
        <path d="M48 70V52h10v18" stroke="#d9cfc4" strokeWidth="2" />
        <path d="M34 42l26-16 26 16" stroke="#c4b5a4" strokeWidth="2" />
        <circle cx="78" cy="36" r="8" stroke="#c4b5a4" strokeWidth="2" />
        <path d="M78 28v-8" stroke="#c4b5a4" strokeWidth="2" />
      </svg>
      <p className="mt-4 max-w-xs text-sm text-neutral-09">{text}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
