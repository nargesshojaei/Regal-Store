import Link from "next/link";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  type?: "button" | "submit";
  variant?: "dark" | "outline";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
};

export default function Button({
  children,
  href,
  type = "button",
  variant = "dark",
  className = "",
  onClick,
  disabled,
}: ButtonProps) {
  const styles =
    variant === "dark"
      ? "bg-black text-white hover:bg-neutral-12"
      : "border border-neutral-08 bg-white text-black hover:bg-neutral-01";

  const classNameAll = `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${styles} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classNameAll}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classNameAll}>
      {children}
    </button>
  );
}
