export default function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex size-9 items-center justify-center rounded-full bg-white/95 text-[11px] text-neutral-11 shadow-sm">
      {children}
    </span>
  );
}
//دایره کوچک روی عکس کالا، مثلاً درصد تخفیف.