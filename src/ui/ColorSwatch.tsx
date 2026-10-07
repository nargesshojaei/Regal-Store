import type { ProductColor } from "@/types/product";

// دایره‌های رنگ. اگر onSelect باشد، رنگ انتخابی مشخص می‌شود.
export default function ColorSwatch({
  colors = [],
  selected = "",
  onSelect,
  size = "sm",
}: {
  colors?: ProductColor[];
  selected?: string;
  onSelect?: (name: string) => void;
  size?: "sm" | "md";
}) {
  if (colors.length === 0) return null;

  const box = size === "md" ? "size-6" : "size-3.5";

  return (
    <div className="flex max-w-full flex-wrap items-center gap-1.5">
      {colors.map((color) => {
        const active = selected === color.name;
        const className = `${box} rounded-full border ${
          active ? "ring-2 ring-black ring-offset-2" : "border-black/10"
        }`;

        if (!onSelect) {
          return (
            <span
              key={color.name}
              title={color.name}
              className={className}
              style={{ backgroundColor: color.hex }}
            />
          );
        }

        return (
          <button
            key={color.name}
            type="button"
            title={color.name}
            aria-label={color.name}
            aria-pressed={active}
            onClick={() => onSelect(color.name)}
            className={className}
            style={{ backgroundColor: color.hex }}
          />
        );
      })}
    </div>
  );
}
