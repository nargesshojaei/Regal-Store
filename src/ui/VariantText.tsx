import { colorHex } from "@/lib/variants";

// نمایش یک رنگ انتخاب‌شده، یا لیست رنگ و سایز کالا
export function ColorText({ name, hex }: { name?: string; hex?: string }) {
  if (!name) return <>—</>;

  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="size-3 rounded-full border border-black/10"
        style={{ backgroundColor: hex || colorHex(name) }}
      />
      {name}
    </span>
  );
}

export function ColorList({ names }: { names: string[] }) {
  if (names.length === 0) return <>—</>;

  return (
    <span className="flex flex-wrap gap-2">
      {names.map((name) => (
        <ColorText key={name} name={name} />
      ))}
    </span>
  );
}

export function SizeList({ names }: { names: string[] }) {
  if (names.length === 0) return <>—</>;
  return <span>{names.join("، ")}</span>;
}
