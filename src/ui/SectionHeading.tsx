type SectionHeadingProps = {
  title: string;
  align?: "start" | "center";
  className?: string;
};
//عنوان بخش‌ها با نقطه کنارش
export default function SectionHeading({
  title,
  align = "start",
  className = "",
}: SectionHeadingProps) {
  return (
    <div
      className={`flex items-center gap-2.5 ${
        align === "center" ? "justify-center text-center" : ""
      } ${className}`}
    >
      <h2 className="text-2xl font-semibold leading-snug text-black md:text-[28px]">
        {title}
      </h2>
      <span className="size-1.5 shrink-0 rounded-full bg-black" />
    </div>
  );
}
