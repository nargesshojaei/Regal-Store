"use client";
//— مودال
{/*مودال مشترک: عنوان، محتوا، فوتر، دکمه بستن، Escape، قفل اسکرول صفحه */}
import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export default function Modal({
  open,
  title,
  onClose,
  children,
  footer,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="بستن"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-neutral-03 bg-white shadow-[0_24px_80px_rgba(35,29,24,0.18)]"
      >
        <div className="flex items-center justify-between border-b border-neutral-03 px-6 py-4">
          <h2 id="modal-title" className="text-lg font-semibold text-black">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-09 transition-colors hover:bg-neutral-03 hover:text-black"
            aria-label="بستن مودال"
          >
            <X className="size-4" strokeWidth={1.5} />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5">{children}</div>
        {footer ? (
          <div className="flex items-center justify-end gap-3 border-t border-neutral-03 px-6 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
