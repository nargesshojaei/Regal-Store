import type { ProductColor } from "@/types/product";

export default function ColorSwatch({ colors = [] }: { colors?: ProductColor[] }) {
  if (colors.length === 0) return null;
//دایره‌های رنگ کالا.
  return (
    <div className="flex items-center gap-1.5">
      {colors.map((color) => (
        <span
          key={color.name}
          title={color.name}
          className="size-3.5 rounded-full border border-black/10"
          style={{ backgroundColor: color.hex }}
        />
      ))}
    </div>
  );
}
